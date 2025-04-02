"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getSession } from "next-auth/react";
// import { Eye, EyeOff } from "lucide-react"; // ✅ Import icons

export const ContactInfo = () => {
    const [formData, setFormData] = useState<{
        img?: string;
        name: string;
        email: string;
    }>({
        img: "",
        name: "",
        email: "",
    });
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    // const [passwordVisible, setPasswordVisible] = useState(false);

    // Fetch user ID from session
    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            if (session?.user?.id) {
                setUserId(session.user.id);
            }
        };
        fetchSession();
    }, []);

    // Fetch user data when userId is set
    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch user data");
                const data = await response.json();
                setFormData({ ...data, password: "********" });
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const updatedData = { ...formData };
            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error("Failed to update user data");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!userId) return <p>Loading...</p>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                        {formData.img ? (
                            <AvatarImage src={formData.img} />
                        ) : (
                            <AvatarFallback>
                                {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </div>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />

                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </CardContent>
        </Card>
    );
};
