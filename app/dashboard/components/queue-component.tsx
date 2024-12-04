"use client";
import { useQuery, useQueryClient } from "react-query";
import { Song } from "../../shared/song";
import axios from "axios";
import { QueuedSongItem } from "../../shared/components/queued-song-component";
import { Skeleton } from "@/components/ui/skeleton";

export function QueueSongs({ className }: { className?: string }) {
  const queryClient = useQueryClient();

  const { status, data, error } = useQuery<Song[], Error>(
    "queueSongs",
    async () => {
      const response = await axios.get("http://localhost:3000/songs/queue");
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
    axios.post("http://localhost:3000/songs/passed/" + id).then(() => {
      queryClient.invalidateQueries("pendingSongs");
      queryClient.invalidateQueries("queueSongs");
    });
  }

  if (status === "loading") {
    return (
      <div className={className}>
        <h2 className="text-2xl font-bold">Queue songs</h2>
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
    <div className={className}>
      <h2 className="text-2xl font-bold">Queue songs</h2>
      <ul className="px-5 h-[100px] 2xl:w-[600px] rounded-xl my-4">
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
