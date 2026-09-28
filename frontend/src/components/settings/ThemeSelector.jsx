import { Monitor, Moon, Palette, Sun } from "lucide-react";
import SettingsSection from "./SettingsSection";
import useTheme from "../../hooks/useTheme";

const themes = [
    { id: "light", name: "Clair", description: "Fond clair, idéal en journée", icon: Sun },
    { id: "dark", name: "Sombre", description: "Fond sombre, idéal le soir", icon: Moon },
    { id: "system", name: "Système", description: "Suit les réglages de l'appareil", icon: Monitor },
];

export default function ThemeSelector() {

    const { theme, setTheme } = useTheme();

    return (
        <SettingsSection
            icon={<Palette size={20} />}
            title="Apparence"
            description="Choisissez l'apparence de l'application."
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {themes.map((item) => {
                    const Icon = item.icon;
                    const isActive = theme === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setTheme(item.id)}
                            className={`p-5 rounded-xl border transition-all text-left ${
                                isActive
                                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                            }`}
                        >
                            <Icon
                                size={22}
                                className={isActive ? "text-brand-600 dark:text-brand-400" : "text-neutral-400"}
                            />

                            <h3 className="mt-3 font-semibold text-sm">
                                {item.name}
                            </h3>

                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                {item.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </SettingsSection>
    );
}
