"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

// Downloads Component
export const Downloads = () => {
    const [downloads, setDownloads] = useState<any[]>([]);
    const [projects, setProjects] = useState<Map<number, { name: string; thumbnail: string }>>(new Map());
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
                setError("Failed to fetch downloads");
            }
        };

        if (session?.user?.id) {
            fetchDownloads();
        }
    }, [session]);  // Re-run when session changes

    // Fetch project details by projectId
    const fetchProject = async (projectId: number) => {
        // Check if we already have the project name and thumbnail cached
        if (projects.has(projectId)) {
            return projects.get(projectId);
        }

        try {
            const res = await fetch(`/api/projects/${projectId}`);
            if (!res.ok) throw new Error("Failed to fetch project");

            const project = await res.json();
            const projectName = project.name;  // Assuming project has a 'name' field
            const thumbnail = project.thumbnail;  // Assuming project has a 'thumbnail' field

            // Cache the result in state
            setProjects((prevProjects) => new Map(prevProjects).set(projectId, { name: projectName, thumbnail }));

            return { name: projectName, thumbnail };
        } catch (err) {
            setError("Failed to fetch project");
            return { name: "Unknown Project", thumbnail: "" }; // Fallback name and empty thumbnail
        }
    };

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
                                <AsyncProjectDetails projectId={download.projectId} />
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
    const [projectDetails, setProjectDetails] = useState<{ name: string; thumbnail: string }>({
        name: "",
        thumbnail: "",
    });

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                if (res.ok) {
                    const project = await res.json();
                    setProjectDetails({
                        name: project.name,
                        thumbnail: project.thumbnail,
                    });
                }
            } catch (error) {
                setProjectDetails({ name: "Unknown Project", thumbnail: "" });
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    return (
        <div className="flex items-center">
            {projectDetails.thumbnail && (
                <img
                    src={projectDetails.thumbnail}
                    alt={projectDetails.name}
                    className="w-12 h-12 mr-2 object-cover rounded"
                />
            )}
            <span>{projectDetails.name}</span>
        </div>
    );
};
