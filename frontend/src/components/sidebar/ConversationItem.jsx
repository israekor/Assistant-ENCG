import {
    MessageSquare,
    MoreVertical,
    Archive,
    Trash2
} from "lucide-react";

import { useState } from "react";
import { NavLink } from "react-router-dom";

import useChat from "../../hooks/useChat";

export default function ConversationItem({ conversation }) {

    const {
        currentConversation,
        openConversation,
        archiveConversation,
        deleteConversation
    } = useChat();

    const [openMenu, setOpenMenu] = useState(false);

    const isActive =
        currentConversation?.idConversation === conversation.idConversation;

    return (
      <div className="relative mb-2">

        <NavLink
            to={`/chat/${conversation.idConversation}`}
            onClick={() => openConversation(conversation)}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors
                ${
                    isActive
                        ? "bg-emerald-600 text-white"
                        : "text-gray-200 hover:bg-slate-800"
                }
            `}
        >

          <>
              <MessageSquare size={18} />

              <span className="flex-1 truncate">
                  {conversation.title}
              </span>

              <button
                  onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenMenu(!openMenu);
                  }}
                  className="p-1 rounded hover:bg-black/20"
              >
                  <MoreVertical size={18}/>
              </button>
          </>

        </NavLink>
        {
          openMenu && (

              <div
                  className="
                      absolute
                      right-0
                      mt-1
                      w-44
                      rounded-lg
                      bg-slate-800
                      border
                      border-slate-700
                      shadow-xl
                      z-50
                  "
              >

                  <button
                    onClick={async (e) => {

                        e.preventDefault();
                        e.stopPropagation();

                        await archiveConversation(
                            conversation.idConversation
                        );

                        setOpenMenu(false);

                    }}                  
                      className="
                          w-full
                          flex
                          items-center
                          gap-2
                          px-4
                          py-3
                          hover:bg-slate-700
                      "
                  >
                      <Archive size={16}/>

                      Archiver
                  </button>

                  <button
                    onClick={async (e) => {

                        e.preventDefault();
                        e.stopPropagation();

                        if (!window.confirm(
                            "Supprimer cette conversation ?"
                        )) {
                            return;
                        }

                        await deleteConversation(
                            conversation.idConversation
                        );

                        setOpenMenu(false);

                    }}

                      className="
                          w-full
                          flex
                          items-center
                          gap-2
                          px-4
                          py-3
                          text-red-400
                          hover:bg-slate-700
                      "
                  >
                      <Trash2 size={16}/>

                      Supprimer
                  </button>

              </div>

          )
        }
      </div>
    )
}