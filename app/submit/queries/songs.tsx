"use client";

import { useQuery, useQueryClient } from "react-query";
import { Song } from "../../shared/song";
import { SongItem } from "../../shared/song-component";
import axios from "axios";

export function Songs({ query }: { query: string }) {
  const queryClient = useQueryClient();

  const { status, data, error } = useQuery<Song[], Error>(
    ["songs", query],
    async () => {
      if (!query) return [];
      const response = await axios.get(
        "http://localhost:3000/spotify/search/" + query
      );
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
        inQueue: data.inQueue,
      }));
    },
    {
      enabled: !!query, // Only run the query if the query string is not empty
    }
  );

  async function handleSubmit(id: string) {
    try {
      const response = await axios.post(
        "http://localhost:3000/songs/submit/" + id
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Network response was not ok");
      }
      await queryClient.invalidateQueries(["songs", query]);
    } catch (error) {
      console.error("Error submitting song:", error);
    }
  }

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div className="flex flex-col items-start w-full h-full">
      <ul className="max-h-40">
        {data?.map((song: Song) => (
          <SongItem
            key={song.id}
            {...song}
            handleSubmit={handleSubmit}
            canSelect={song.inQueue !== true}
          />
        ))}
      </ul>
    </div>
  );
}
