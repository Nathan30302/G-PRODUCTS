import { redirect } from "next/navigation";

export default function LegacyDeskPage() {
  redirect("/guard/provider");
}
