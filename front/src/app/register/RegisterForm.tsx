"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormValues,
} from "@/lib/validation/authSchema";
import { useRouter } from "next/navigation";

export interface Role {
  id: number;
  name: string;
}
interface Props {
  roles: Role[];
}

export default function RegisterForm({ roles }: Props) {
  const router = useRouter();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
          role: +data.role,
        }),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        setApiError(result.error);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setApiError(err || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {apiError && (
          <p className="text-red-500 mb-4 text-center">{apiError}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              {...register("username")}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              {...register("role")}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition disabled:opacity-50"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
