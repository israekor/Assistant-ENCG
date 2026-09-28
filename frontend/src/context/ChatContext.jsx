import { createContext, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

import chatService from "../services/chatService";
import conversationService from "../services/conversationService";
import profileService from "../services/profileService";

export const ChatContext = createContext();

export function ChatProvider({ children }) {

    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingConversation, setLoadingConversation] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);
    const [statistics, setStatistics] = useState(null);

    // --- Nouveaux états pour le streaming ---
    const [streamingContent, setStreamingContent] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);

    const abortRef = useRef(null);

    //-------------- Charger les conversations -------------------
    const loadConversations = async () => {
        try {
            const response = await conversationService.getActive();
            setConversations(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingConversation(false);
        }
    };

    useEffect(() => {
        loadConversations();
        loadStatistics();
    }, []);

    //-------------- Load History ------------------------------
    const loadHistory = async () => {
        const response = await conversationService.getAll();
        return response.data;
    };

    //-------------- Ouvrir une conversation -------------------
    const openConversation = async (conversation) => {
        setLoadingConversation(true);
        try {
            const response = await conversationService.getHistory(
                conversation.idConversation
            );
            const history = response.data.map(message => ({
                id: message.id,
                role: message.role === "USER" ? "user" : "assistant",
                content: message.content,
                responseId: message.responseId,
                feedback: message.feedback
            }));
            setCurrentConversation(conversation);
            setMessages(history);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingConversation(false);
        }
    };

    //-------------- Nouvelle conversation -------------------
    const newConversation = () => {
        setCurrentConversation(null);
        setMessages([]);
        setLoadingConversation(false);
    };

    //-------------- Ajouter une conversation -------------------
    const addConversation = (conversation) => {
        setConversations(prev => [conversation, ...prev]);
    };

    //-------------------- Envoyer un message (avec streaming) -------------------
    const sendMessage = async (content) => {

        const userMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content
        };

        setMessages(prev => [...prev, userMessage]);

        setLoadingMessage(true);
        setIsStreaming(true);
        setStreamingContent("");

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        let accumulated = "";
        let resultData = null;

        try {
            await chatService.streamMessage(
                {
                    conversationId: currentConversation?.idConversation,
                    message: content
                },
                {
                    onConversation: (data) => {
                        // Première conversation : on la crée côté UI dès qu'on connaît son id
                        if (!currentConversation) {
                            const conversation = {
                                idConversation: data.conversationId,
                                title: data.conversationTitle
                            };
                            addConversation(conversation);
                            setCurrentConversation(conversation);
                        }
                        resultData = { ...resultData, conversationId: data.conversationId };
                    },

                    onToken: (chunk) => {
                        accumulated += chunk;
                        setStreamingContent(accumulated);
                        // Dès qu'on reçoit le premier token, on peut masquer le loader classique
                        setLoadingMessage(false);
                    },

                    onDone: (data) => {
                        const assistantMessage = {
                            id: data.responseId,
                            role: "assistant",
                            content: accumulated,
                            responseId: data.responseId,
                            feedback: null
                        };

                        setMessages(prev => [...prev, assistantMessage]);
                        setStreamingContent("");
                        setIsStreaming(false);
                        setLoadingMessage(false);

                        resultData = {
                            ...resultData,
                            responseId: data.responseId,
                            answer: accumulated
                        };
                    },

                    onError: () => {
                        setMessages(prev => [
                            ...prev,
                            {
                                id: crypto.randomUUID(),
                                role: "assistant",
                                content: "❌ Une erreur est survenue."
                            }
                        ]);
                        setStreamingContent("");
                        setIsStreaming(false);
                        setLoadingMessage(false);
                    }
                },
                controller.signal
            );

            return resultData;

        } catch (error) {

            if (error.name !== "AbortError") {
                setMessages(prev => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        role: "assistant",
                        content: "❌ Une erreur est survenue."
                    }
                ]);
            }

            setStreamingContent("");
            setIsStreaming(false);
            setLoadingMessage(false);

            throw error;
        }
    };

    //-------------------- Envoyer un feedback -------------------
    const sendFeedback = async (responseId, feedbackType) => {
        await feedbackService.addFeedback(responseId, {
            feedbackType,
            comment: null
        });
        toast.success("Merci pour votre retour !");
        await loadStatistics();
        setMessages(prev =>
            prev.map(message =>
                message.responseId === responseId
                    ? { ...message, feedback: { feedbackType } }
                    : message
            )
        );
    };

    //-------------------- Archiver / Restaurer / Supprimer -------------------
    const archiveConversation = async (conversationId) => {
        await conversationService.archiveConversation(conversationId);
        toast.success("Conversation archivée");
        await loadConversations();
        await loadStatistics();
        if (currentConversation?.idConversation === conversationId) {
            newConversation();
        }
    };

    const restoreConversation = async (conversationId) => {
        await conversationService.restoreConversation(conversationId);
        toast.success("Conversation restaurée");
        await loadConversations();
        await loadStatistics();
    };

    const deleteConversation = async (conversationId) => {
        await conversationService.deleteConversation(conversationId);
        toast.success("Conversation supprimée");
        await loadConversations();
        await loadStatistics();
        if (currentConversation?.idConversation === conversationId) {
            newConversation();
        }
    };

    const deleteAllConversations = async () => {
        await conversationService.deleteAll();
        setConversations([]);
        setMessages([]);
        setCurrentConversation(null);
    };

    //---------------------- Load statistics ------------------------------
    const loadStatistics = async () => {
        try {
            const response = await profileService.getStatistics();
            setStatistics(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                conversations,
                currentConversation,
                messages,

                loadingConversation,
                loadingMessage,

                // --- exposés pour l'affichage du streaming ---
                streamingContent,
                isStreaming,

                loadConversations,
                openConversation,
                newConversation,
                addConversation,
                sendMessage,
                sendFeedback,
                archiveConversation,
                deleteConversation,
                deleteAllConversations,
                restoreConversation,

                setCurrentConversation,
                setMessages,
                statistics,
                loadStatistics
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}