import MainLayout from "../layouts/MainLayout";
import ThemeSelector from "../components/settings/ThemeSelector";
import AccountSection from "../components/settings/AccountSection";
import AboutSection from "../components/settings/AboutSection";
import PrivacySection from "../components/settings/PrivacySection";

export default function SettingsPage() {
    return (
        <MainLayout showSidebar={false}>
            <div className="max-w-5xl mx-auto p-8 space-y-8">

            <div>

                <h1 className="text-3xl font-bold">
                    Settings
                </h1>

                <p className="text-slate-400 mt-2">
                    Configure your ENCGT AI Assistant experience.
                </p>

            </div>

            <ThemeSelector />

            <AccountSection />

            <AboutSection />

            <PrivacySection />

        </div>
        </MainLayout>
    );
}