'use client'
import { useTranslations } from "next-intl";
import { PendingSongs } from "@/components/pending-component";
import { QueueSongs } from "@/components/queue-component";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  async function handleReset() {
    await axios.post(`${backendUrl}/songs/reset`);
  }

  return (
    <div className="m-6 flex flex-col h-full">
      <h1 className="text-4xl font-bold text-center sm:text-left mb-8">
        {t("title")}
      </h1>
      <div className="flex flex-row w-full justify-end items-start">
        <Button className="text-center sm:text-left mb-8 mr-10" variant="outline" onClick={handleReset}>{t("reset")}</Button>
      </div>
      <div className="flex flex-row w-full justify-center items-start h-full gap-10">
        <PendingSongs className="flex flex-col" />
        <hr className="xl:flex border-r-2 border-gray h-full hidden" />
        <QueueSongs className="hidden xl:flex flex-col" />
      </div>
    </div>
  );
}
