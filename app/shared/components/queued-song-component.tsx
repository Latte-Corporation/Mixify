import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl';

interface SongItemProps {
    id: string;
    title: string;
    artists: string;
    time: string | undefined;
    handleDel: (id: string) => void;
}

export function QueuedSongItem({id, title, artists, time, handleDel}: SongItemProps) {
    const t = useTranslations('button');
    return (
        <li key={id} className='flex flex-row items-center px-5 h-[100px] w-[300px] lg:w-[600px] rounded-xl my-4 border hover:border-black justify-between'>
            <div className='flex flex-col pr-5'>
                <p className='font-bold'>{title}</p>
                <p className='text-gray-500'>{artists}</p>
            </div>
            <div className='flex items-center gap-2'>
                <p className='hidden lg:block text-gray-400 text-sm px-2'>{time && new Date(time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                <Button onClick={() => handleDel(id)}>{t('delete')}</Button>
            </div>
        </li>
    )
}