import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

import feedbackService from "../../services/feedbackService";

export default function FeedbackButtons({ responseId }) {

    const [feedback, setFeedback] = useState(null);

    useEffect(() => {

        if (!responseId) return;

        loadFeedback();

    }, [responseId]);

    async function loadFeedback() {

        try {

            const data = await feedbackService.getFeedback(responseId);

            setFeedback(data.feedbackType);

        } catch {

            setFeedback(null);

        }

    }

    async function send(type) {

        try {

            await feedbackService.addFeedback(responseId, type);

            setFeedback(type);

        } catch (err) {

            console.error(err);

        }

    }

    return (

        <div className="flex items-center gap-1 mt-2.5 -ml-1.5">

            <button
                onClick={() => send("LIKE")}
                className={`p-1.5 rounded-lg transition-colors ${
                    feedback === "LIKE"
                        ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
                        : "text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }`}
            >
                <ThumbsUp size={15}/>
            </button>

            <button
                onClick={() => send("DISLIKE")}
                className={`p-1.5 rounded-lg transition-colors ${
                    feedback === "DISLIKE"
                        ? "text-red-500 bg-red-50 dark:bg-red-500/10"
                        : "text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }`}
            >
                <ThumbsDown size={15}/>
            </button>

        </div>

    );

}
