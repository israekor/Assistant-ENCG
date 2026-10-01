import StatisticsCard from "../profile/StatisticsCard";
import { Gauge, AlertTriangle, Timer } from "lucide-react";

const card = "bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5";
const LABELS = ["0–0,2", "0,2–0,4", "0,4–0,6", "0,6–0,8", "0,8–1"];

export default function RagQualityPanel({ stats }) {
    const scored = Number(stats?.ragScored ?? 0);
    const low = Number(stats?.ragLow ?? 0);
    const covered = scored ? Math.round(((scored - low) / scored) * 100) : 0;

    const hist = LABELS.map((_, i) => Number(stats?.ragHistogram?.find((b) => Number(b.bucket) === i + 1)?.count ?? 0));
    const max = Math.max(1, ...hist);

    return (
        <section>
            <h2 className="text-lg font-semibold mb-1">Qualité du RAG</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Score de pertinence du meilleur extrait retrouvé pour chaque question (0 à 1).
                Sous {stats?.ragThreshold ?? 0.3}, la base ne contient probablement pas la réponse.
            </p>

            {scored === 0 ? (
                <p className={`${card} text-sm text-neutral-500`}>
                    Aucun score enregistré pour l'instant : ils apparaîtront dès les prochaines questions posées au chatbot.
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <StatisticsCard icon={Gauge} title="Score moyen" value={stats.ragAvgScore} />
                        <StatisticsCard icon={Gauge} title="Questions bien couvertes" value={`${covered} %`} />
                        <StatisticsCard icon={AlertTriangle} title="Mal couvertes" value={low} />
                        <StatisticsCard icon={Timer} title="Recherche (ms, moyenne)" value={stats.ragAvgMs} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 mt-4">
                        <div className={card}>
                            <h3 className="font-semibold mb-4">Répartition des scores</h3>
                            <div className="flex items-end gap-3 h-28">
                                {hist.map((n, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                                        <span className="text-xs text-neutral-500 mb-1">{n}</span>
                                        <div className={`w-full rounded-t min-h-[2px] ${i < 2 ? "bg-amber-500" : "bg-brand-500"}`}
                                             style={{ height: `${(n / max) * 80}%` }} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-2">
                                {LABELS.map((l) => <span key={l} className="flex-1 text-center text-[11px] text-neutral-500">{l}</span>)}
                            </div>
                        </div>

                        <div className={card}>
                            <h3 className="font-semibold">Questions mal couvertes</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                                À traiter en priorité : ajoutez ou complétez un document.
                            </p>
                            <ul className="text-sm divide-y divide-neutral-200 dark:divide-neutral-800">
                                {(stats.uncoveredQuestions ?? []).map((q, i) => (
                                    <li key={i} className="py-2">
                                        <div className="flex justify-between gap-3">
                                            <span>{q.question}</span>
                                            <span className="text-neutral-500 shrink-0">{q.count}× · {q.avg_score}</span>
                                        </div>
                                        {q.closest_source && <span className="text-xs text-neutral-500">Source la plus proche : {q.closest_source}</span>}
                                    </li>
                                ))}
                                {!stats.uncoveredQuestions?.length && <li className="py-2 text-neutral-500">Aucune pour le moment.</li>}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
