import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "danger",
    loading = false,
    loadingText = "Loading...",
    onConfirm,
    onCancel,
}) {

    if (!open) return null;

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/60
                backdrop-blur-sm
            "
            onClick={() => {
                if (!loading) {
                    onCancel();
                }
            }}
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    w-full
                    max-w-md
                    rounded-xl
                    bg-slate-800
                    border
                    border-slate-700
                    shadow-xl
                    p-6
                "
            >

                <div className="flex items-center gap-3">

                    <div
                        className="
                            p-3
                            rounded-full
                            bg-red-500/20
                            text-red-400
                        "
                    >

                        <AlertTriangle size={24} />

                    </div>

                    <h2 className="text-xl font-semibold">

                        {title}

                    </h2>

                </div>

                <p className="mt-5 text-slate-400">

                    {message}

                </p>

                <div
                    className="
                        mt-8
                        flex
                        justify-end
                        gap-3
                    "
                >

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-slate-700
                            hover:bg-slate-600
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`
                            px-4
                            py-2
                            rounded-lg
                            text-white
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            ${
                                confirmVariant === "danger"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-cyan-600 hover:bg-cyan-700"
                            }
                        `}
                    >
                        {loading ? loadingText : confirmText}
                    </button>

                </div>

            </div>

        </div>

    );

}