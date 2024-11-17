"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AddFeatureForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/features", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit feature request.");
            }

            setTitle("");
            setDescription("");

            toast({
                title: "Success",
                description: "Your feature request has been submitted.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border p-6 my-4 rounded-lg shadow-sm space-y-4"
        >
            <h2 className="text-lg font-semibold">Submit a Feature Request</h2>
            <div>
                <label htmlFor="title" className="block text-sm font-medium">
                    Title
                </label>
                <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter the feature title"
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium"
                >
                    Description
                </label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e: any) => setDescription(e.target.value)}
                    placeholder="Provide a brief description"
                    className="mt-1"
                />
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
}
