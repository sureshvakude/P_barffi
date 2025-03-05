import { useQuery } from "@tanstack/react-query";

const fetchUserProjects = async () => {
    const response = await fetch("/api/projects/get-user-templates", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Ensures authentication cookies are sent
    });

    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }

    return response.json();
};

// Hook to fetch projects for the current user
export const useUserProjects = () => {
    return useQuery({
        queryKey: ["userProjects"],
        queryFn: fetchUserProjects,
    });
};
