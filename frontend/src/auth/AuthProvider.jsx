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
            setProfile(AuthService.getProfile());

            setInitialized(true);

        }

        initialize();

    }, []);

    if (!initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                Chargement...
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