"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      // Handle errors
      console.error(result.error);
    } else {
      // Redirect based on user role
      router.push("/dashboard");
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
      <Input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 bg-background text-foreground"
      />
      <Input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 bg-background text-foreground"
      />
      <Button type="submit" className="w-full cyberpunk-button">
        Giriş Yap
      </Button>
    </form>
  );
}
