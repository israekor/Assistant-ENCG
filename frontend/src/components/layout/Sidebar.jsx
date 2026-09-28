import {
    History,
    User,
    Settings,
    LogOut,
    Plus
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import ConversationItem from "../sidebar/ConversationItem";

import useAuth from "../../auth/useAuth";
import useChat from "../../hooks/useChat";
import Logo from "../common/Logo";

const navItemClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isActive
            ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
    }`;

export default function Sidebar() {

    const auth = useAuth();

    const navigate = useNavigate();

    const {
        conversations,
        newConversation
    } = useChat();

    const handleNewConversation = () => {

        newConversation();

        navigate("/chat");

    };

    return (

        <aside className="w-72 shrink-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">

            <div className="h-16 shrink-0 flex items-center gap-3 px-5 border-b border-neutral-200 dark:border-neutral-800">

                <Logo size="sm" />

                <div className="min-w-0">
                    <p className="font-bold text-sm leading-tight truncate">ENCGT Assistant</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">École Nationale de Commerce et de Gestion</p>
                </div>

            </div>

            <div className="p-4">

                <button
                    onClick={handleNewConversation}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition shadow-sm"
                >

                    <Plus size={18} />

                    Nouvelle conversation

                </button>

            </div>

            <div className="px-5 mb-2">

                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">

                    Historique

                </p>

            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1">

                {

                    conversations.length === 0 ?

                        <p className="text-neutral-400 dark:text-neutral-500 text-sm px-3 py-2">

                            Aucune conversation

                        </p>

                        :

                        conversations.map(conversation => (

                            <ConversationItem
                                key={conversation.idConversation}
                                conversation={conversation}
                            />

                        ))

                }

            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 space-y-1">

                <NavLink to="/history" className={navItemClass}>
                    <History size={18} />
                    Historique
                </NavLink>

                <NavLink to="/profile" className={navItemClass}>
                    <User size={18} />
                    Profil
                </NavLink>

                <NavLink to="/settings" className={navItemClass}>
                    <Settings size={18} />
                    Paramètres
                </NavLink>

                {

                    auth.authenticated &&

                    <button
                        onClick={auth.logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >

                        <LogOut size={18} />

                        Déconnexion

                    </button>

                }

            </div>

        </aside>

    );

}
