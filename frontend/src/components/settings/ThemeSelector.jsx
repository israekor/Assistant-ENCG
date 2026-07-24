import { Monitor, Moon, Palette, Sun } from "lucide-react";
import SettingsSection from "./SettingsSection";

const themes = [
    {
        id: "dark",
        name: "Dark",
        description: "Current theme",
        icon: Moon,
        active: true,
    },
    {
        id: "light",
        name: "Light",
        description: "Coming soon",
        icon: Sun,
        active: false,
    },
    {
        id: "system",
        name: "System",
        description: "Coming soon",
        icon: Monitor,
        active: false,
    },
];

export default function ThemeSelector() {
    return (
        <SettingsSection
            icon={<Palette size={22} />}
            title="Appearance"
            description="Choose the appearance of your application."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map((theme) => {
                    const Icon = theme.icon;

                    return (
                        <button
                            key={theme.id}
                            disabled={!theme.active}
                            className={`
                                p-5
                                rounded-xl
                                border
                                transition-all
                                text-left
                                ${
                                    theme.active
                                        ? "border-cyan-500 bg-cyan-500/10 cursor-default"
                                        : "border-slate-700 bg-slate-900/40 opacity-60 cursor-not-allowed"
                                }
                            `}
                        >
                            <Icon
                                size={24}
                                className={
                                    theme.active
                                        ? "text-cyan-400"
                                        : "text-slate-400"
                                }
                            />

                            <h3 className="mt-4 font-semibold">
                                {theme.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                {theme.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </SettingsSection>
    );
}