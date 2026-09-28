import MainLayout from "../layouts/MainLayout";
import ThemeSelector from "../components/settings/ThemeSelector";
import AccountSection from "../components/settings/AccountSection";
import AboutSection from "../components/settings/AboutSection";
import PrivacySection from "../components/settings/PrivacySection";
import useAuth from "../auth/useAuth";

export default function SettingsPage() {

    const { authenticated } = useAuth();

    return (
        <MainLayout showSidebar={false}>
            <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-6">

                <div>

                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Paramètres
                    </h1>

                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                        Configurez votre expérience avec l'assistant IA ENCGT.
                    </p>

                </div>

                <ThemeSelector />

                {authenticated && <AccountSection />}

                <AboutSection />

                <PrivacySection />

            </div>
        </MainLayout>
    );
}
