import {
    MessageSquare,
    MoreVertical,
    Archive,
    Trash2
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
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
    const menuRef = useRef(null);

    const isActive =
        currentConversation?.idConversation === conversation.idConversation;

    useEffect(() => {
        if (!openMenu) return;

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenu]);

    return (
      <div className="relative" ref={menuRef}>

        <NavLink
            to={`/chat/${conversation.idConversation}`}
            onClick={() => openConversation(conversation)}
            className={`group flex items-center gap-2.5 rounded-xl pl-3 pr-1.5 py-2.5 text-sm transition-colors
                ${
                    isActive
                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 font-medium"
                        : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }
            `}
        >

          <MessageSquare size={16} className="shrink-0" />

          <span className="flex-1 truncate">
              {conversation.title}
          </span>

          <button
              onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenMenu(!openMenu);
              }}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-opacity"
          >
              <MoreVertical size={16}/>
          </button>

        </NavLink>
        {
          openMenu && (

              <div
                  className="
                      absolute
                      right-0
                      top-full
                      mt-1
                      w-44
                      rounded-xl
                      bg-white
                      dark:bg-neutral-800
                      border
                      border-neutral-200
                      dark:border-neutral-700
                      shadow-lg
                      z-50
                      overflow-hidden
                      py-1
                      animate-fade-in
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
                          gap-2.5
                          px-4
                          py-2.5
                          text-sm
                          hover:bg-neutral-100
                          dark:hover:bg-neutral-700
                      "
                  >
                      <Archive size={15}/>

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
                          gap-2.5
                          px-4
                          py-2.5
                          text-sm
                          text-red-500
                          hover:bg-neutral-100
                          dark:hover:bg-neutral-700
                      "
                  >
                      <Trash2 size={15}/>

                      Supprimer
                  </button>

              </div>

          )
        }
      </div>
    )
}
