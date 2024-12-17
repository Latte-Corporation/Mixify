'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEnvContext } from "next-runtime-env";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [error, setError] = useState<string | null>(null);
  const { NEXT_PUBLIC_BACKEND_URL: backendUrl } = useEnvContext();
  const { locale } = useParams();
  const router = useRouter();
  const t = useTranslations("login");

  async function handleSubmit() {
      const password = document.getElementById("password") as HTMLInputElement;
      try {
        await axios.post(
          `${backendUrl}/auth/login`,
          {
            password: password.value,
          },
          {
            withCredentials: true,
          }
        );
        router.push(`/${locale}/dashboard`);
      } catch {
        setError("Invalid password");
      }
    }

  function handleKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onKeyDown={handleKeyDown}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">{t("password")}</Label>
                <Input id="password" type="password" placeholder="password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit}>{t("submit")}</Button>
          {error && <p className="text-red-500">{error}</p>}
        </CardFooter>
      </Card>
    </div>
  )
}