package ma.encg.chatservice.service.implementation;

import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.service.AdminService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final JdbcTemplate jdbc;

    @Value("${admin.rag.low-score-threshold:0.3}")
    private double lowScoreThreshold;

    public Map<String, Object> stats() {
        Map<String, Object> out = new LinkedHashMap<>();

        out.put("conversations", jdbc.queryForObject("SELECT count(*) FROM conversations", Long.class));
        out.put("guestConversations", jdbc.queryForObject(
                "SELECT count(*) FROM conversations WHERE id_user IS NULL", Long.class));
        out.put("messages", jdbc.queryForObject("SELECT count(*) FROM messages", Long.class));
        out.put("likes", jdbc.queryForObject(
                "SELECT count(*) FROM feedbacks WHERE feedback_type = 'LIKE'", Long.class));
        out.put("dislikes", jdbc.queryForObject(
                "SELECT count(*) FROM feedbacks WHERE feedback_type = 'DISLIKE'", Long.class));

        out.put("perDay", jdbc.queryForList("""
                SELECT to_char(created_at::date, 'YYYY-MM-DD') AS day, count(*) AS count
                FROM messages WHERE created_at >= now() - interval '14 days'
                GROUP BY 1 ORDER BY 1"""));

        out.put("topQuestions", jdbc.queryForList("""
                SELECT lower(trim(content)) AS question, count(*) AS count
                FROM messages GROUP BY 1 ORDER BY 2 DESC LIMIT 8"""));

        // Réponses jugées mauvaises : bon indicateur d'un document manquant ou incomplet
        out.put("dislikedQuestions", jdbc.queryForList("""
                SELECT m.content AS question, f.comment AS comment, f.created_at AS created_at
                FROM feedbacks f
                JOIN responses_ai r ON r.id_response = f.id_response
                JOIN messages m ON m.id_message = r.id_message
                WHERE f.feedback_type = 'DISLIKE'
                ORDER BY f.created_at DESC LIMIT 8"""));

        // ----- Qualité du RAG -----
        double t = lowScoreThreshold;
        out.put("ragThreshold", t);
        out.put("ragScored", jdbc.queryForObject(
                "SELECT count(*) FROM responses_ai WHERE rag_top_score IS NOT NULL", Long.class));
        out.put("ragLow", jdbc.queryForObject(
                "SELECT count(*) FROM responses_ai WHERE rag_top_score IS NOT NULL AND rag_top_score < ?",
                Long.class, t));
        out.put("ragAvgScore", jdbc.queryForObject(
                "SELECT COALESCE(round(avg(rag_top_score)::numeric, 2), 0) FROM responses_ai WHERE rag_top_score IS NOT NULL",
                Double.class));
        out.put("ragAvgMs", jdbc.queryForObject(
                "SELECT COALESCE(round(avg(rag_ms)), 0) FROM responses_ai WHERE rag_ms IS NOT NULL",
                Double.class));
        // 5 tranches de 0.2 : bucket 1 = [0;0.2[ ... bucket 5 = [0.8;1]
        out.put("ragHistogram", jdbc.queryForList("""
                SELECT GREATEST(1, LEAST(5, width_bucket(rag_top_score, 0, 1, 5))) AS bucket, count(*) AS count
                FROM responses_ai WHERE rag_top_score IS NOT NULL GROUP BY 1 ORDER BY 1"""));
        // Questions mal couvertes, regroupées : la liste de travail de l'admin
        out.put("uncoveredQuestions", jdbc.queryForList("""
                SELECT min(m.content) AS question, count(*) AS count,
                       round(avg(r.rag_top_score)::numeric, 2) AS avg_score,
                       min(r.rag_top_source) AS closest_source,
                       max(m.created_at) AS last_asked
                FROM responses_ai r JOIN messages m ON m.id_message = r.id_message
                WHERE r.rag_top_score IS NOT NULL AND r.rag_top_score < ?
                GROUP BY lower(trim(m.content))
                ORDER BY count(*) DESC, avg(r.rag_top_score) ASC LIMIT 10""", t));
        return out;
    }
}
