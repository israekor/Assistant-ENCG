import { UserCircle2 } from "lucide-react";
import AuthService from "../../auth/AuthService";

export default function GuestCard() {

    return (

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center">

            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                <UserCircle2 size={32} />
            </div>

            <h2 className="text-xl font-bold mt-4">

                Mode visiteur

            </h2>

            <p className="text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto text-sm leading-relaxed">

                Vous utilisez actuellement le chatbot en tant que visiteur.
                Connectez-vous afin de conserver définitivement vos conversations
                et retrouver votre historique sur n'importe quel appareil.

            </p>

            <button
                onClick={() => AuthService.login()}
                className="mt-5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition shadow-sm"
            >
                Se connecter
            </button>

        </div>

    );

}
