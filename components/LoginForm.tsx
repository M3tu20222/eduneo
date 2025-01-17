"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("SignIn result:", result); // Debug için

      if (result?.error) {
        setError("Geçersiz e-posta veya şifre");
        console.error("Login error:", result.error); // Debug için
      } else {
        // Başarılı giriş sonrası rol kontrolü için session'ı yeniden al
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        console.log("Session data:", session); // Debug için

        if (session?.user?.role === "admin") {
          router.push("/admin");
        } else if (session?.user?.role === "teacher") {
          router.push("/teacher");
        } else if (session?.user?.role === "student") {
          router.push("/student/dashboard"); // Updated to redirect to student dashboard
        } else {
          router.push("/dashboard");
        }

        // Sayfayı yenile
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error); // Debug için
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <Button
        type="submit"
        className="w-full cyberpunk-button"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Giriş yapılıyor...
          </>
        ) : (
          "Giriş Yap"
        )}
      </Button>
    </form>
  );
}
