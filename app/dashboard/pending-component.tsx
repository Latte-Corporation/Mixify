'use client'
import { useQuery, useQueryClient } from "react-query";
import { Song } from "../shared/song";
import axios from "axios";
import { PendingSongItem } from "../shared/pending-song-component";
import { Skeleton } from "@/components/ui/skeleton";

export function PendingSongs() {
  const queryClient = useQueryClient();

  const { status, data, error } = useQuery<Song[], Error>(
    "pendingSongs",
    async () => {
      const response = await axios.get(
        "http://localhost:3000/songs/pending"
      );
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
    },
    {
      staleTime: 0, // Data is considered stale immediately after fetching
    }
  );

  function handleQueue(id: string) {
    axios.post("http://localhost:3000/songs/approve/" + id).then(() => {
      queryClient.invalidateQueries("pendingSongs");
      queryClient.invalidateQueries("queueSongs");
    });
  }

  function handleReject(id: string) {
    axios.post("http://localhost:3000/songs/passed/" + id).then(() => {
      queryClient.invalidateQueries("pendingSongs");
    });
  }

  if (status === "loading") {
    return (
      <div>
        <h2 className="text-2xl font-bold">Pending songs</h2>
        {Array.from({ length: 20 }).map((_, index) => (
          <Skeleton key={index} className="px-5 h-[100px] w-[600px] rounded-xl my-4" />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Pending songs</h2>
      {data?.map((song) => (
        <PendingSongItem key={song.id} {...song} handleQueue={handleQueue} handleReject={handleReject} time={song.submittedAt}/>
      ))}
    </div>
  );
}