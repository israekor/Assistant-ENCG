import { ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../common/ConfirmDialog";
import useChat from "../../hooks/useChat";
import SettingsSection from "./SettingsSection";

export default function PrivacySection() {

    const { deleteAllConversations } = useChat();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {

      try {

          setLoading(true);

          await deleteAllConversations();

          toast.success("Toutes les conversations ont été supprimées.");

          setOpen(false);

      } catch {

          toast.error("Échec de la suppression des conversations.");

      } finally {

          setLoading(false);

      }

    };

    return (

        <SettingsSection
            icon={<ShieldAlert size={20} />}
            title="Confidentialité"
            description="Gérez votre historique de conversations et vos données personnelles."
        >

            <div className="flex items-center justify-between gap-4">

                <div>

                    <h3 className="font-semibold text-sm">
                        Supprimer toutes les conversations
                    </h3>

                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Supprime définitivement toutes vos conversations.
                    </p>

                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shrink-0"
                >
                    <Trash2 size={16} />

                    Tout supprimer

                </button>

            </div>

            <ConfirmDialog
                open={open}
                loading={loading}
                title="Supprimer toutes les conversations"
                loadingText="Suppression..."
                message="Cette action supprimera définitivement toutes vos conversations. Cette action est irréversible."
                confirmText="Tout supprimer"
                cancelText="Annuler"
                onCancel={() => setOpen(false)}
                onConfirm={handleDelete}
            />

        </SettingsSection>

    );

}
