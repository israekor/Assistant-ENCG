import MainLayout from "../layouts/MainLayout";

import useAuth from "../auth/useAuth";
import useChat from "../hooks/useChat";

import ProfileCard from "../components/profile/ProfileCard";
import GuestCard from "../components/profile/GuestCard";
import StatisticsCard from "../components/profile/StatisticsCard";

export default function ProfilePage() {

    const auth = useAuth();

    const { statistics } = useChat();

    return (

        <MainLayout showSidebar={false}>

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-white">

                    Mon profil

                </h1>

                <p className="text-slate-400 mt-2">

                    Informations de votre compte.

                </p>

            </div>

            {

                auth.authenticated
                    ? <ProfileCard />
                    : <GuestCard />

            }

            <div className="mt-10">

                <h2 className="text-2xl font-semibold mb-6">

                    Statistiques

                </h2>

                <div>
                    <h2>Conversations</h2>
                    <p>{statistics?.conversations ?? 0}</p>
                </div>

                <div>
                    <h2>Archivées</h2>
                    <p>{statistics?.archivedConversations ?? 0}</p>
                </div>

                <div>
                    <h2>Messages</h2>
                    <p>{statistics?.messages ?? 0}</p>
                </div>

                <div>
                    <h2>Likes</h2>
                    <p>{statistics?.likes ?? 0}</p>
                </div>

                <div>
                    <h2>Dislikes</h2>
                    <p>{statistics?.dislikes ?? 0}</p>
                </div>

            </div>

        </MainLayout>

    );

}