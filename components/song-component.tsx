import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LoaderSpinner } from "./spinner";
import { useEffect, useState } from "react";

interface SongItemProps {
  id: string;
  title: string;
  artists: string;
  handleSubmit: (id: string) => void;
  status: string | undefined;
  isFetching: boolean;
  place?: number; //place dans la file
  inCooldown: boolean;
  setInCooldown: () => void;
}

export function SongItem({
  id,
  title,
  artists,
  handleSubmit,
  status,
  isFetching,
  place,
  inCooldown,
  setInCooldown,
}: SongItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("button");

  useEffect(() => {
    if (!isFetching) {
      setIsLoading(false);
    }
  }, [isFetching]);

  function handleClick(id: string) {
    setIsLoading(true);
    setInCooldown();
    handleSubmit(id);
  }

  return (
    <div
        key={id}
        className="flex flex-col items-center px-5 gap-2 w-10/12 py-4 rounded-xl my-3 border justify-between"
      >
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-col pr-4">
            <p className="font-bold text-sm">{title}</p>
            <p className="text-gray-500 text-sm">{artists}</p>
          </div>
          {
          isLoading ? (
            <Button disabled>
              <LoaderSpinner className="w-4" />
              {t("loading")}
            </Button>
          ) : !status ? (
            inCooldown ? 
            <Button disabled>
              {t("submit")}
            </Button> :
            <Button onClick={() => handleClick(id)}>{t("submit")}</Button>
          ) : status === "pending" ? (
            <Button disabled className="bg-slate-400">
              {t("pending")}
            </Button>
          ) : status === "queued" ? (
            <Button disabled className="bg-green-600">
              {t("queued")}
            </Button>
          ) : status === "rejected" ? (
            <Button disabled className="bg-red-600">
              {t("rejected")}
            </Button>
          ) : (
            status === "passed" && <Button disabled>{t("passed")}</Button>
          )}
        </div>
        {
          !!place && status === "queued" && (
            <>
              <hr className="w-full border-gray-300" />
              <div className="flex flex-row items-center justify-between w-full">
                <p className="text-xs"><b className="text-sm">{place}{t("th")}</b>{t("inqueue")}</p>
                <p className="text-xs">{t("waiting")}<b className="text-sm">{place}min</b></p>
              </div>
            </>
          )
        }
    </div>
  );
}
