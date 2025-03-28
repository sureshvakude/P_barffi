import { useMutation } from "@tanstack/react-query";

const createProject = async (initialData: any) => {
  try {
    const response = await fetch("/api/projects/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: initialData.name || "Untitled Project",
        json: initialData.json || "",
        width: initialData.width || 900,
        height: initialData.height || 1200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create project");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("An error occurred while creating the project. Please try again.");
  }
};

// ✅ Now useCreateProject is correctly defined
export const useCreateProject = () => {
  return useMutation({
    mutationFn: (initialData: any) => createProject(initialData), // Correct way
  });
};
