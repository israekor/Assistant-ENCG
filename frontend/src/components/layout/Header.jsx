import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import useChat from "../../hooks/useChat";

export default function Header() {

    const auth = useAuth();
    const navigate = useNavigate();
    const { currentConversation } = useChat();

    return (

        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

                    <Bot className="text-white" size={20} />

                </div>

                <div>

                    <h1 className="font-semibold">
                        ENCG AI Assistant
                    </h1>

                    <p className="text-xs text-slate-400">
                        Assistant intelligent
                    </p>

                </div>

                <h1 className="font-semibold">

                    {
                        currentConversation ?

                            currentConversation.title

                            :

                            "Nouvelle conversation"
                    }

                </h1>

            </div>

            {
                auth.authenticated ?

                    <div className="flex items-center gap-3">

                        <div className="text-right">

                            <p className="font-medium">
                                {auth.user?.firstName || "Utilisateur"}
                            </p>

                            <p className="text-xs text-slate-400">
                                Connecté
                            </p>

                        </div>

                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold">

                            {(auth.user?.firstName || "U")[0]}

                        </div>

                    </div>

                    :

                    <div className="flex items-center gap-2">

                        <button
                            onClick={auth.login}
                            className="px-4 py-2 rounded-lg text-slate-200 hover:bg-slate-800 transition"
                        >
                            Se connecter
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition"
                        >
                            S'inscrire
                        </button>

                    </div>

            }

        </header>

    );
}