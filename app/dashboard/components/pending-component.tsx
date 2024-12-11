"use client";
import { useQuery, useQueryClient } from "react-query";
import { Song } from "../../shared/song";
import axios from "axios";
import { PendingSongItem } from "../../shared/components/pending-song-component";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { LoaderSpinner } from "../../shared/components/spinner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function PendingSongs({ className }: { className?: string }) {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const t = useTranslations("dashboard");

  useEffect(() => {
    const eventSource = new EventSource(`${backendUrl}/songs/sse`);

    eventSource.onmessage = () => {
      queryClient.invalidateQueries("pendingSongs");
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient, backendUrl]);

  const { status, data, error } = useQuery<Song[], Error>(
    "pendingSongs",
    async () => {
      const response = await axios.get(`${backendUrl}/songs/pending`);
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      return response.data.map((data: Song) => ({
        id: data.id,
        title:
          data.title.length > 30
            ? data.title.substring(0, 30) + "..."
            : data.title,
        artists:
          data.artists.length > 30
            ? data.artists.substring(0, 30) + "..."
            : data.artists,
        submittedAt: data.submittedAt ?? "now",
        link: data.link,
      }));
    },
    {
      staleTime: 0, // Data is considered stale immediately after fetching
    }
  );

  function handleQueue(id: string) {
    axios.post(`${backendUrl}/songs/approve/` + id).then(() => {
      queryClient.invalidateQueries("pendingSongs");
      queryClient.invalidateQueries("queueSongs");
    });
  }

  function handleReject(id: string) {
    axios.post(`${backendUrl}/songs/reject/` + id).then(() => {
      queryClient.invalidateQueries("pendingSongs");
    });
  }

  if (status === "loading") {
    return (
      <div className={cn("min-w-[600px]", className)}>
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        {Array.from({ length: 20 }).map((_, index) => (
          <Skeleton
            key={index}
            className="px-5 h-[100px] w-[600px] rounded-xl my-4"
          />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={cn("min-w-[300px] lg:min-w-[600px]", className)}>
      <h2 className="text-2xl font-bold">{t("pending-list")}</h2>
        {data?.map((song) => (
          <ul className="h-[100px] 2xl:w-[600px] rounded-xl py-4" key={song.id}>
            <PendingSongItem
              {...song}
              handleQueue={handleQueue}
              handleReject={handleReject}
              time={song.submittedAt}
              link={song.link}
            />
          </ul>
        ))}
      {data?.length === 0 && (
        <div className="flex gap-3 py-4">
          <p>{t("waiting")}</p>
          <LoaderSpinner />
        </div>
      )}
    </div>
  );
}
