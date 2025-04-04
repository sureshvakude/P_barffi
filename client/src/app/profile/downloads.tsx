"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

type download = {
    id: string,
    userId: string,
    projectId: string,
    createdAt: string,
    updatedAt: string,
}

// Downloads Component
export const Downloads = () => {
    const [downloads, setDownloads] = useState<download[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();  // Get session data

    useEffect(() => {
        const fetchDownloads = async () => {
            if (!session?.user?.id) {
                setError("User is not authenticated");
                return;
            }

            try {
                // Use dynamic user ID from session for the API call
                const res = await fetch(`/api/downloads/${session.user.id}`);
                if (!res.ok) throw new Error("Failed to fetch downloads");

                const data = await res.json();
                setDownloads(data);
            } catch (err) {
                setError(`Failed to fetch downloads, ${err}`);
            }
        };

        if (session?.user?.id) {
            fetchDownloads();
        }
    }, [session]);  // Re-run when session changes

    return (
        <Card>
            <CardHeader>
                <CardTitle>Downloaded Projects</CardTitle>
            </CardHeader>
            <CardContent>
                {error && <p className="text-red-500">{error}</p>}
                <ul className="space-y-2">
                    {downloads.length > 0 ? (
                        downloads.map((download) => (
                            <li key={download.id} className="flex justify-between items-center">
                                <AsyncProjectDetails projectId={Number(download.projectId)} />
                                <span className="text-gray-500 text-sm">{new Date(download.createdAt).toLocaleDateString()}</span>
                            </li>
                        ))
                    ) : (
                        <p>No downloads available</p>
                    )}
                </ul>
            </CardContent>
        </Card>
    );
};

// Async Project Details Component (Fetches both name and thumbnail)
const AsyncProjectDetails = ({ projectId }: { projectId: number }) => {
    const [projectDetails, setProjectDetails] = useState<{ name: string; canvasJson: string }>({
        name: "",
        canvasJson: "",
    });

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                if (res.ok) {
                    const project = await res.json();
                    setProjectDetails({
                        name: project.name,
                        canvasJson: project.json,
                    });
                }
            } catch {
                setProjectDetails({ name: "Unknown Project", canvasJson: "" });
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    return (
        <div className="flex items-center">
            <span>{projectDetails.name}</span>
        </div>
    );
};