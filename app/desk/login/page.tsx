import { redirect } from "next/navigation";

export default function LegacyDeskLoginPage() {
  redirect("/guard/provider");
}
