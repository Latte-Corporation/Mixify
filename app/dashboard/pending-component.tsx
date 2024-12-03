'use client'
import { useQuery, useQueryClient } from "react-query";
import { Song } from "../shared/song";
import axios from "axios";
import { PendingSongItem } from "../shared/pending-song-component";

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
      }));
    }
  );

  function handleQueue(id: string) {
    axios.post("http://localhost:3000/songs/submit/" + id).then(() => {
      queryClient.invalidateQueries("pendingSongs");
    });
  }
  
  return (
    <div className="flex flex-col items-start w-full h-full">
      <h2 className="text-2xl font-bold">Pending songs</h2>
      <ul className="max-h-40">
        {data?.map((song: Song) => (
          <PendingSongItem
            key={song.id}
            {...song}
            handleQueue={handleQueue}
          />
        ))}
      </ul>
    </div>
  );
}