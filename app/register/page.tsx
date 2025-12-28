"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/utils/trpcClient";

export default function RegisterPage() {
  const router = useRouter();
  const register = trpc.auth.register.useMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/");
    }
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await register.mutateAsync({ email, password });
      localStorage.setItem("token", res.token);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      <form className="auth-form" onSubmit={submit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          placeholder="Password (min 6 chars)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={register.isPending}>
          Register
        </button>
      </form>

      <div className="auth-link">
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
}
