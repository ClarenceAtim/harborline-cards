import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-20 text-center">
      <h1 className="font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-ink-soft">That page or product doesn&apos;t exist.</p>
      <Link href="/shop" className="btn-primary mt-6">Browse the shop</Link>
    </div>
  );
}
