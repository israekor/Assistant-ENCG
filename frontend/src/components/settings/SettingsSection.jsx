export default function SettingsSection({
    icon,
    title,
    description,
    children,
}) {

    return (

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">

            <div className="flex items-start gap-4 mb-6">

                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">

                    {icon}

                </div>

                <div>

                    <h2 className="text-lg font-semibold">

                        {title}

                    </h2>

                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-0.5">

                        {description}

                    </p>

                </div>

            </div>

            {children}

        </div>

    );
}
