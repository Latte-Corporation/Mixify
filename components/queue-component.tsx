"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEnvContext } from "next-runtime-env";
import { useQuery, useQueryClient } from "react-query";
import { Song } from "../app/(resources)/shared/song";
import { QueuedSongItem } from "./queued-song-component";

export function QueueSongs({ className }: { className?: string }) {
  const queryClient = useQueryClient();
  const { NEXT_PUBLIC_BACKEND_URL: backendUrl } = useEnvContext();
  const t = useTranslations("dashboard");

  const { status, data } = useQuery<Song[], Error>("queueSongs", async () => {
    const response = await axios.get(`${backendUrl}/songs/queue`);
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    return response.data.map((data: Song) => ({
      id: data.id,
      title:
        data.title.length > 50
          ? data.title.substring(0, 50) + "..."
          : data.title,
      artists:
        data.artists.length > 50
          ? data.artists.substring(0, 50) + "..."
          : data.artists,
      submittedAt: data.submittedAt ?? "now",
    }));
  });

  function handleDel(id: string) {
    axios.post(`${backendUrl}/songs/passed/` + id).then(() => {
      queryClient.invalidateQueries("pendingSongs");
      queryClient.invalidateQueries("queueSongs");
    });
  }

  if (status === "loading") {
    return (
      <div className={cn("w-[600px]", className)}>
        <h2 className="text-2xl font-bold pb-3">{t("queued-list")}</h2>
        {Array.from({ length: 20 }).map((_, index) => (
          <Skeleton
            key={index}
            className="flex flex-col items-center px-5 gap-2 w-full py-10 rounded-xl my-3"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("min-w-[300px] lg:min-w-[600px]", className)}>
      <h2 className="text-2xl font-bold pb-3">{t("queued-list")}</h2>
      {data?.map((song: Song) => (
        <QueuedSongItem
          key={song.id}
          {...song}
          handleDel={handleDel}
          time={song.submittedAt}
        />
      ))}
    </div>
  );
}
