import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import adminService from "../../services/adminService";

const card = "bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5";
const input = "rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm w-full";
const stemOf = (source) => source.split("/").pop().replace(/\.[^.]+$/, "");
const errMsg = (e) => e?.response?.data?.detail || e?.response?.data?.message || e.message;
const EMPTY = { id: null, name: "", file_stem: "", aliases: "" };

export default function FilieresPanel({ docs }) {
    const [list, setList] = useState([]);
    const [form, setForm] = useState(EMPTY);
    const [msg, setMsg] = useState(null);

    const load = useCallback(async () => setList((await adminService.getFilieres()).data), []);
    useEffect(() => { load().catch((e) => setMsg({ err: true, text: errMsg(e) })); }, [load]);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const save = async () => {
        const body = {
            name: form.name.trim(),
            file_stem: form.file_stem,
            aliases: form.aliases.split(",").map((a) => a.trim()).filter(Boolean),
        };
        if (!body.name || !body.file_stem) return setMsg({ err: true, text: "Le nom et le fichier associé sont obligatoires." });
        try {
            if (form.id) await adminService.updateFiliere(form.id, body);
            else await adminService.createFiliere(body);
            setForm(EMPTY);
            setMsg({ text: "Filière enregistrée. Relancez l'indexation pour l'appliquer aux documents déjà indexés." });
            load();
        } catch (e) { setMsg({ err: true, text: errMsg(e) }); }
    };

    const remove = async (f) => {
        if (!window.confirm(`Supprimer la filière « ${f.name} » ? (le document n'est pas supprimé)`)) return;
        try { await adminService.deleteFiliere(f.id); load(); setMsg({ text: "Filière supprimée. Relancez l'indexation." }); }
        catch (e) { setMsg({ err: true, text: errMsg(e) }); }
    };

    const edit = (f) => setForm({ id: f.id, name: f.name, file_stem: f.file_stem, aliases: f.aliases.join(", ") });

    return (
        <section>
            <h2 className="text-lg font-semibold mb-1">Filières</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Associez un document à une filière et indiquez les mots que les étudiants emploient pour la désigner
                (ex. « cac », « audit »). Le chatbot s'en sert pour cibler les bons extraits.
            </p>

            <div className={card}>
                <div className="grid md:grid-cols-3 gap-3">
                    <label className="text-sm">Nom de la filière
                        <input className={`${input} mt-1`} value={form.name} onChange={set("name")} placeholder="Finance" />
                    </label>
                    <label className="text-sm">Document associé
                        <select className={`${input} mt-1`} value={form.file_stem} onChange={set("file_stem")}>
                            <option value="" className="text-black">Choisir…</option>
                            {docs.filter((d) => d.status !== "orphan").map((d) => (
                                <option key={d.source} value={stemOf(d.source)} className="text-black">{d.source}</option>
                            ))}
                        </select>
                    </label>
                    <label className="text-sm">Alias (séparés par des virgules)
                        <input className={`${input} mt-1`} value={form.aliases} onChange={set("aliases")} placeholder="finance, ingénierie financière" />
                    </label>
                </div>
                <div className="flex gap-3 mt-4">
                    <button onClick={save} className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 text-sm">
                        {form.id ? "Enregistrer les modifications" : "Ajouter la filière"}
                    </button>
                    {form.id && <button onClick={() => setForm(EMPTY)} className="text-sm text-neutral-500">Annuler</button>}
                </div>
                {msg && <p className={`mt-3 text-sm ${msg.err ? "text-red-600" : "text-neutral-600 dark:text-neutral-300"}`}>{msg.text}</p>}

                <table className="w-full text-sm mt-5">
                    <tbody>
                        {list.map((f) => (
                            <tr key={f.id} className="border-t border-neutral-200 dark:border-neutral-800">
                                <td className="py-2.5 pr-3 font-medium">{f.name}</td>
                                <td className="text-neutral-500 pr-3">{f.file_stem}</td>
                                <td className="text-neutral-500">{f.aliases.join(", ")}</td>
                                <td className="text-right whitespace-nowrap">
                                    <button onClick={() => edit(f)} aria-label={`Modifier ${f.name}`} className="p-1.5 text-neutral-400 hover:text-brand-600"><Pencil size={16} /></button>
                                    <button onClick={() => remove(f)} aria-label={`Supprimer ${f.name}`} className="p-1.5 text-neutral-400 hover:text-red-600"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
