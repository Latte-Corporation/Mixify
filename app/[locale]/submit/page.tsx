"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Songs } from "@/components/songs";
import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";

export default function SubmitPage() {
  const [search, setSearch] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [progress, setProgress] = useState<number>(() => {
    const savedTimestamp = localStorage.getItem("progressTimestamp");
    if (savedTimestamp) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(savedTimestamp, 10)) / 1000);
      return Math.min(elapsedSeconds, 600);
    }
    return 600;
  });
  const t = useTranslations("submit-page");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        setQuery(search);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((progress) => {
        const newProgress = progress >= 600 ? 600 : progress + 1;
        return newProgress;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function setInCooldown() {
    const timestamp = Date.now();
    localStorage.setItem("progressTimestamp", timestamp.toString());
    setProgress(0);
  }

  function secondsToText(seconds: number) {
    const remainingSeconds = 600 - seconds;
    const minutes = Math.floor(remainingSeconds / 60);
    const onlySeconds = remainingSeconds % 60;
    return `${minutes}m ${onlySeconds}s`;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="flex justify-center h-24 w-full fixed top-0 bg-white z-10">
          <div className="row-start-1 flex items-center justify-center fixed top-7 flex-row-reverse z-20 w-10/12">
              <Input className="peer" onChange={handleInputChange} />
              <div className="peer-focus-within:ring-1 peer-focus-within:ring-ring bg-black h-[36px] text-white px-5 flex items-center rounded-l-md">
                  {t("search")}:
              </div>
          </div>
      </div>
      <div className="flex flex-col row-start-2 items-center sm:items-start h-full w-full">
        <Songs query={query} inCooldown={progress < 600} setInCooldown={setInCooldown}/>
      </div>
      {
        progress < 600 &&
        <footer className="fixed bottom-0 w-10/12 bg-white h-20 flex flex-col gap-3 items-center justify-start py-4">
          <div className="flex flex-row items-center justify-between w-full">
            <p className="text-sm">{t("cooldown")}</p>
            <p className="text-sm text-gray-400">{secondsToText(progress)}</p>
          </div>
          <Progress value={Math.floor(progress / 6)}/>
        </footer>
      }
    </div>
  );
}
