import { useState } from "react";

export const useDeleteProject = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteProject = async (projectId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/projects/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: projectId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete project");
            }

            return { success: true };
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            return { success: false, error: err };
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteProject, isLoading, error };
};
