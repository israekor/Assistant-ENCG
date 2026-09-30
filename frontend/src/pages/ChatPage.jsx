import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, CalendarClock, HelpCircle } from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import ChatInput from "../components/chat/ChatInput";
import ChatMessage from "../components/chat/ChatMessage";
import Loading from "../components/chat/Loading";
import Logo from "../components/common/Logo";

import useChat from "../hooks/useChat";

const SUGGESTIONS = [
    { icon: BookOpen, label: "Quelles sont les formations proposées par l'ENCGT ?" },
    { icon: CalendarClock, label: "Quelles sont les dates du concours d'accès ?" },
    { icon: HelpCircle, label: "Comment se déroule la procédure d'inscription ?" },
];

export default function ChatPage() {

    const navigate = useNavigate();
    const { conversationId: routeConversationId } = useParams();

    const {
        conversations,
        currentConversation,
        messages,
        loadingConversation,
        loadingMessage,
        streamingContent,
        isStreaming,
        openConversation,
        openConversationById,
        sendMessage,
        sendFeedback
    } = useChat();

    const messagesEndRef = useRef(null);
    const attemptedRef = useRef(null);

    useEffect(() => {
        if (!routeConversationId) {
            attemptedRef.current = null;
            return;
        }
        if (currentConversation?.idConversation === routeConversationId) return;
        if (isStreaming || attemptedRef.current === routeConversationId) return;

        attemptedRef.current = routeConversationId;

        const conversation = conversations.find(
            c => c.idConversation === routeConversationId
        );

        if (conversation) {
            openConversation(conversation);
        } else {
            openConversationById(routeConversationId);
        }
    }, [routeConversationId, conversations, currentConversation, isStreaming]);

    const handleSend = async (message) => {
        const isNewConversation = currentConversation == null;

        try {
            const data = await sendMessage(message);

            if (isNewConversation && data?.conversationId) {
                navigate(`/chat/${data.conversationId}`, { replace: true });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const showWelcome = messages.length === 0 && !routeConversationId && !isStreaming;

    return (
        <MainLayout>
            <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">

                    {showWelcome ? (

                        <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                            <Logo size="lg" className="mb-5" />
                            <h2 className="text-2xl font-bold">Bonjour 👋</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 mt-2 max-w-md">
                                Je suis l'assistant IA de l'ENCG Tanger. Posez-moi une question sur les
                                formations, les inscriptions ou la vie de l'école.
                            </p>

                            <div className="mt-8 grid gap-3 w-full max-w-lg sm:grid-cols-1">
                                {SUGGESTIONS.map(({ icon: Icon, label }) => (
                                    <button
                                        key={label}
                                        onClick={() => handleSend(label)}
                                        className="flex items-center gap-3 text-left px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-brand-400 dark:hover:border-brand-500 hover:shadow-sm transition"
                                    >
                                        <span className="w-8 h-8 shrink-0 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
                                            <Icon size={16} />
                                        </span>
                                        <span className="text-sm text-neutral-700 dark:text-neutral-200">
                                            {label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                    ) : (

                        <div className="max-w-3xl mx-auto p-4 sm:p-6">

                            {messages.map(message => (
                                <ChatMessage
                                    key={message.id}
                                    role={message.role}
                                    content={message.content}
                                    responseId={message.responseId}
                                    feedback={message.feedback}
                                    onFeedback={sendFeedback}
                                />
                            ))}

                            {/* Bulle affichée pendant que le texte arrive mot par mot */}
                            {isStreaming && streamingContent === "" && <Loading />}

                            {isStreaming && streamingContent !== "" && (
                                <ChatMessage
                                    role="assistant"
                                    content={streamingContent}
                                    isStreaming={true}
                                />
                            )}

                            <div ref={messagesEndRef} />

                        </div>
                    )}

                </div>

                <ChatInput onSend={handleSend} loading={loadingMessage || isStreaming} />

            </div>
        </MainLayout>
    );
}