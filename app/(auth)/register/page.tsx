'use client';
import { Button } from "@/components/forms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/forms/card"
import { Input } from "@/components/forms/input";
import { Label } from "@/components/forms/label";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("student");

  // Department list matching your homepage
  const departments = [
    "Engineering",
    "Medical Sciences",
    "Business Administration",
    "Arts & Humanities",
    "Natural Sciences",
    "Law",
    "Education",
    "Computer Science"
  ];

  // Generate UUID for both student_id and teacher_id
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Validate email based on user type
  const validateEmail = (email: string, userType: string) => {
    const lowerEmail = email.toLowerCase().trim();
    
    if (userType === "student") {
      return lowerEmail.endsWith("@student.ku.edu.np");
    } else {
      // For teachers, accept both @teacher.ku.edu.np and @ku.edu.np
      // But make sure @student.ku.edu.np is NOT accepted for teachers
      if (lowerEmail.endsWith("@student.ku.edu.np")) {
        return false;
      }
      return lowerEmail.endsWith("@teacher.ku.edu.np") || lowerEmail.endsWith("@ku.edu.np");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    console.log("User Type:", userType);
    console.log("Email:", email);
    console.log("Validation Result:", validateEmail(email, userType));

    // Validate email based on user type
    if (!validateEmail(email, userType)) {
      if (userType === "student") {
        setError("Students must use @student.ku.edu.np email address.");
      } else {
        setError("Teachers must use @teacher.ku.edu.np or @ku.edu.np email address.");
      }
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!department && userType === "student") {
      setError("Please select a department.");
      return;
    }

    setLoading(true);

    try {
      const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/verify`;
      
      // Prepare user metadata based on user type
      const userMetadata: Record<string, any> = {
        role: userType,
        name: name,
      };

      // Add department only for students
      if (userType === "student") {
        userMetadata.department = department;
        userMetadata.student_id = generateUUID();
      } else {
        userMetadata.teacher_id = generateUUID();
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: redirectTo,
        },
      });

      if (signUpError) {
        console.error("Supabase Error:", signUpError);
        setError(signUpError.message || "Signup failed");
        setLoading(false);
        return;
      }

      // Check if user already exists
      if (data?.user?.identities?.length === 0) {
        setError("An account with this email already exists. Please login instead.");
        setLoading(false);
        return;
      }

      setMessage(
        "A verification email has been sent to your university inbox. Please open it and confirm your email to activate your account."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Register as</Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={userType === "student"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                Student
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="teacher"
                  checked={userType === "teacher"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                Teacher
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {userType === "student" && (
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">University Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={
                userType === "student"
                  ? "yourname@student.ku.edu.np"
                  : "yourname@teacher.ku.edu.np or yourname@ku.edu.np"
              }
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
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {message}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}