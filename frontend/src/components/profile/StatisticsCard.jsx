export default function StatisticsCard({
    title,
    value
}) {

    return (

        <div className="
            bg-slate-800
            rounded-xl
            border
            border-slate-700
            p-5
            text-center
        ">

            <p className="text-3xl font-bold text-emerald-400">
                {value}
            </p>

            <p className="mt-2 text-slate-400">
                {title}
            </p>

        </div>

    );

}