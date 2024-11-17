"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

    return (
        <div>
            <h1 className="text-2xl font-bold">Feature Requests</h1>
            <ul className="space-y-4">
                {features.map((feature) => (
                    <li
                        key={feature.id}
                        className="border p-4 my-2 rounded-lg shadow-sm"
                    >
                        <h2 className="text-lg font-semibold">
                            {feature.title}
                        </h2>
                        <p className="text-muted-foreground">
                            {feature.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <Button onClick={() => handleVote(feature.id)}>
                                Upvote
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
