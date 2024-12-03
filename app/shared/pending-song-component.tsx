import { Button } from '@/components/ui/button'

interface SongItemProps {
    id: string;
    title: string;
    artists: string;
    handleQueue: (id: string) => void;
}

export function PendingSongItem({id, title, artists, handleQueue}: SongItemProps) {
    return (
        <li key={id} className='flex flex-row items-center px-5 h-[100px] w-[600px] rounded-xl my-4 border hover:border-black justify-between'>
            <div className='flex flex-col pr-5'>
                <p className='font-bold'>{title}</p>
                <p className='text-gray-500'>{artists}</p>
            </div>
            <Button onClick={() => handleQueue(id)}>Add to queue</Button>
        </li>
    )
}