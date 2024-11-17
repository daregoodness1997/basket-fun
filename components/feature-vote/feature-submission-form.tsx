"use client";

import { useState } from "react";
import { Button } from "../ui/button";

export default function AddFeatureForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch("/api/features", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description }),
        });

        setTitle("");
        setDescription("");
        alert("Feature request submitted!");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border p-4 my-2 rounded-lg shadow-sm"
        >
            <h2 className="text-lg font-semibold">Submit a Feature Request</h2>
            <div className="mt-2">
                <label className="block">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
            </div>
            <div className="mt-2">
                <label className="block">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 w-full"
                ></textarea>
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
}
