import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface SongItemProps {
  id: string;
  title: string;
  artists: string;
  handleSubmit: (id: string) => void;
  status: string | undefined;
}

export function SongItem({
  id,
  title,
  artists,
  handleSubmit,
  status,
}: SongItemProps) {
  const t = useTranslations("button");

  return (
    <li
      key={id}
      className="flex flex-row items-center px-5 h-[100px] w-[300px] rounded-xl my-4 border hover:border-black justify-between"
    >
      <div className="flex flex-col pr-4">
        <p className="font-bold text-sm">{title}</p>
        <p className="text-gray-500 text-sm">{artists}</p>
      </div>
      {status === "unknown" ? (
        <Button onClick={() => handleSubmit(id)}>{t("submit")}</Button>
      ) : status === "pending" ? (
        <Button disabled>{t("pending")}</Button>
      ) : status === "queued" ? (
        <Button disabled>{t("queued")}</Button>
      ) : status === "rejected" ? (
        <Button disabled>{t("rejected")}</Button>
      ) : status === "passed" && (
        <Button disabled>{t("passed")}</Button>
      )}
    </li>
  );
}
