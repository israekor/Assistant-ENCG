import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import toast from "react-hot-toast";

// navigator.clipboard n'existe qu'en HTTPS ou sur localhost.
// Ce repli permet de copier aussi quand l'app est servie en HTTP simple.
async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!ok) throw new Error("Copie impossible");
}

export default function CopyButton({ text, className = "" }) {

    const [copied, setCopied] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleCopy = async () => {
        try {
            await copyToClipboard(text);
            setCopied(true);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Impossible de copier le message");
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Message copié" : "Copier le message"}
            title={copied ? "Copié !" : "Copier"}
            className={`p-1.5 rounded-lg transition-colors ${className}`}
        >
            {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
    );
}
