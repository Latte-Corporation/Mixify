import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link";

export default function SubmitPage() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="row-start-1 flex gap-6 items-center justify-center">
                <Input />
                <Button asChild>
                    <Link href="/search"><Search /></Link>
                </Button>
            </header>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                
            </footer>
        </div>
    );
}