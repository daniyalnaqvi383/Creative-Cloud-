"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@creativecloud.agency");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/meetings");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07090e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "var(--font-sans, sans-serif)",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "0.4rem",
            }}
          >
            Creative<span style={{ color: "#f43f5e" }}>Cloud</span>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Admin Portal &bull; Meeting Command Center
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.4)",
              color: "#fb7185",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label
              htmlFor="admin-email"
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#cbd5e1",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@creativecloud.agency"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#cbd5e1",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              Admin Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #f43f5e 0%, #a855f7 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "0.9rem",
              fontWeight: 800,
              fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 20px rgba(244, 63, 94, 0.4)",
              transition: "transform 0.15s ease",
            }}
          >
            {loading ? "Authenticating..." : "Sign In to Admin Portal"}
          </button>
        </form>

        <div
          style={{
            marginTop: "1.75rem",
            padding: "1rem",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            textAlign: "center",
            fontSize: "0.78rem",
            color: "#94a3b8",
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, color: "#cbd5e1", marginBottom: "0.2rem" }}>🔑 Default Admin Access:</div>
          <div>Email: <code style={{ color: "#38bdf8" }}>admin@creativecloud.agency</code></div>
          <div>Password: <code style={{ color: "#34d399" }}>admin12345</code></div>
        </div>
      </div>
    </div>
  );
}
