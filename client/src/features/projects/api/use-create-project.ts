import { useMutation } from "@tanstack/react-query";

const createProject = async () => {
  const response = await fetch("/api/projects/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensures authentication session is included
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: createProject,
  });
};