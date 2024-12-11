"use client";
import { useQuery, useQueryClient } from "react-query";
import { Song } from "../../shared/song";
import axios from "axios";
import { QueuedSongItem } from "../../shared/components/queued-song-component";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function QueueSongs({ className }: { className?: string }) {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const t = useTranslations("dashboard");

  const { status, data } = useQuery<Song[], Error>(
    "queueSongs",
    async () => {
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
    }
  );

  function handleDel(id: string) {
    axios.post(`${backendUrl}/songs/passed/` + id).then(() => {
      queryClient.invalidateQueries("pendingSongs");
      queryClient.invalidateQueries("queueSongs");
    });
  }

  if (status === "loading") {
    return (
      <div className={className}>
        <h2 className="text-2xl font-bold">{t("queued-list")}</h2>
        {Array.from({ length: 20 }).map((_, index) => (
          <Skeleton
            key={index}
            className="px-5 h-[100px] 2xl:w-[600px] rounded-xl my-4"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("min-w-[300px] lg:min-w-[600px]", className)}>
      <h2 className="text-2xl font-bold">{t("queued-list")}</h2>
      <ul className="h-[100px] 2xl:w-[600px] rounded-xl my-4">
        {data?.map((song: Song) => (
          <QueuedSongItem
            key={song.id}
            {...song}
            handleDel={handleDel}
            time={song.submittedAt}
          />
        ))}
      </ul>
    </div>
  );
}
