export interface Song {
    id: number;
    title: string;
    artists: string;
    genre?: string;
    albumCover?: string;
    inQueue?: boolean;
}