
'use client';
import { Button } from "@/components/forms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/forms/card"
import { Input } from "@/components/forms/input";
import { Label } from "@/components/forms/label";
import Link from "next/link";

import {useState} from "react";

 export default function ForgotPasswordPage() {
  
  const [email, setEmail] = useState("");
  

  const [error, setError] = useState("");
  const [success, setSuccess]=useState(false);
  const [loading, setLoading] = useState(false);
    const handleSubmit = () => {};
  return (
    
      <Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Forgot Password</CardTitle>
    <CardDescription>Enter your email to receive a password rest link</CardDescription>
    
  </CardHeader>
  <CardContent>
    <form onSubmit={handleSubmit} className="space-y-4">
            
              
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/login">Back to Login</Link>
              </Button>
          </form>
  </CardContent>
</Card>
   
  )
}


