import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { store } from "@/lib/store";
import { getAppUrl } from "@/lib/config";
import { PublicPayClient } from "./PublicPayClient";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const page = await store.getPageByUsername(username);
  if (!page || !page.isPublished) {
    return { title: "Page not found" };
  }
  const title = `${page.displayName} | ZecPay`;
  const description = `Send a private Zcash payment to ${page.displayName}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${getAppUrl()}/${page.username}`,
    },
  };
}

export default async function PublicPage({ params }: Props) {
  const { username } = await params;
  if (username === "favicon.ico") notFound();
  const page = await store.getPageByUsername(username);
  if (!page || !page.isPublished) notFound();

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center gap-2">
          <span className="text-accent font-mono">Ƶ</span>
          <span className="text-sm text-muted">ZecPay</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg px-4 py-10">
        <PublicPayClient
          displayName={page.displayName}
          username={page.username}
          bio={page.bio}
          avatarUrl={page.avatarUrl}
          zcashAddress={page.zcashAddress}
          paymentButtons={page.paymentButtons}
        />
      </main>
    </div>
  );
}
