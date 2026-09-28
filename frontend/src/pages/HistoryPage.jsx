import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import useChat from "../hooks/useChat";
import HistoryItem from "../components/history/HistoryItem";


export default function HistoryPage() {

    const { conversations } = useChat();

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("ALL");

    const filters = [
        "ALL",
        "ACTIVE",
        "ARCHIVED"
    ];

    //------------------ Filtrage ------------------------
    const filteredConversations = useMemo(() => {

        return conversations.filter(conversation => {

            const matchesSearch =
                conversation.title
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesFilter =
                filter === "ALL"
                || conversation.status === filter;

            return matchesSearch && matchesFilter;

        });

    }, [conversations, search, filter]);

    return (
        <MainLayout showSidebar={false}>

            <div className="max-w-4xl mx-auto p-6 sm:p-8">

                <div className="mb-8">

                    <h1 className="text-2xl sm:text-3xl font-bold">

                        Historique

                    </h1>

                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">

                        Gérez vos conversations actives et archivées.

                    </p>

                </div>

                <div className="relative mb-5">

                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher une conversation..."
                        className="w-full rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pl-11 pr-4 py-3 text-sm placeholder:text-neutral-400 outline-none focus:ring-2 ring-brand-500/40"
                    />

                </div>

                <div className="flex gap-2 mb-8">

                    {filters.map(value => (

                        <button
                            key={value}
                            onClick={() => setFilter(value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                filter === value
                                    ? "bg-brand-600 text-white"
                                    : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            }`}
                        >
                            {value === "ALL"
                                ? "Toutes"
                                : value === "ACTIVE"
                                    ? "Actives"
                                    : "Archivées"}
                        </button>

                    ))}

                </div>

                <div className="grid gap-3">

                    {
                        filteredConversations.length === 0 ? (

                            <div className="text-center text-neutral-400 dark:text-neutral-500 py-20">

                                Aucune conversation trouvée.

                            </div>

                        ) : (

                            filteredConversations.map(conversation => (

                                <HistoryItem
                                    key={conversation.idConversation}
                                    conversation={conversation}
                                />

                            ))

                        )
                    }

                </div>

            </div>

        </MainLayout>
    );
}
