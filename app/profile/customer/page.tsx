import { redirect } from "next/navigation";

export default function LegacyCustomerHomeRedirect() {
  redirect("/profile/account");
}
