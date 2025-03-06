import { useMutation } from "@tanstack/react-query";

export type UpdateProjectRequest = {
  name?: string;
  width?: number;
  height?: number;
  thumbnail?: string;
  json?: any;
  isPro?: boolean;
  prize?: number;
  isTemplate?: boolean;
};

export type ProjectResponse = {
  id: number;
  name: string;
  width: number;
  height: number;
  thumbnail?: string;
  json: any;
  isPro: boolean;
  prize: number;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
};

const updateProject = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: UpdateProjectRequest;
}): Promise<ProjectResponse> => {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ Keep if using authentication
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return response.json();
};

export const useUpdateProject = (projectId: string) => {
  return useMutation({
    mutationKey: ["project", { id: projectId }], // ✅ Added for tracking status
    mutationFn: (data: UpdateProjectRequest) => updateProject({ projectId, data }),
    onError: (error) => {
      console.error("Failed to update project:", error);
    },
  });
};
