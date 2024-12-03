'use client'

import { useQuery } from "react-query";
import { Song } from "../../shared/song";
import { SongItem } from "../song-component";

export function Songs({query} : {query: string}) {

    const { status, data, error } = useQuery<Song[], Error>(['songs', query], async () => {
        const response = await fetch('http://localhost:3000/spotify/search/' + query)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return (await response.json()).map((data: Song) => ({
            id: data.id,
            title: data.title.length > 30 ? data.title.substring(0, 30) + '...' : data.title,
            artists: data.artists.length > 30 ? data.artists.substring(0, 30) + '...' : data.artists,
            inQueue: data.inQueue
        }))

    })

    function handleSubmit(id: number) {
        console.log('submit ' + id)
    }

    if (status === 'loading') {
        return <span>Loading...</span>
    }

    if (status === 'error') {
        return <span>Error: {error?.message}</span>
    }

    // also status === 'success', but "else" logic works, too
    return (
        <div className="flex flex-col items-start w-full h-full">
            <ul className="max-h-40">
                {data?.map((song: Song) => (
                    <SongItem key={song.id} {...song} handleSubmit={handleSubmit} canSelect={song.inQueue !== true}/>
                ))}
            </ul>
        </div>
    )
}