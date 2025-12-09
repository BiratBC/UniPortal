'use client';
import { Button } from "@/components/forms/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/forms/card"
import { Input } from "@/components/forms/input";
import { Label } from "@/components/forms/label";
import { LoginButtonGoogle } from "@/components/forms/SignUpButtonGoogle";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("student");
  const handleSubmit = () => {};

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Login as</Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={userType === "student"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span>Student</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="teacher"
                  checked={userType === "teacher"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span>Teacher</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={userType === "student" ? "you@student.ku.edu.np" : "you@teacher.ku.edu.np"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="space-y-3">
            <LoginButtonGoogle />
          </div>
        </form>
      </CardContent>

      <div className="mt-4 space-y-2 text-center text-sm">
        <Link href="/forgot-password" className="text-primary hover:underline">
          Forgot your password?
        </Link>
        <div>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </Card>
  );
}