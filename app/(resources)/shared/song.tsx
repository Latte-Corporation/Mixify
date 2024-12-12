export interface Song {
    id: string;
    title: string;
    artists: string;
    link: string;
    genre?: string;
    albumCover?: string;
    status?: string;
    submittedAt?: string;
    place?: number;
    bpm?: number;
}