import { useEffect, useRef, useState } from "react";
import { Bot, Pencil, User } from "lucide-react";

import FeedbackButtons from "./FeedbackButtons";
import CopyButton from "./CopyButton";
import MarkdownContent from "./MarkdownContent";

const actionBtn =
    "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700";

export default function ChatMessage({
    id,
    role,
    content,
    responseId,
    feedback,
    onFeedback,
    onEdit,
    canEdit = false,
    isStreaming = false
}) {

    const isUser = role === "user";

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(content);
    const textareaRef = useRef(null);

    // Ajuste la hauteur du champ de saisie au texte et place le curseur à la fin
    useEffect(() => {
        if (!editing || !textareaRef.current) return;
        const el = textareaRef.current;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [editing, draft]);

    useEffect(() => {
        if (!editing || !textareaRef.current) return;
        const el = textareaRef.current;
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
    }, [editing]);

    const startEdit = () => {
        setDraft(content);
        setEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
        setDraft(content);
    };

    const submitEdit = () => {
        const next = draft.trim();
        if (!next) return;

        // Rien n'a changé : on ferme simplement l'éditeur
        if (next === content.trim()) {
            setEditing(false);
            return;
        }

        setEditing(false);
        onEdit?.(id, next);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            cancelEdit();
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitEdit();
        }
    };

    const showUserActions = isUser && !editing;
    const showBotActions = !isUser && !isStreaming && content;

    return (
        <div
            className={`group flex gap-3 mb-6 items-start animate-fade-in ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >
            {!isUser && (
                <div className="w-9 h-9 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={18} className="text-white" />
                </div>
            )}

            <div
                className={`flex flex-col min-w-0 ${
                    isUser ? "items-end" : "items-start"
                } ${editing ? "w-full max-w-[90%] sm:max-w-[80%]" : "max-w-[85%] sm:max-w-[75%]"}`}
            >

                {editing ? (

                    <div className="w-full rounded-2xl border border-brand-500/60 bg-white dark:bg-neutral-800 shadow-sm p-3 ring-2 ring-brand-500/20">

                        <textarea
                            ref={textareaRef}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            aria-label="Modifier votre message"
                            className="w-full resize-none bg-transparent outline-none text-[15px] leading-relaxed text-neutral-900 dark:text-neutral-100 max-h-64"
                        />

                        <div className="flex items-center justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={submitEdit}
                                disabled={!draft.trim()}
                                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed text-white transition-colors"
                            >
                                Envoyer
                            </button>
                        </div>

                    </div>

                ) : (

                    <div
                        className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm ${
                            isUser
                                ? "bg-brand-600 text-white rounded-tr-sm"
                                : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-tl-sm"
                        }`}
                    >
                        {isUser ? (
                            <p className="leading-relaxed whitespace-pre-wrap break-words text-[15px]">
                                {content}
                            </p>
                        ) : (
                            <MarkdownContent content={content} isStreaming={isStreaming} />
                        )}
                    </div>

                )}

                {/* Actions : visibles en permanence sur mobile, au survol sur ordinateur */}
                {showUserActions && (
                    <div className="flex items-center gap-0.5 mt-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100">
                        <CopyButton text={content} className={actionBtn} />
                        {canEdit && (
                            <button
                                type="button"
                                onClick={startEdit}
                                aria-label="Modifier le message"
                                title="Modifier"
                                className={`p-1.5 rounded-lg transition-colors ${actionBtn}`}
                            >
                                <Pencil size={15} />
                            </button>
                        )}
                    </div>
                )}

                {showBotActions && (
                    <div className="flex items-center gap-0.5 mt-1.5">
                        {responseId && (
                            <FeedbackButtons
                                responseId={responseId}
                                feedback={feedback}
                                onFeedback={onFeedback}
                            />
                        )}
                        <CopyButton text={content} className={actionBtn} />
                    </div>
                )}

            </div>

            {isUser && (
                <div className="w-9 h-9 rounded-full bg-neutral-800 dark:bg-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={18} className="text-white" />
                </div>
            )}
        </div>
    );
}
