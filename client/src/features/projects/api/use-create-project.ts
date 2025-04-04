import { useMutation } from "@tanstack/react-query";

export type CreateProjectRequest = {
  name?: string;
  json?: string;
  width?: number;
  height?: number;
  isPro?: boolean;
  prize?: number | null;
  isTemplate?: boolean;
};

export type CreateProjectResponse = {
  projectId: number;
  message: string;
};

const createProject = async (initialData: CreateProjectRequest): Promise<CreateProjectResponse> => {
  try {
    const response = await fetch("/api/projects/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: initialData?.name?.trim() || "Untitled Project",
        json: initialData?.json ?? "",
        width: initialData?.width ?? 900,
        height: initialData?.height ?? 1200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create project: ${errorText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error(error.message || "An error occurred while creating the project. Please try again.");
  }
};

// ✅ Corrected useMutation usage
export const useCreateProject = () => {
  return useMutation<CreateProjectResponse, Error, CreateProjectRequest>({
    mutationFn: createProject,
  });
};
