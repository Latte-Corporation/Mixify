
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SongItemProps {
    id: string;
    link: string;
    title: string;
    artists: string;
    time: string | undefined;
    handleQueue: (id: string) => void;
    handleReject: (id: string) => void;
}

export function PendingSongItem({id, title, artists, time, handleQueue, handleReject}: SongItemProps) {
    const t = useTranslations('button');
    return (
        <div className='flex flex-row items-center px-5 h-[100px] w-full lg:w-[600px] rounded-xl my-4 border hover:border-black justify-between'>
            <div className='flex flex-col pr-5 truncate'>
                <p className='font-bold'>{title}</p>
                <p className='text-gray-500'>{artists}</p>
            </div>
            <div className='flex items-center gap-2 pl-5'>
                <p className='hidden lg:block text-gray-400 text-sm px-2'>{time && new Date(time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                <Button className="hidden lg:block bg-green-600 hover:bg-green-500" onClick={() => handleQueue(id)}>{t('queue')}</Button>
                <Button className="hidden lg:block" variant="destructive" onClick={() => handleReject(id)}>{t('reject')}</Button>
                <Button className="block lg:hidden bg-green-600" onClick={() => handleQueue(id)}><Plus/></Button>
                <Button className="block lg:hidden" variant="destructive" onClick={() => handleReject(id)}><Minus/></Button>
            </div>
        </div>
    )
}