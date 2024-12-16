"use client";

import { Songs } from "@/components/songs";
import { Button } from "@/components/ui/button";
import Confetti, { ConfettiRef } from "@/components/ui/confetti";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";
import { useEnvContext } from "next-runtime-env";
import Cookies from "js-cookie";

export default function SubmitPage() {
  const [search, setSearch] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [progress, setProgress] = useState<number>(600);
  const [queueNumber, setQueueNumber] = useState<number>(0);
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<boolean>(false);
  const confettiRef = useRef<ConfettiRef>(null);
  const [passKey, setPassKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    const key = Cookies.get("passKey");
    setPassKey(key);
  }, []);

  const t = useTranslations("submit-page");
  const { NEXT_PUBLIC_BACKEND_URL: backendUrl } = useEnvContext();

  useEffect(() => {
    const savedTimestamp = localStorage.getItem("progressTimestamp");
    if (savedTimestamp) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(savedTimestamp, 10)) / 1000);
      setProgress(Math.min(elapsedSeconds, 600));
    }
  }, []);

  useEffect(() => {
    if(!passKey) return;
    const eventSource = new EventSource(`${backendUrl}/songs/events/` + passKey, {withCredentials:true});

    eventSource.onmessage = (data) => {
      const parsedData = JSON.parse(data.data);
      setQueueNumber(parsedData.queueNumber);
      setDialogOpened(true);
      setConfetti(true);
      setTimeout(() => {
        setConfetti(false);
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [backendUrl, passKey]);

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
    if (typeof window !== "undefined") {
      const timestamp = Date.now();
      localStorage.setItem("progressTimestamp", timestamp.toString());
      setProgress(0);
    }
  }

  function secondsToText(seconds: number) {
    const remainingSeconds = 600 - seconds;
    const minutes = Math.floor(remainingSeconds / 60);
    const onlySeconds = remainingSeconds % 60;
    return `${minutes}m ${onlySeconds}s`;
  }

  const confettiMemo = useMemo(() => (
    confetti &&
    <Confetti
      ref={confettiRef}
      className="absolute left-0 top-0 z-[51] size-full"
      options={{
        origin: { y: 1 },
      }}
    />
  ), [confetti]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      {confettiMemo}
      
      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogContent className="w-10/12 rounded-lg z-50">
          <DialogHeader>
            <DialogTitle>{t("accepted")}</DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-5">
              <Image 
                src="/validate.gif"
                alt="validate"
                width={100}
                height={100}
                className="pt-5"
              />
              {t("accepted-description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col justify-center gap-2">
            <p className="text-sm">{t("waiting-time")}: <b>{queueNumber}mins</b></p>
            <Button type="submit" onClick={()=>setDialogOpened(false)}>Ok</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-center h-24 w-full fixed top-0 bg-white z-10">
          <div className="row-start-1 flex items-center justify-center fixed top-7 flex-row-reverse z-20 w-10/12">
              <Input className="peer rounded-l-none" onChange={handleInputChange} />
              <div className="peer-focus-within:ring-1 peer-focus-within:ring-ring bg-black h-[36px] text-white px-5 flex items-center rounded-l-md">
                  {t("search")}:
              </div>
          </div>
      </div>
      <div className="flex flex-col row-start-2 items-center h-full w-full">
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
