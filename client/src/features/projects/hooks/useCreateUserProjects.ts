import { useMutation, useQueryClient } from "@tanstack/react-query";

const createProject = async (projectData: { name: string; description?: string }) => {
    const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
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
            queryClient.invalidateQueries({ queryKey: ["userProjects"] });
        },
        onError: (error) => {
            console.error("Error creating project:", error);
        },
    });
};
