import { useQuery } from "@tanstack/react-query";

export type ResponseType = {
  id: number;
  name: string;
  width: number;
  height: number;
  thumbnail?: string;
  json: any; // Adjust based on your actual data structure
  isPro: boolean;
  prize: number;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
};

const fetchProject = async (projectId: string) => {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensure authentication session is included
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
};

export const useGetProject = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId, // Only fetch if projectId exists
  });
};
