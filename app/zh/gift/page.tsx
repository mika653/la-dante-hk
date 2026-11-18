import { redirect } from "next/navigation";

// 禮物頁面已改為直接前往聯絡我們(按 Giulia 要求)。
export default function Gift() {
  redirect("/zh/contact");
}
