"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/utils/trpcClient";

export default function LoginPage() {
  const router = useRouter();
  const login = trpc.auth.login.useMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔁 redirect if already logged in
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
      const res = await login.mutateAsync({ email, password });
      localStorage.setItem("token", res.token);
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form className="auth-form" onSubmit={submit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={login.isPending}>
          Login
        </button>
      </form>

      <div className="auth-link">
        Don&apos;t have an account? <a href="/register">Register</a>
      </div>
    </div>
  );
}
