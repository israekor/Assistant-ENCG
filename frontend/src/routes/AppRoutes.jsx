import { Routes, Route, Navigate } from "react-router-dom";

import ChatPage from "../pages/ChatPage";
import ProfilePage from "../pages/ProfilePage";
import HistoryPage from "../pages/HistoryPage";
import SettingsPage from "../pages/SettingsPage";

export default function AppRoutes() {

    return (

        <Routes>

            <Route path="/" element={<Navigate to="/chat" replace />} />

            <Route path="/chat" element={<ChatPage />} />

            <Route path="/chat/:conversationId" element={<ChatPage />} />

            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/history" element={<HistoryPage />} />

            <Route path="/settings" element={<SettingsPage />} />

        </Routes>

    );

}