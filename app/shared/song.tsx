export interface Song {
    id: string;
    title: string;
    artists: string;
    genre?: string;
    albumCover?: string;
    status?: string;
    submittedAt?: string;
}