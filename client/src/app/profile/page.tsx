"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ContactInfo } from "./contact";
import { Downloads } from "./downloads";
import { Subscription } from "./subscriptions";

export default function Profile() {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
                <h1 className="text-2xl font-bold">Welcome to the Barffi👋</h1>
                <p className="text-gray-500 text-lg">
                    This is a profile page. You can add your profile information
                    here.
                </p>
                <ContactInfo/>
                <Downloads/>
                <Subscription/>
            </div>
        </QueryClientProvider>
    );
}