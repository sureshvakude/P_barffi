import { useMutation } from "@tanstack/react-query";

const createProject = async () => {
  try {
    const response = await fetch("/api/projects/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: "Untitled project",
        json: "",
        width: 900,
        height: 1200,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create project");
    }
    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: createProject,
  });
};
