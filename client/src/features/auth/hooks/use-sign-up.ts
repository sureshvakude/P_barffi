import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

// Infer response and request types from the API client
type ResponseType = InferResponseType<typeof client.api.users["$post"]>;
type RequestType = InferRequestType<typeof client.api.users["$post"]>["json"];

export const useSignUp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.users.$post({ json });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("User created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  return mutation;
};
