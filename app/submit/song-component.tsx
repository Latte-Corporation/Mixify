import { Button } from '@/components/ui/button'

interface SongItemProps {
    id: number;
    title: string;
    artists: string;
    handleSubmit: (id: number) => void;
    canSelect: boolean;
}

export function SongItem({id, title, artists, handleSubmit, canSelect}: SongItemProps) {
    return (
        <li key={id} className='flex flex-row items-center px-5 h-[100px] w-[300px] rounded-xl my-4 border hover:border-black justify-between'>
            <div className='flex flex-col pr-5'>
                <p className='font-bold'>{title}</p>
                <p className='text-gray-500'>{artists}</p>
            </div>
            {canSelect ? <Button onClick={() => handleSubmit(id)}>Submit</Button> : <Button disabled>In queue</Button>}
        </li>
    )
}