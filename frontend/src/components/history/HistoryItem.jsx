import {
    MessageSquare,
    ArchiveRestore,
    Trash2,
    ArrowRight
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import useChat from "../../hooks/useChat";

export default function HistoryItem({ conversation }) {

    const navigate = useNavigate();

    const {
        restoreConversation,
        deleteConversation
    } = useChat();

    const handleOpen = () => {

        navigate(`/chat/${conversation.idConversation}`);

    };

    const handleRestore = async (e) => {
        e.stopPropagation();

        await restoreConversation(
            conversation.idConversation
        );

    };

    const handleDelete = async (e) => {
        e.stopPropagation();

        if (
            !window.confirm(
                "Supprimer définitivement cette conversation ?"
            )
        ) {
            return;
        }

        await deleteConversation(
            conversation.idConversation
        );

    };

    const isActive = conversation.status === "ACTIVE";

    return (

        <div
            onClick={handleOpen}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex items-center justify-between gap-4 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-sm transition cursor-pointer group"
        >

            <div className="flex items-center gap-4 min-w-0 flex-1">

                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shrink-0">

                    <MessageSquare size={20} />

                </div>

                <div className="min-w-0">

                    <h3 className="font-semibold truncate">

                        {conversation.title}

                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Modifiée le {new Date(conversation.updatedAt).toLocaleDateString("fr-FR")}
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                        <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isActive
                                    ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
                                    : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}
                        >
                            {isActive ? "Active" : "Archivée"}
                        </span>

                    </div>

                </div>

            </div>

            <div className="flex items-center gap-2 shrink-0">

                {
                    conversation.status === "ARCHIVED" && (

                        <button
                            onClick={handleRestore}
                            title="Restaurer"
                            className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 transition"
                        >

                            <ArchiveRestore size={18} />

                        </button>

                    )
                }

                <button
                    onClick={handleDelete}
                    title="Supprimer"
                    className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
                >

                    <Trash2 size={18} />

                </button>

                <ArrowRight size={18} className="text-neutral-300 dark:text-neutral-600 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-transform ml-1" />

            </div>

        </div>

    );

}
