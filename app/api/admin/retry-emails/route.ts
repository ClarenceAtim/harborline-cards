import { NextResponse } from "next/server";
import { listUnnotified, setEmailStatus } from "@/lib/orders";
import { sendSellerEmail, sendCustomerEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/retry-emails with header "Authorization: Bearer <ADMIN_TOKEN>"
// Re-sends any seller/customer emails whose status is not "sent" (failed, skipped or pending).
export async function POST(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  const auth = req.headers.get("authorization") ?? "";
  if (!token || token.length < 16 || auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await listUnnotified();
  const results: { orderNumber: string; seller: string; customer: string }[] = [];

  for (const o of orders) {
    const patch: { seller_email_status?: string; customer_email_status?: string; email_error?: string | null } = {};
    const errors: string[] = [];
    let seller = o.sellerStatus;
    let customer = o.customerStatus;

    if (seller !== "sent") {
      const r = await sendSellerEmail(o);
      seller = r.ok ? "sent" : r.skipped ? "skipped" : "failed";
      patch.seller_email_status = seller;
      if (r.error) errors.push(`seller: ${r.error}`);
    }
    if (customer !== "sent") {
      const r = await sendCustomerEmail(o);
      customer = r.ok ? "sent" : r.skipped ? "skipped" : "failed";
      patch.customer_email_status = customer;
      if (r.error) errors.push(`customer: ${r.error}`);
    }
    patch.email_error = errors.length ? errors.join(" | ") : null;
    await setEmailStatus(o.id, patch);
    results.push({ orderNumber: o.orderNumber, seller, customer });
  }

  return NextResponse.json({ processed: results.length, results });
}
