import { User, Mail, Shield } from "lucide-react";

import useAuth from "../../auth/useAuth";

export default function ProfileCard({ user }) {
    const auth = useAuth();

    const profile = auth.profile;

    return (

        <div
            className="
                bg-slate-800
                rounded-xl
                border
                border-slate-700
                p-8
            "
        >

            <div className="flex items-center gap-5">

                <div
                    className="
                        w-20
                        h-20
                        rounded-full
                        bg-emerald-600
                        flex
                        items-center
                        justify-center
                    "
                >

                    <User size={36} />

                </div>

                <div>

                    <h2 className="text-2xl font-bold">

                        {profile?.firstName} {profile?.lastName}

                    </h2>

                    <p className="text-slate-400">

                        {profile?.email}

                    </p>

                </div>

            </div>

            <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">

                    <Mail size={18} />

                    <span>

                        {profile?.email}

                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <Shield size={18} />

                    <span>

                        Utilisateur authentifié

                    </span>

                </div>

            </div>

        </div>

    );

}