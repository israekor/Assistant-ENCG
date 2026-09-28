export default function StatisticsCard({
    title,
    value,
    icon: Icon
}) {

    return (

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">

            {Icon && (
                <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
                    <Icon size={18} />
                </div>
            )}

            <p className="text-2xl sm:text-3xl font-bold">
                {value}
            </p>

            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {title}
            </p>

        </div>

    );

}
