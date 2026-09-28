import { MessageSquare, Archive, ThumbsUp, ThumbsDown, MessagesSquare } from "lucide-react";

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

            <div className="max-w-4xl mx-auto p-6 sm:p-8">

                <div className="mb-8">

                    <h1 className="text-2xl sm:text-3xl font-bold">

                        Mon profil

                    </h1>

                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">

                        Informations de votre compte.

                    </p>

                </div>

                {

                    auth.authenticated
                        ? <ProfileCard />
                        : <GuestCard />

                }

                <div className="mt-10">

                    <h2 className="text-lg font-semibold mb-4">

                        Statistiques

                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">

                        <StatisticsCard icon={MessageSquare} title="Conversations" value={statistics?.conversations ?? 0} />
                        <StatisticsCard icon={Archive} title="Archivées" value={statistics?.archivedConversations ?? 0} />
                        <StatisticsCard icon={MessagesSquare} title="Messages" value={statistics?.messages ?? 0} />
                        <StatisticsCard icon={ThumbsUp} title="Likes" value={statistics?.likes ?? 0} />
                        <StatisticsCard icon={ThumbsDown} title="Dislikes" value={statistics?.dislikes ?? 0} />

                    </div>

                </div>

            </div>

        </MainLayout>

    );

}
