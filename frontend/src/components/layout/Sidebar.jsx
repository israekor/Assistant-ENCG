import {
    MessageSquare,
    History,
    User,
    Settings,
    LogOut,
    Plus
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../../auth/useAuth";
import useChat from "../../hooks/useChat";

export default function Sidebar() {

    const auth = useAuth();

    const navigate = useNavigate();

    const {

        conversations,
        currentConversation,
        openConversation,
        newConversation

    } = useChat();

    const handleNewConversation = () => {

        newConversation();

        navigate("/chat");

    };

    const handleOpenConversation = async (conversation) => {

        await openConversation(conversation);

        navigate(`/chat/${conversation.idConversation}`);

    };

    return (

        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">

            <div className="p-5">

                <button
                    onClick={handleNewConversation}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
                >

                    <Plus size={18} />

                    Nouvelle conversation

                </button>

            </div>

            <div className="px-5 mb-3">

                <p className="text-xs uppercase tracking-widest text-slate-500">

                    Historique

                </p>

            </div>

            <div className="flex-1 overflow-y-auto px-3">

                {

                    conversations.length === 0 ?

                        <p className="text-slate-500 text-sm px-3">

                            Aucune conversation

                        </p>

                        :

                        conversations.map(conversation => (

                            <button

                                key={conversation.idConversation}

                                onClick={() =>
                                    handleOpenConversation(conversation)
                                }

                                className={`

                                    w-full
                                    text-left
                                    flex
                                    items-center
                                    gap-3
                                    px-3
                                    py-3
                                    rounded-lg
                                    transition

                                    ${

                                        currentConversation?.idConversation ===
                                        conversation.idConversation

                                        ?

                                        "bg-emerald-600 text-white"

                                        :

                                        "hover:bg-slate-800"

                                    }

                                `}
                            >

                                <MessageSquare size={18} />

                                <span className="truncate">

                                    {conversation.title}

                                </span>

                            </button>

                        ))

                }

            </div>

            <div className="border-t border-slate-800 p-3 space-y-1">

                <NavLink
                    to="/history"
                    className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                            isActive
                                ? "bg-emerald-600 text-white"
                                : "hover:bg-slate-800"
                        }`
                    }
                >

                    <History size={18} />

                    Historique

                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                            isActive
                                ? "bg-emerald-600 text-white"
                                : "hover:bg-slate-800"
                        }`
                    }
                >

                    <User size={18} />

                    Profil

                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                            isActive
                                ? "bg-emerald-600 text-white"
                                : "hover:bg-slate-800"
                        }`
                    }
                >

                    <Settings size={18} />

                    Paramètres

                </NavLink>

                {

                    auth.authenticated &&

                    <button
                        onClick={auth.logout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-500/20 text-red-400"
                    >

                        <LogOut size={18} />

                        Déconnexion

                    </button>

                }

            </div>

        </aside>

    );

}