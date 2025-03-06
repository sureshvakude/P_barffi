import { useMutation, useQueryClient } from "@tanstack/react-query";

const createProject = async (projectData: { name: string; description?: string }) => {
    const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Ensures authentication cookies are sent
        body: JSON.stringify(projectData),
    });

    if (!response.ok) {
        throw new Error("Failed to create project");
    }

    return response.json();
};

// Hook to create a project
export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: (data) => {
            // Optimistically update the UI by invalidating the userProjects query
            queryClient.invalidateQueries({ queryKey: ["userProjects"] });

            // Optional: Redirect user or show success message
        },
        onError: (error) => {
            console.error("Error creating project:", error);
        },
    });
};
