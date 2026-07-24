import { Cpu, Info } from "lucide-react";
import SettingsSection from "./SettingsSection";

export default function AboutSection() {

    return (

        <SettingsSection
            icon={<Info size={22} />}
            title="About"
            description="Application information."
        >

            <div className="space-y-4">

                <div>

                    <h3 className="font-semibold">
                        ENCG Tanger AI Assistant
                    </h3>

                    <p className="text-slate-400 text-sm">
                        Version 1.0.0
                    </p>

                    <p className="text-slate-400 text-sm">
                        https://encgt.uae.ac.ma/
                    </p>

                </div>

                <div className="grid md:grid-cols-2 gap-3">

                    <div className="bg-slate-900 rounded-lg p-4">

                        <p className="text-sm text-slate-400">
                            Frontend
                        </p>

                        <p>
                            React + Tailwind CSS
                        </p>

                    </div>

                    <div className="bg-slate-900 rounded-lg p-4">

                        <p className="text-sm text-slate-400">
                            Backend
                        </p>

                        <p>
                            Spring Boot
                        </p>

                    </div>

                    <div className="bg-slate-900 rounded-lg p-4">

                        <p className="text-sm text-slate-400">
                            AI Service
                        </p>

                        <p>
                            FastAPI
                        </p>

                    </div>

                    <div className="bg-slate-900 rounded-lg p-4">

                        <p className="text-sm text-slate-400">
                            Language Model
                        </p>

                        <p>
                            Ollama
                        </p>

                    </div>

                </div>

            </div>

        </SettingsSection>

    );

}