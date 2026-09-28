import { LogIn, Moon, Sun, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../auth/useAuth";
import useChat from "../../hooks/useChat";
import useTheme from "../../hooks/useTheme";
import Logo from "../common/Logo";

export default function Header({ showSidebar = true }) {

    const auth = useAuth();
    const navigate = useNavigate();
    const { currentConversation } = useChat();
    const { theme, setTheme } = useTheme();

    const isDark = theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const toggleTheme = () => setTheme(isDark ? "light" : "dark");

    return (

        <header className="h-16 shrink-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">

                {!showSidebar && <Logo size="sm" />}

                <div className="min-w-0">

                    <h1 className="font-semibold text-sm sm:text-base truncate">
                        {currentConversation ? currentConversation.title : "Nouvelle conversation"}
                    </h1>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Assistant IA · ENCG Tanger
                    </p>

                </div>

            </div>

            <div className="flex items-center gap-2 sm:gap-3">

                <button
                    onClick={toggleTheme}
                    aria-label="Changer de thème"
                    className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {auth.authenticated ? (

                    <div className="flex items-center gap-3 pl-2 sm:border-l border-neutral-200 dark:border-neutral-800">

                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium leading-tight">
                                {auth.profile?.given_name || auth.profile?.preferred_username || "Utilisateur"}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Connecté</p>
                        </div>

                        <div className="w-9 h-9 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-white font-semibold text-sm">
                            {(auth.profile?.given_name || "U")[0]?.toUpperCase()}
                        </div>

                    </div>

                ) : (

                    <div className="flex items-center gap-2">

                        <button
                            onClick={auth.login}
                            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                        >
                            <LogIn size={16} />
                            Se connecter
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                        >
                            <UserPlus size={16} />
                            S'inscrire
                        </button>

                    </div>

                )}

            </div>

        </header>

    );
}
