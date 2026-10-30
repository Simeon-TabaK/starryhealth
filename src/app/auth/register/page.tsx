import { redirect } from "next/navigation";

export default function RegisterRedirect() {
  redirect("/auth/signin?mode=register");
}
