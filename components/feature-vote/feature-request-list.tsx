"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Feature {
    id: string;
    title: string;
    description: string;
    votes: number;
    done: boolean;
}

export default function FeatureRequests() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [votedFeatures, setVotedFeatures] = useState<string[]>([]); // Tracks upvoted features

    useEffect(() => {
        const fetchFeatures = async () => {
            const response = await fetch("/api/features");
            const data = await response.json();
            setFeatures(data);
            setLoading(false);

            // Load voted features from local storage
            const storedVotes = localStorage.getItem("votedFeatures");
            if (storedVotes) {
                setVotedFeatures(JSON.parse(storedVotes));
            }
        };

        fetchFeatures();
    }, []);

    const handleVote = async (featureId: string) => {
        if (votedFeatures.includes(featureId)) {
            alert("You've already voted for this feature.");
            return;
        }

        const response = await fetch("/api/features/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feature_id: featureId }),
        });

        if (!response.ok) {
            alert("Failed to upvote. Please try again.");
            return;
        }

        // Optimistically update votes
        setFeatures((prev) =>
            prev.map((feature) =>
                feature.id === featureId
                    ? { ...feature, votes: feature.votes + 1 }
                    : feature
            )
        );

        // Add feature to local storage tracking
        const updatedVotedFeatures = [...votedFeatures, featureId];
        setVotedFeatures(updatedVotedFeatures);
        localStorage.setItem(
            "votedFeatures",
            JSON.stringify(updatedVotedFeatures)
        );
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">Feature Requests</h1>
                <ul className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <li
                            key={index}
                            className="border p-4 my-2 rounded-lg shadow-sm"
                        >
                            <Skeleton className="h-6 w-1/3 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3 mb-4" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    const sortedFeatures = [...features].sort((a, b) =>
        a.done === b.done ? 0 : a.done ? 1 : -1
    );

    return (
        <div>
            <h1 className="text-2xl font-bold">Feature Requests</h1>
            <ul className="space-y-4">
                {sortedFeatures.map((feature) => (
                    <li
                        key={feature.id}
                        className={`border p-4 my-2 rounded-lg shadow-sm ${
                            feature.done ? "bg-muted text-muted-foreground" : ""
                        }`}
                    >
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            {feature.title}
                            {feature.done && (
                                <Badge variant="secondary">Done</Badge>
                            )}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {feature.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <Button
                                onClick={() => handleVote(feature.id)}
                                disabled={
                                    votedFeatures.includes(feature.id) ||
                                    feature.done
                                } // Disable button if already voted or feature is done
                            >
                                {votedFeatures.includes(feature.id)
                                    ? "Voted"
                                    : "Upvote"}
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {feature.votes} votes
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
