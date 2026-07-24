import { ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "../common/ConfirmDialog";
import useChat from "../../hooks/useChat";
import toast from "react-hot-toast";
import SettingsSection from "./SettingsSection";

export default function PrivacySection() {

    const { deleteAllConversations } = useChat();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {

      try {

          setLoading(true);

          await deleteAllConversations();

          toast.success("All conversations deleted.");

          setOpen(false);

      } catch (error) {

          toast.error("Failed to delete conversations.");

      } finally {

          setLoading(false);

      }

    };

    return (

        <SettingsSection
            icon={<ShieldAlert size={22} />}
            title="Privacy"
            description="Manage your conversation history and personal data."
        >

            <div className="flex items-center justify-between">

                <div>

                    <h3 className="font-semibold">
                        Delete all conversations
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                        Permanently remove all your conversations.
                    </p>

                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-lg
                        bg-red-600
                        hover:bg-red-700
                        transition-colors
                    "
                >
                    <Trash2 size={18} />

                    Delete All

                </button>
                <ConfirmDialog
                    open={open}
                    loading={loading}
                    title="Delete all conversations"
                    loadingText="Deleting..."
                    message="This action will permanently delete all your conversations. This action cannot be undone."
                    confirmText="Delete All"
                    onCancel={() => setOpen(false)}
                    onConfirm={handleDelete}
                />

            </div>

        </SettingsSection>

    );

}