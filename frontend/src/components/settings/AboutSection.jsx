import { Info } from "lucide-react";
import SettingsSection from "./SettingsSection";

const stack = [
    { label: "Frontend", value: "React + Tailwind CSS" },
    { label: "Backend", value: "Spring Boot" },
    { label: "Service IA", value: "FastAPI" },
    { label: "Modèle de langage", value: "Ollama" },
];

export default function AboutSection() {

    return (

        <SettingsSection
            icon={<Info size={20} />}
            title="À propos"
            description="Informations sur l'application."
        >

            <div className="space-y-4">

                <div>

                    <h3 className="font-semibold">
                        ENCG Tanger — Assistant IA
                    </h3>

                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        Version 1.0.0
                    </p>

                    <a
                        href="https://encgt.uae.ac.ma/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 dark:text-brand-400 text-sm hover:underline"
                    >
                        encgt.uae.ac.ma
                    </a>

                </div>

                <div className="grid sm:grid-cols-2 gap-3">

                    {stack.map(({ label, value }) => (

                        <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-4" key={label}>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {label}
                            </p>

                            <p className="text-sm font-medium mt-0.5">
                                {value}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </SettingsSection>

    );

}
