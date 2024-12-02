'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Songs } from "./queries/songs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SubmitPage() {
    const [search, setSearch] = useState<string>('')

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                // Fetch or perform your search action here
                console.log("Fetching search results for:", search);
            }
        }, 1000); // Adjust the delay as needed
    
        return () => clearTimeout(delayDebounceFn);
    }, [search]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="row-start-1 flex gap-6 items-center justify-center">
                <Input onChange={handleInputChange}/>
                <Button asChild>
                    <Link href="/search"><Search /></Link>
                </Button>
            </header>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Songs id={1} />
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                
            </footer>
        </div>
    );
}
