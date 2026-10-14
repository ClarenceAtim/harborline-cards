"use client";

import { useState } from "react";

// File picker that shrinks the chosen photo in the browser (max 1400px, JPEG) so uploads stay small.
// If the browser cannot decode the image, the original file is sent unchanged.
async function shrink(file: File): Promise<File | null> {
  if (!file.type.startsWith("image/")) return null;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  for (const q of [0.85, 0.7, 0.55]) {
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", q));
    if (blob && blob.size < 900_000) return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  }
  return null;
}

export default function PhotoInput({ current }: { current?: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    setBusy(true);
    try {
      const small = await shrink(file);
      if (small) {
        const dt = new DataTransfer();
        dt.items.add(small);
        input.files = dt.files;
        setPreview(URL.createObjectURL(small));
      } else {
        setPreview(URL.createObjectURL(file));
      }
    } catch {
      setPreview(URL.createObjectURL(file));
    } finally {
      setBusy(false);
    }
  }

  const shown = preview ?? current ?? null;

  return (
    <div className="space-y-2">
      {shown && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={shown} alt="Product photo preview" className="h-40 w-40 rounded border border-ink/10 bg-white object-contain p-1" />
      )}
      <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} className="block text-sm" />
      <p className="text-xs text-ink-faint">{busy ? "Preparing photo…" : "Optional. Choose a new photo to replace the current one."}</p>
    </div>
  );
}