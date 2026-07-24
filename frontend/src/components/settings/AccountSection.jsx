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
        "Unknown";

    const handleManageAccount = () => {

        window.open(
            "http://localhost/auth/realms/encg-assistant/account",
            "_blank"
        );

    };

    return (

        <SettingsSection
            icon={<UserCircle size={22} />}
            title="Account"
            description="Manage your account information."
        >

            <div className="space-y-5">

                <div className="flex items-center gap-4">

                    <UserCircle
                        size={20}
                        className="text-slate-400"
                    />

                    <div>

                        <p className="text-sm text-slate-400">
                            Name
                        </p>

                        <p className="font-medium">
                            {fullName}
                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-4">

                    <Mail
                        size={20}
                        className="text-slate-400"
                    />

                    <div>

                        <p className="text-sm text-slate-400">
                            Email
                        </p>

                        <p className="font-medium">
                            {profile?.email}
                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-4">

                    <KeyRound
                        size={20}
                        className="text-slate-400"
                    />

                    <div>

                        <p className="text-sm text-slate-400">
                            Authentication
                        </p>

                        <p className="font-medium">
                            Keycloak
                        </p>

                    </div>

                </div>

                <div className="pt-2">

                    <button
                        onClick={handleManageAccount}
                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-lg
                            bg-cyan-600
                            hover:bg-cyan-700
                            transition-colors
                        "
                    >

                        <ExternalLink size={18} />

                        Manage Account

                    </button>

                </div>

            </div>

        </SettingsSection>

    );

}