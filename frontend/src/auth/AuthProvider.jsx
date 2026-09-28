import { useEffect, useState } from "react";

import AuthContext from "./AuthContext";
import AuthService from "./AuthService";
import conversationService from "../services/conversationService";
import { isGuestLinked, markGuestLinked } from "../utils/guest";

export default function AuthProvider({ children }) {

    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {

        async function initialize() {

            const authenticated = await AuthService.init();

            if (authenticated && !isGuestLinked()) {

                try {

                    await conversationService.linkGuest();

                    markGuestLinked();

                } catch (error) {

                    console.error("Impossible de transférer les conversations :", error);

                }

            }

            setAuthenticated(authenticated);
            setToken(AuthService.getToken());
            setProfile(AuthService.getProfile() ?? {});

            setInitialized(true);

        }

        initialize();

    }, []);

    if (!initialized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400">
                <div className="w-10 h-10 rounded-2xl bg-brand-600 animate-pulse" />
                <p className="text-sm">Chargement...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                token,
                profile,
                login: AuthService.login,
                logout: AuthService.logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}