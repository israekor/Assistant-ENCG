import { ArrowRight, BookOpen, CalendarClock, LogIn, Moon, MessageCircleQuestion, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuth from "../auth/useAuth";
import useChat from "../hooks/useChat";
import useTheme from "../hooks/useTheme";
import Logo from "../components/common/Logo";

const TOPICS = [
    { icon: BookOpen, text: "Filières et programmes de formation" },
    { icon: CalendarClock, text: "Concours, dates et inscriptions" },
    { icon: MessageCircleQuestion, text: "Vie de l'école et démarches" },
];

export default function WelcomePage() {

    const navigate = useNavigate();
    const auth = useAuth();
    const { newConversation } = useChat();
    const { theme, setTheme } = useTheme();

    const isDark = theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const start = () => {
        newConversation();
        navigate("/chat");
    };

    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">

            {/* Halo vert discret derrière le contenu */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-225 max-w-full h-130 opacity-60 dark:opacity-30"
                style={{
                    background:
                        "radial-gradient(ellipse at top, var(--color-brand-200), transparent 70%)"
                }}
            />

            <header className="relative z-10 flex items-center justify-between px-5 sm:px-10 h-16 shrink-0">

                <div className="flex items-center gap-3">
                    <Logo size="sm" />
                    <span className="font-bold text-sm sm:text-base">ENCGT Assistant</span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">

                    <button
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        aria-label="Changer de thème"
                        className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {!auth.authenticated && (
                        <button
                            onClick={auth.login}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition"
                        >
                            <LogIn size={16} />
                            Se connecter
                        </button>
                    )}

                </div>

            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-16">

                <Logo size="lg" className="mb-7" />

                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl leading-tight">
                    Découvrez l'assistant de l'ENCG Tanger
                </h1>

                <p className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                    Posez vos questions sur l'école et obtenez des réponses claires,
                    à tout moment, sans chercher dans les documents.
                </p>

                <button
                    onClick={start}
                    className="mt-9 inline-flex items-center gap-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-brand-600/25 focus:outline-none focus-visible:ring-4 ring-brand-500/40 transition"
                >
                    Commencer à discuter
                    <ArrowRight size={18} />
                </button>

                <ul className="mt-14 flex flex-col sm:flex-row gap-3 sm:gap-8 text-sm text-neutral-600 dark:text-neutral-400">
                    {TOPICS.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-2.5 justify-center">
                            <Icon size={16} className="text-brand-600 dark:text-brand-400 shrink-0" />
                            {text}
                        </li>
                    ))}
                </ul>

            </main>

        </div>
    );
}
