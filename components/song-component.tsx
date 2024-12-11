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
}

export function SongItem({
  id,
  title,
  artists,
  handleSubmit,
  status,
  isFetching,
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
    handleSubmit(id);
  }

  return (
    <li
      key={id}
      className="flex flex-row items-center px-5 h-[100px] w-[300px] rounded-xl my-4 border hover:border-black justify-between"
    >
      <div className="flex flex-col pr-4">
        <p className="font-bold text-sm">{title}</p>
        <p className="text-gray-500 text-sm">{artists}</p>
      </div>
      {isLoading ? (
        <Button disabled>
          <LoaderSpinner className="w-4" />
          {t("loading")}
        </Button>
      ) : status === "unknown" ? (
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
    </li>
  );
}
