import { useQuery } from "@tanstack/react-query";

const fetchAdminProjects = async () => {
    const response = await fetch("/api/projects/get-admin-templates", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies/session are sent
    });

    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }

    return response.json();
};

// Hook to use in components
export const useAdminProjects = () => {
    return useQuery({
        queryKey: ["adminProjects"],
        queryFn: fetchAdminProjects,
    });
};
