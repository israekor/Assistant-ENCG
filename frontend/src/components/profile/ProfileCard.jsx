import { Mail, Shield } from "lucide-react";

import useAuth from "../../auth/useAuth";

export default function ProfileCard() {
    const auth = useAuth();

    const profile = auth.profile;

    const initials = `${profile?.given_name?.[0] ?? ""}${profile?.family_name?.[0] ?? ""}`.toUpperCase() || "U";

    return (

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8">

            <div className="flex items-center gap-5">

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">

                    {initials}

                </div>

                <div className="min-w-0">

                    <h2 className="text-xl sm:text-2xl font-bold truncate">

                        {profile?.given_name} {profile?.family_name}

                    </h2>

                    <p className="text-neutral-500 dark:text-neutral-400 truncate">

                        {profile?.email}

                    </p>

                </div>

            </div>

            <div className="mt-8 space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">

                <div className="flex items-center gap-3 text-sm">

                    <Mail size={18} className="text-neutral-400" />

                    <span>

                        {profile?.email}

                    </span>

                </div>

                <div className="flex items-center gap-3 text-sm">

                    <Shield size={18} className="text-neutral-400" />

                    <span>

                        Utilisateur authentifié

                    </span>

                </div>

            </div>

        </div>

    );

}
