"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Song } from "../app/(resources)/shared/song";
import { SkeletonSubmit } from "./skeleton-submit-song";
import { SongItem } from "./song-component";

export function Songs({ 
  query,
  inCooldown,
  setInCooldown
}: { 
  query: string 
  inCooldown: boolean
  setInCooldown: () => void
}) {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const t = useTranslations("submit-page");

  useEffect(() => {
    const eventSource = new EventSource(`${backendUrl}/songs/status`);

    eventSource.onmessage = () => {
      queryClient.invalidateQueries(["songs", query]);
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient, backendUrl, query]);

  const { status, data, error, isFetching } = useQuery<Song[], Error>(
    ["songs", query],
    async () => {
      if (!query) return [];
      const response = await axios.get(`${backendUrl}/spotify/search/` + query);
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      return response.data.map((data: Song) => ({
        id: data.id,
        title:
          data.title.length > 40
            ? data.title.substring(0, 40) + "..."
            : data.title,
        artists:
          data.artists.length > 20
            ? data.artists.substring(0, 20) + "..."
            : data.artists,
        status: data.status,
        place: data.place,
      }));
    },
    {
      enabled: !!query, // Only run the query if the query string is not empty
    }
  );

  async function handleSubmit(id: string) {
    try {
      const response = await axios.post(`${backendUrl}/songs/submit/` + id);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Network response was not ok");
      }
      await queryClient.invalidateQueries(["songs", query]);
    } catch (error) {
      console.error("Error submitting song:", error);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col w-10/12 h-full">
        <div className="flex flex-col w-full pt-24">
          {Array.from({ length: 20 }).map((_, index) => (
            <SkeletonSubmit key={index} className="flex items-center px-5 gap-2 w-full h-fit py-4 rounded-xl my-3"/>
            // <Skeleton
            //   key={index}
            //   className="flex flex-col items-center px-5 gap-2 w-full h-20 py-4 rounded-xl my-3"
            // />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      {
        !data &&
        <div className="flex flex-col w-3/5">
          <span>
            <b>{t("no-song")}</b>
          </span>
          <span>
            {t("search-for-song")}
          </span>
        </div>
      }
      {
        !!data && data.length !== 0 && 
        <div className="flex flex-col items-center w-full pt-24">
          {data?.map((song: Song) => (
            <SongItem
              key={song.id}
              {...song}
              handleSubmit={handleSubmit}
              status={song.status}
              isFetching={isFetching}
              place={song.place}
              inCooldown={inCooldown}
              setInCooldown={setInCooldown}
            />
          ))}
        </div>
      }
    </div>
  );
}
