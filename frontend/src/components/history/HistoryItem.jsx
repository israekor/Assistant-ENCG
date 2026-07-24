import {
    MessageSquare,
    ArchiveRestore,
    Trash2
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

    const handleRestore = async () => {

        await restoreConversation(
            conversation.idConversation
        );

    };

    const handleDelete = async () => {

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

    const statusLabel =
        conversation.status === "ACTIVE"
            ? "Active"
            : "Archivée";

    const statusColor =
        conversation.status === "ACTIVE"
            ? "bg-emerald-500"
            : "bg-amber-500";

    return (

        <div
            className="
                bg-slate-800
                rounded-xl
                border
                border-slate-700
                p-5
                flex
                items-center
                justify-between
            "
        >

            <div
                className="flex items-center gap-4 cursor-pointer flex-1"
            >

                <div className="p-3 rounded-lg bg-slate-700">

                    <MessageSquare size={20} />

                </div>

                <div>

                    <h3 className="font-semibold">

                        {conversation.title}

                    </h3>
                    <p className="text-sm text-slate-400">
                        Dernière modification :
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                        <span
                            className={`w-2.5 h-2.5 rounded-full ${statusColor}`}
                        />

                        <span
                            className={`
                                px-2
                                py-0.5
                                rounded-full
                                text-xs
                                bg-slate-700
                                text-slate-300
                            `}
                        >
                            {statusLabel}
                        </span>

                    </div>
                    <button
                        onClick={handleOpen}
                        className="
                            px-3
                            py-2
                            rounded-lg
                            bg-slate-700
                            hover:bg-slate-600
                        "
                    >
                        Ouvrir
                    </button>

                </div>

            </div>

            <div className="flex gap-2">

                {
                    conversation.status === "ARCHIVED" && (

                        <button
                            onClick={handleRestore}
                            className="
                                p-2
                                rounded-lg
                                bg-emerald-600
                                hover:bg-emerald-700
                            "
                        >

                            <ArchiveRestore size={18} />

                        </button>

                    )
                }

                <button
                    onClick={handleDelete}
                    className="
                        p-2
                        rounded-lg
                        bg-red-600
                        hover:bg-red-700
                    "
                >

                    <Trash2 size={18} />

                </button>

            </div>

        </div>

    );

}