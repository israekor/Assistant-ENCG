import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import {
    MessageSquare, MessagesSquare, ThumbsUp, ThumbsDown,
    Upload, RefreshCw, Trash2, FileText
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import isAdminRole from "../auth/isAdminRole";
import useAuth from "../auth/useAuth";
import StatisticsCard from "../components/profile/StatisticsCard";
import adminService from "../services/adminService";
import RagQualityPanel from "../components/admin/RagQualityPanel";
import FilieresPanel from "../components/admin/FilieresPanel";

const STATUS = {
    indexed:  { label: "Indexé",           cls: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400" },
    pending:  { label: "Nouveau",          cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
    modified: { label: "Modifié",          cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
    orphan:   { label: "Fichier supprimé", cls: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" },
};

const card = "bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5";
const errMsg = (e) => e?.response?.data?.detail || e?.response?.data?.message || e.message;

export default function AdminPage() {
    const auth = useAuth();

    const [stats, setStats] = useState(null);
    const [docs, setDocs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [folder, setFolder] = useState("04_masters");
    const [job, setJob] = useState({ status: "idle", message: "" });
    const [notice, setNotice] = useState(null);
    const fileInput = useRef(null);

    const isAdmin = auth.authenticated && isAdminRole();
    const needsReindex = docs.some((d) => d.status !== "indexed");

    const loadDocs = useCallback(async () => setDocs((await adminService.getDocuments()).data), []);

    useEffect(() => {
        if (!isAdmin) return;
        adminService.getStats().then((r) => setStats(r.data)).catch((e) => setNotice({ err: true, text: errMsg(e) }));
        adminService.getCategories().then((r) => setCategories(r.data));
        loadDocs().catch((e) => setNotice({ err: true, text: errMsg(e) }));
    }, [isAdmin, loadDocs]);

    // Suivi de l'indexation tant qu'elle tourne
    useEffect(() => {
        if (job.status !== "running") return;
        const t = setInterval(async () => {
            const { data } = await adminService.getReindexStatus();
            setJob(data);
            if (data.status !== "running") { loadDocs(); clearInterval(t); }
        }, 2000);
        return () => clearInterval(t);
    }, [job.status, loadDocs]);

    if (!isAdmin) return <Navigate to="/chat" replace />;

    const upload = async (files) => {
        if (!files?.length) return;
        try {
            const { data } = await adminService.upload(folder, files);
            setNotice({ text: `${data.saved.length} document(s) ajouté(s). Lancez l'indexation pour les rendre disponibles au chatbot.` });
            loadDocs();
        } catch (e) { setNotice({ err: true, text: errMsg(e) }); }
        if (fileInput.current) fileInput.current.value = "";
    };

    const remove = async (source) => {
        if (!window.confirm(`Supprimer « ${source} » de la base de connaissances ?`)) return;
        try { await adminService.deleteDocument(source); loadDocs(); }
        catch (e) { setNotice({ err: true, text: errMsg(e) }); }
    };

    const reindex = async () => {
        try {
            await adminService.reindex();
            setJob({ status: "running", message: "Démarrage…" });
            setNotice(null);
        } catch (e) { setNotice({ err: true, text: errMsg(e) }); }
    };

    const maxDay = Math.max(1, ...(stats?.perDay ?? []).map((d) => Number(d.count)));

    return (
        <MainLayout showSidebar={false}>
            <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-10">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Administration</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                        Statistiques d'usage et gestion de la base de connaissances du chatbot.
                    </p>
                </div>

                {/* ---- Statistiques ---- */}
                <section>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <StatisticsCard icon={MessageSquare} title="Conversations" value={stats?.conversations ?? 0} />
                        <StatisticsCard icon={MessagesSquare} title="Questions posées" value={stats?.messages ?? 0} />
                        <StatisticsCard icon={ThumbsUp} title="J'aime" value={stats?.likes ?? 0} />
                        <StatisticsCard icon={ThumbsDown} title="Je n'aime pas" value={stats?.dislikes ?? 0} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 mt-4">
                        <div className={card}>
                            <h2 className="font-semibold mb-4">Questions par jour (14 jours)</h2>
                            {stats?.perDay?.length ? (
                                <div className="flex items-end gap-1.5 h-28">
                                    {stats.perDay.map((d) => (
                                        <div key={d.day} title={`${d.day} : ${d.count}`}
                                             className="flex-1 bg-brand-500 rounded-t min-h-0.5"
                                             style={{ height: `${(Number(d.count) / maxDay) * 100}%` }} />
                                    ))}
                                </div>
                            ) : <p className="text-sm text-neutral-500">Aucune donnée pour le moment.</p>}
                        </div>

                        <div className={card}>
                            <h2 className="font-semibold mb-3">Questions les plus posées</h2>
                            <ul className="text-sm divide-y divide-neutral-200 dark:divide-neutral-800">
                                {(stats?.topQuestions ?? []).map((q) => (
                                    <li key={q.question} className="py-2 flex justify-between gap-4">
                                        <span className="truncate">{q.question}</span>
                                        <span className="text-neutral-500 shrink-0">{q.count}×</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={`${card} mt-4`}>
                        <h2 className="font-semibold">Réponses jugées mauvaises</h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                            Souvent le signe d'un document manquant ou incomplet dans la base.
                        </p>
                        <ul className="text-sm divide-y divide-neutral-200 dark:divide-neutral-800">
                            {(stats?.dislikedQuestions ?? []).map((q, i) => (
                                <li key={i} className="py-2">
                                    {q.question}
                                    {q.comment && <span className="block text-neutral-500">« {q.comment} »</span>}
                                </li>
                            ))}
                            {!stats?.dislikedQuestions?.length && <li className="py-2 text-neutral-500">Rien à signaler.</li>}
                        </ul>
                    </div>
                </section>

                <RagQualityPanel stats={stats} />

                {/* ---- Base de connaissances ---- */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Base de connaissances</h2>

                    <div className={card}>
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="text-sm">Catégorie</label>
                            <select value={folder} onChange={(e) => setFolder(e.target.value)}
                                    className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm">
                                {categories.map((c) => <option key={c.folder} value={c.folder} className="text-black">{c.label}</option>)}
                            </select>
                            <input ref={fileInput} type="file" multiple hidden accept=".md,.txt,.pdf"
                                   onChange={(e) => upload(e.target.files)} />
                            <button onClick={() => fileInput.current.click()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 text-sm">
                                <Upload size={16} /> Ajouter des documents
                            </button>
                            <span className="text-xs text-neutral-500">.md, .txt, .pdf — 10 Mo max</span>
                        </div>

                        <table className="w-full text-sm mt-5">
                            <tbody>
                                {docs.map((d) => (
                                    <tr key={d.source} className="border-t border-neutral-200 dark:border-neutral-800">
                                        <td className="py-2.5 pr-3"><FileText size={15} className="inline mr-2 text-neutral-400" />{d.source}</td>
                                        <td className="text-neutral-500 whitespace-nowrap">{d.chunks} extraits</td>
                                        <td className="px-3">
                                            <span className={`text-xs rounded-full px-2 py-0.5 ${STATUS[d.status].cls}`}>{STATUS[d.status].label}</span>
                                        </td>
                                        <td className="text-right">
                                            <button onClick={() => remove(d.source)} aria-label={`Supprimer ${d.source}`}
                                                    className="p-1.5 text-neutral-400 hover:text-red-600"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-800">
                            <button onClick={reindex} disabled={job.status === "running"}
                                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-4 py-2 text-sm">
                                <RefreshCw size={16} className={job.status === "running" ? "animate-spin" : ""} />
                                Relancer l'indexation
                            </button>
                            {needsReindex && job.status !== "running" &&
                                <span className="text-sm text-amber-600 dark:text-amber-400">Des changements ne sont pas encore indexés.</span>}
                            {job.status !== "idle" && job.message &&
                                <span className={`text-sm ${job.status === "error" ? "text-red-600" : job.status === "done" ? "text-brand-600" : "text-neutral-500"}`}>{job.message}</span>}
                        </div>
                    </div>

                    {notice && <p className={`mt-3 text-sm ${notice.err ? "text-red-600" : "text-neutral-600 dark:text-neutral-300"}`}>{notice.text}</p>}
                </section>

                <FilieresPanel docs={docs} />
            </div>
        </MainLayout>
    );
}
