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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => {
                if (!loading) {
                    onCancel();
                }
            }}
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl p-6 animate-fade-in"
            >

                <div className="flex items-center gap-3">

                    <div className="p-2.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500">

                        <AlertTriangle size={22} />

                    </div>

                    <h2 className="text-lg font-semibold">

                        {title}

                    </h2>

                </div>

                <p className="mt-4 text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">

                    {message}

                </p>

                <div className="mt-7 flex justify-end gap-3">

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition ${
                            confirmVariant === "danger"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-brand-600 hover:bg-brand-700"
                        }`}
                    >
                        {loading ? loadingText : confirmText}
                    </button>

                </div>

            </div>

        </div>

    );

}
