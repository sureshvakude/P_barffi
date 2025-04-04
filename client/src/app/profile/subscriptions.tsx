"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Subscription Component
export const Subscription = () => {
    // const [subscription, setSubscription] = useState({
    //     plan: "Pro",
    //     price: "$29.99/month",
    //     status: "Active",
    //     renewalDate: "2024-06-01"
    // });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {/* <p><strong>Plan:</strong> {subscription.plan}</p>
                <p><strong>Price:</strong> {subscription.price}</p>
                <p><strong>Status:</strong> {subscription.status}</p>
                <p><strong>Renewal Date:</strong> {subscription.renewalDate}</p> */}
                <p>
                    Under construction. Please check back later for subscription details.
                </p>
                <Button disabled>Manage Subscription</Button>
            </CardContent>
        </Card>
    );
};