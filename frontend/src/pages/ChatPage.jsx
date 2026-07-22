import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ChatInput from "../components/chat/ChatInput";
import ChatMessage from "../components/chat/ChatMessage";
import Loading from "../components/chat/Loading";

import useChat from "../hooks/useChat";

export default function ChatPage() {

    const navigate = useNavigate();

    const { conversationId: routeConversationId } = useParams();

    const {

        conversations,
        currentConversation,
        messages,
        loadingConversation,
        loadingMessage,
        openConversation,
        sendMessage

    } = useChat();

    const messagesEndRef = useRef(null);

    //-------------- Scroll automatique ------------------

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({

            behavior: "smooth"

        });

    }, [messages, loadingMessage]);


    // ----------- Charger une conversation -----------------

    useEffect(() => {
        if (loadingConversation) {
            return;
        }

        if (!routeConversationId)
            return;

        const conversation = conversations.find(

            c => c.idConversation === routeConversationId

        );

        if (
            conversation &&
            currentConversation?.idConversation !== routeConversationId
        ) {

            openConversation(conversation);

        }

    }, [

        loadingConversation,

        routeConversationId,

        conversations,

        currentConversation,

        openConversation

    ]);

    //------------------ Envoyer un message -------------------

    const handleSend = async (message) => {

        const isNewConversation =
            currentConversation == null;

        try {

            const data =
                await sendMessage(message);

            if (isNewConversation) {

                navigate(

                    `/chat/${data.conversationId}`,

                    {

                        replace: true

                    }

                );

            }

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <MainLayout>

            <div className="h-full flex flex-col bg-slate-800">

                <div className="flex-1 overflow-y-auto p-6">

                    {
                        messages.length === 0 &&
                        !routeConversationId &&

                        <ChatMessage

                            role="assistant"

                            content="Bonjour 👋 Je suis votre assistant IA. Posez-moi une question."

                        />

                    }

                    {
                        messages.map(message => (

                            <ChatMessage

                                key={message.id}

                                role={message.role}

                                content={message.content}

                            />

                        ))
                    }

                    {
                        (loadingConversation || loadingMessage) &&

                        <Loading />

                    }

                    <div ref={messagesEndRef} />

                </div>

                <ChatInput

                    onSend={handleSend}

                    loading={loadingMessage}

                />

            </div>

        </MainLayout>

    );

}