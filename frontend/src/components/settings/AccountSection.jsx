import {
    ExternalLink,
    KeyRound,
    Mail,
    UserCircle,
} from "lucide-react";

import useAuth from "../../auth/useAuth";
import SettingsSection from "./SettingsSection";

export default function AccountSection() {

    const { profile } = useAuth();

    const fullName =
        `${profile?.given_name ?? ""} ${profile?.family_name ?? ""}`.trim() ||
        profile?.preferred_username ||
        "Inconnu";

    const handleManageAccount = () => {

        window.open(
            "/auth/realms/encg-assistant/account",
            "_blank"
        );

    };

    const rows = [
        { icon: UserCircle, label: "Nom", value: fullName },
        { icon: Mail, label: "Email", value: profile?.email },
        { icon: KeyRound, label: "Authentification", value: "Keycloak" },
    ];

    return (

        <SettingsSection
            icon={<UserCircle size={20} />}
            title="Compte"
            description="Gérez les informations de votre compte."
        >

            <div className="space-y-5">

                {rows.map(({ icon: Icon, label, value }) => (

                    <div className="flex items-center gap-4" key={label}>

                        <Icon size={20} className="text-neutral-400 shrink-0" />

                        <div className="min-w-0">

                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {label}
                            </p>

                            <p className="font-medium text-sm truncate">
                                {value}
                            </p>

                        </div>

                    </div>

                ))}

                <div className="pt-2">

                    <button
                        onClick={handleManageAccount}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-sm font-medium transition-colors"
                    >

                        <ExternalLink size={16} />

                        Gérer mon compte

                    </button>

                </div>

            </div>

        </SettingsSection>

    );

}
