export default function SettingsSection({
    icon,
    title,
    description,
    children,
}) {

    return (

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">

            <div className="flex items-start gap-4 mb-6">

                <div className="text-cyan-400">

                    {icon}

                </div>

                <div>

                    <h2 className="text-xl font-semibold">

                        {title}

                    </h2>

                    <p className="text-slate-400 text-sm mt-1">

                        {description}

                    </p>

                </div>

            </div>

            {children}

        </div>

    );
}