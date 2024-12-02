'use client'

import { useQuery } from "react-query";
import { Song } from "../../shared/song";

export function Songs({id} : {id: number}) {

    const { status, data, error } = useQuery<Song[], Error>(['songs', id], async () => {
        const response = await fetch('/api/songs/' + id)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    })

    if (status === 'loading') {
        return <span>Loading...</span>
    }

    if (status === 'error') {
        return <span>Error: {error?.message}</span>
    }

    // also status === 'success', but "else" logic works, too
    return (
    <ul>
        {data?.map((song: Song) => (
            <li key={song.id}>{song.title}</li>
        ))}
    </ul>
    )
}