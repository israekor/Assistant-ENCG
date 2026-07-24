import { useMemo, useState } from "react";

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

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-white">

                    Historique

                </h1>

                <p className="text-slate-400 mt-2">

                    Gérez vos conversations actives et archivées.

                </p>

            </div>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une conversation..."
                className="
                    w-full
                    rounded-lg
                    bg-slate-800
                    border
                    border-slate-700
                    px-4
                    py-3
                    text-white
                    placeholder:text-slate-500
                    mb-6
                "
            />

            <div className="flex gap-3 mb-8">

                {filters.map(value => (

                    <button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`
                            px-4
                            py-2
                            rounded-lg
                            ${
                                filter === value
                                    ? "bg-emerald-600"
                                    : "bg-slate-800 hover:bg-slate-700"
                            }
                        `}
                    >
                        {value === "ALL"
                            ? "Toutes"
                            : value === "ACTIVE"
                                ? "Actives"
                                : "Archivées"}
                    </button>

                ))}

            </div>

            <div className="grid gap-4">

                {
                    filteredConversations.length === 0 ? (

                        <div className="text-center text-slate-400 py-20">

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

        </MainLayout>
    );
}