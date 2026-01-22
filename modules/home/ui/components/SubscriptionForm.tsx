"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2Icon, Mail} from 'lucide-react';
import { useEffect, useState } from "react";

const SubscriptionForm = () => {

    const [subscriptionEmail, setSubscriptionEmail] = useState("");
    const [isUserSubscribed, setIsUserSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(""); 

    useEffect(() => {
        const savedEmail = localStorage.getItem("user_email");
        if (savedEmail) {
            setSubscriptionEmail(savedEmail);
            setIsUserSubscribed(true);
        }
    }, []);

    const subscribeUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: subscriptionEmail }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("user_email", subscriptionEmail);
                setIsUserSubscribed(true);
            } else {
                setError(data.error || "Failed to send subscription email");
            }
        } catch (err) {
            setError("Failed to subscribe. Please try again.");
            console.error("Subscription error:", err);
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="space-y-3 mt-12">
        <h1 className="text-2xl font-bold">Tägliche Stock Updates erhalten</h1>
        <p>Abonnieren Sie, um die Top-Performer in Ihrem Posteingang zu erhalten.</p>
        {/* INPUT */}
        {isUserSubscribed ? (
            <div className="flex gap-2 items-center text-green-500">
                <CheckCircle2Icon className="w-5 h-5"/>
                <p>Subscribed: {subscriptionEmail}</p>
            </div>
        ) : (
            <div>
                <form
                    onSubmit={subscribeUser}
                    className="flex items-center gap-2 max-w-lg">
                    <Input
                        required
                        type="email"
                        value={subscriptionEmail}
                        onChange={(e) => setSubscriptionEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 text-lg"
                        disabled={isLoading}
                    />
                    <Button type="submit" className="cursor-pointer" disabled={isLoading}>
                        <Mail className="w-4 h-4 mr-2"/>
                        {isLoading ? "Sending..." : "Subscribe"}
                    </Button>
                </form>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        )}
    </div>
  )
}

export default SubscriptionForm