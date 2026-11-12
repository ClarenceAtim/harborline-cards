import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import { categoryPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return categoryPageMetadata("basketball");
}

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function BasketballPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page, 10) || 1 : 1;
  return <CategoryPage slug="basketball" page={page} />;
}
