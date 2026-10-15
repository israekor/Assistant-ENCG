import { Routes, Route } from "react-router-dom";

import WelcomePage from "../pages/WelcomePage";
import ChatPage from "../pages/ChatPage";
import ProfilePage from "../pages/ProfilePage";
import HistoryPage from "../pages/HistoryPage";
import SettingsPage from "../pages/SettingsPage";
import RegisterPage from "../pages/RegisterPage";
import AdminPage from "../pages/AdminPage";

export default function AppRoutes() {

    return (

        <Routes>

            <Route path="/" element={<WelcomePage />} />

            <Route path="/chat" element={<ChatPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route path="/chat/:conversationId" element={<ChatPage />} />

            <Route path="/admin" element={<AdminPage />} />

            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/history" element={<HistoryPage />} />

            <Route path="/settings" element={<SettingsPage />} />

        </Routes>

    );

}