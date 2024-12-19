"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Geçersiz e-posta veya şifre");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-md p-8 bg-card rounded-lg cyberpunk-border cyberpunk-glow"
    >
      <h2 className="text-2xl font-bold mb-6 cyberpunk-text text-center">
        Giriş Yap
      </h2>

      <div className="space-y-2">
        <Input
          type="email"
          name="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full p-2 bg-background text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          name="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full p-2 bg-background text-foreground"
        />
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <Button type="submit" className="w-full cyberpunk-button">
        Giriş Yap
      </Button>
    </form>
  );
}
