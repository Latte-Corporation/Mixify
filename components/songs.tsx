"use client";

import { useQuery, useQueryClient } from "react-query";
import { Song } from "../app/(resources)/shared/song";
import { SongItem } from "./song-component";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export function Songs({ query }: { query: string }) {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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
      <div className="flex flex-col items-start w-10/12 h-full">
        <div className="flex flex-col w-full">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton
              key={index}
              className="flex flex-col items-center px-5 gap-2 w-10/12 h-20 py-4 rounded-xl my-3"
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div className="flex flex-col items-start w-full h-full">
      <div className="flex flex-col items-center w-full">
        {data?.map((song: Song) => (
          <SongItem
            key={song.id}
            {...song}
            handleSubmit={handleSubmit}
            status={song.status}
            isFetching={isFetching}
            place={song.place}
          />
        ))}
      </div>
    </div>
  );
}
