export interface Song {
    id: string;
    title: string;
    artists: string;
    genre?: string;
    albumCover?: string;
    inQueue?: boolean;
    submittedAt?: string;
}