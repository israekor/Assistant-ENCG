import { GraduationCap } from "lucide-react";

const sizes = {
    sm: { box: "w-8 h-8", icon: 16, radius: "rounded-lg" },
    md: { box: "w-10 h-10", icon: 20, radius: "rounded-xl" },
    lg: { box: "w-16 h-16", icon: 30, radius: "rounded-2xl" },
};

export default function Logo({ size = "md", className = "" }) {
    const config = sizes[size] ?? sizes.md;

    return (
        <div
            className={`${config.box} ${config.radius} bg-brand-600 dark:bg-brand-500 flex items-center justify-center shadow-sm shrink-0 ${className}`}
        >
            <GraduationCap size={config.icon} className="text-white" strokeWidth={2.2} />
        </div>
    );
}
