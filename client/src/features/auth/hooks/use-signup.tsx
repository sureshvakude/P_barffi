import { useMutation } from "@tanstack/react-query";

const signUpUser = async (userData: { name: string; email: string; password: string }) => {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
    }

    return response.json();
};

// Hook to handle signup
export const useSignUp = () => {
    return useMutation({
        mutationFn: signUpUser,
        onSuccess: (data) => {
            console.log("User signed up successfully:", data);
            // Redirect or automatically log in the user if needed
        },
        onError: (error) => {
            console.error("Signup error:", error);
        },
    });
};
