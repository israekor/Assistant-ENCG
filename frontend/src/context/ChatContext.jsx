import { createContext, useEffect, useState } from "react";

import chatService from "../services/chatService";
import conversationService from "../services/conversationService";

export const ChatContext = createContext();

export function ChatProvider({ children }) {

    const [conversations, setConversations] = useState([]);

    const [currentConversation, setCurrentConversation] = useState(null);

    const [messages, setMessages] = useState([]);

    const [loadingConversation, setLoadingConversation] = useState(false);

    const [loadingMessage, setLoadingMessage] = useState(false);

    //-------------- Charger les conversations -------------------
    const loadConversations = async () => {

        try {

            const response = await conversationService.getAll();

            setConversations(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingConversation(false);

        }

    };

    useEffect(() => {

        loadConversations();

    }, []);

    //-------------- Ouvrir une conversation -------------------
    const openConversation = async (conversation) => {

        setLoadingConversation(true);

        try {

            const response = await conversationService.getHistory(
                conversation.idConversation
            );

            const history = response.data.map(message => ({

                id: message.id,

                role:
                    message.role === "USER"
                        ? "user"
                        : "assistant",

                content: message.content

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

    };

    //-------------- Ajouter une conversation -------------------
    const addConversation = (conversation) => {

        setConversations(prev => [

            conversation,

            ...prev

        ]);

    };

    //-------------------- Envoyer un message -------------------
    const sendMessage = async (content) => {

        const userMessage = {

            id: crypto.randomUUID(),

            role: "user",

            content

        };

        setMessages(prev => [

            ...prev,

            userMessage

        ]);

        setLoadingMessage(true);

        try {

            const response = await chatService.sendMessage({

                conversationId:
                    currentConversation?.idConversation,

                message: content

            });

            const data = response.data;

            // Première conversation

            if (!currentConversation) {

                const conversation = {

                    idConversation:
                        data.conversationId,

                    title:
                        data.conversationTitle

                };

                addConversation(conversation);

                setCurrentConversation(conversation);

            }

            const assistantMessage = {

                id: data.responseId,

                role: "assistant",

                content: data.answer

            };

            setMessages(prev => [

                ...prev,

                assistantMessage

            ]);

            return data;

        } catch (error) {

            setMessages(prev => [

                ...prev,

                {

                    id: crypto.randomUUID(),

                    role: "assistant",

                    content:
                        "❌ Une erreur est survenue."

                }

            ]);

            throw error;

        } finally {

            setLoadingMessage(false);

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

                loadConversations,
                openConversation,
                newConversation,
                addConversation,
                sendMessage,

                setCurrentConversation,
                setMessages

            }}
        >

            {children}

        </ChatContext.Provider>

    );

}