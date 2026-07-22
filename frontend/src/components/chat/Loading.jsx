import { Bot } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex gap-3 mb-6">

            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <Bot size={20} className="text-white" />
            </div>

            <div className="bg-slate-700 rounded-2xl px-5 py-4 shadow-lg">

                <p className="font-semibold text-white mb-2">
                    Assistant IA
                </p>

                <div className="flex gap-2">

                    <span className="w-2 h-2 rounded-full bg-white animate-bounce"></span>

                    <span
                        className="w-2 h-2 rounded-full bg-white animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></span>

                    <span
                        className="w-2 h-2 rounded-full bg-white animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                    ></span>

                </div>

            </div>

        </div>
    );
}