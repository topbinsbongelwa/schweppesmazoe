import ShopPage, { CATEGORY_BY_SLUG } from "../page";

export function generateStaticParams() {
  return Object.keys(CATEGORY_BY_SLUG).map((category) => ({ category }));
}

export default async function CategoryShopPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <ShopPage initialCategory={CATEGORY_BY_SLUG[category] || "All"} />;
}