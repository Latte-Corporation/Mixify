'use client';
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Home() {
  const t = useTranslations('homepage');
  const params = useParams<{ locale: string }>()

  const { locale } = params;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">{t("title")}</h1>
        <p className="text-center sm:text-left">
          {t("description")}
        </p>
        <Button asChild>
          <Link href={locale + "/submit"}>{t("submit")}</Link>
        </Button>
      </main>
    </div>
  );
}
