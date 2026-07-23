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

        <div className="flex items-center gap-2 mt-2">

            <button
                onClick={() => send("LIKE")}
                className={`p-1 rounded ${
                    feedback === "LIKE"
                        ? "text-green-500"
                        : "text-gray-400 hover:text-green-500"
                }`}
            >
                <ThumbsUp size={18}/>
            </button>

            <button
                onClick={() => send("DISLIKE")}
                className={`p-1 rounded ${
                    feedback === "DISLIKE"
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                }`}
            >
                <ThumbsDown size={18}/>
            </button>

        </div>

    );

}