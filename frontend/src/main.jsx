import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App";
import AuthProvider from "./auth/AuthProvider";
import { ChatProvider } from "./context/ChatContext";

createRoot(document.getElementById("root")).render(

    <AuthProvider>

        <ChatProvider>

            <BrowserRouter>

                <App />
                
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 3000
                    }}
                />

            </BrowserRouter>

        </ChatProvider>

    </AuthProvider>

);