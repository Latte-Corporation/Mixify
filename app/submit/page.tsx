'use client'

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Songs } from "./components/songs";
import { useTranslations } from "next-intl";

export default function SubmitPage() {
    const [search, setSearch] = useState<string>('')
    const [query, setQuery] = useState<string>('')
    const t = useTranslations('submit-page');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                // Fetch or perform your search action here
                setQuery(search)
            }
        }, 1000); // Adjust the delay as needed
    
        return () => clearTimeout(delayDebounceFn);
    }, [search]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="row-start-1 flex items-center justify-center fixed top-7 flex-row-reverse">
                <Input className="peer" onChange={handleInputChange}/>
                <div className="peer-focus-within:ring-1 peer-focus-within:ring-ring bg-black h-[36px] text-white px-5 flex items-center rounded-l-md">{t('search')}:</div>
            </header>
            <main className="flex flex-col row-start-2 items-center sm:items-start h-full">
                <Songs query={query} />
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                
            </footer>
        </div>
    );
}
