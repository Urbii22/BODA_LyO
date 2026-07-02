import { appConfig } from "../config";

export function generateQrUrl(code: string) {
  return `${appConfig.siteUrl.replace(/\/$/, "")}/mesa/${encodeURIComponent(code)}`;
}
