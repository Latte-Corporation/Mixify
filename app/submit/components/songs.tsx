"use client";

import { useQuery, useQueryClient } from "react-query";
import { Song } from "../../shared/song";
import { SongItem } from "../../shared/components/song-component";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export function Songs({ query }: { query: string }) {
  const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { status, data, error } = useQuery<Song[], Error>(
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
          data.artists.length > 40
            ? data.artists.substring(0, 40) + "..."
            : data.artists,
        status: data.status,
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
      <div className="flex flex-col items-start w-full h-full">
        {Array.from({ length: 20 }).map((_, index) => (
          <Skeleton
            key={index}
            className="px-5 h-[100px] w-[300px] rounded-xl my-4"
          />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div className="flex flex-col items-start w-full h-full">
      <ul>
        {data?.map((song: Song) => (
          <SongItem
            key={song.id}
            {...song}
            handleSubmit={handleSubmit}
            status={song.status}
          />
        ))}
      </ul>
    </div>
  );
}
