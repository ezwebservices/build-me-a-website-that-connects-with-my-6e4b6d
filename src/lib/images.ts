import { uploadData, getUrl, remove } from "aws-amplify/storage";

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `product-images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}.${ext}`;
  const op = uploadData({
    path: key,
    data: file,
    options: { contentType: file.type || "application/octet-stream" },
  });
  await op.result;
  return key;
}

export async function resolveImageUrl(key: string): Promise<string> {
  if (!key) return "";
  if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("data:")) {
    return key;
  }
  try {
    const { url } = await getUrl({ path: key, options: { expiresIn: 3600 } });
    return url.toString();
  } catch {
    return "";
  }
}

export async function deleteProductImage(key: string): Promise<void> {
  if (!key || key.startsWith("http")) return;
  try {
    await remove({ path: key });
  } catch {
    /* ignore */
  }
}
