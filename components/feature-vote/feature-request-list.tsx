"use client";

import { useEffect, useState } from "react";

interface Feature {
    id: string;
    title: string;
    description: string;
    votes: number;
}

export default function FeatureRequests() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatures = async () => {
            const response = await fetch("/api/features");
            const data = await response.json();
            setFeatures(data);
            setLoading(false);
        };

        fetchFeatures();
    }, []);

    const handleVote = async (featureId: string) => {
        await fetch("/api/features/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feature_id: featureId }),
        });

        // Optimistically update votes
        setFeatures((prev) =>
            prev.map((feature) =>
                feature.id === featureId
                    ? { ...feature, votes: feature.votes + 1 }
                    : feature
            )
        );
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold">Feature Requests</h1>
            <ul>
                {features.map((feature) => (
                    <li
                        key={feature.id}
                        className="border p-4 my-2 rounded-lg shadow-sm"
                    >
                        <h2 className="text-lg font-semibold">
                            {feature.title}
                        </h2>
                        <p>{feature.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                onClick={() => handleVote(feature.id)}
                            >
                                Upvote
                            </button>
                            <span>{feature.votes} votes</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
