import { appConfig } from "../config";
import { displayGroupCode } from "./group-labels";

export function generateQrUrl(code: string) {
  return `${appConfig.siteUrl.replace(/\/$/, "")}/grupo/${encodeURIComponent(displayGroupCode(code))}`;
}
