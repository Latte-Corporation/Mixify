"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEnvContext } from "next-runtime-env";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useTranslations("homepage");
  const params = useParams<{ locale: string }>();
  const { NEXT_PUBLIC_BACKEND_URL: backendUrl } = useEnvContext();
  const router = useRouter();
  const { locale } = params;

  async function handleSubmit() {
    const passKey = document.getElementById("name") as HTMLInputElement;
    setIsDialogOpen(false);
    try {
      await axios.post(
        `${backendUrl}/`,
        {
          passKey: passKey.value,
        },
        {
          withCredentials: true,
        }
      );
      router.push(`/${locale}/submit`);
    } catch {
      setError("Invalid passkey");
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission reloading the page
      handleSubmit();
    }
  }

  function handleOpenDialog(bool: boolean) {
    const key = Cookies.get("passKey");
    if (key) {
      router.push(`/${locale}/submit`);
    } else {
      setIsDialogOpen(bool);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          {t("title")}
        </h1>
        <p className="text-center sm:text-left">{t("description")}</p>
        <Dialog open={isDialogOpen} onOpenChange={handleOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog(true)}>{t("submit")}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>{t("passkey")}</DialogTitle>
                <DialogDescription>{t("passkey-description")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    {t("passkey")}
                  </Label>
                  <Input
                    id="name"
                    placeholder="31584394"
                    className="col-span-3"
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{t("enter")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {error && <p className="text-red-500">{error}</p>}
      </main>
    </div>
  );
}
