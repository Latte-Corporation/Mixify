"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEnvContext } from "next-runtime-env";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Song } from "../app/(resources)/shared/song";
import { PendingSongItem } from "./pending-song-component";
import { LoaderSpinner } from "./spinner";

export function PendingSongs({ className }: { className?: string }) {
  const queryClient = useQueryClient();
  const { NEXT_PUBLIC_BACKEND_URL: backendUrl } = useEnvContext();
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
      <div
        className={cn("w-11/12 lg:w-[600px] flex flex-col h-full", className)}
      >
        <h2 className="text-2xl font-bold pb-3">{t("pending-list")}</h2>
        {Array.from({ length: 20 }).map((_, index) => (
          <Skeleton
            key={index}
            className="flex flex-col items-center px-5 gap-2 w-full py-10 rounded-xl my-3"
          />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={cn("w-11/12 lg:w-[600px] flex flex-col h-full", className)}>
      <h2 className="text-2xl font-bold pb-3">{t("pending-list")}</h2>
      {data?.map((song) => (
        <PendingSongItem
          key={song.id}
          {...song}
          handleQueue={handleQueue}
          handleReject={handleReject}
          time={song.submittedAt}
          link={song.link}
        />
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
