import { redirect } from "next/navigation";

/** Legacy route — email dashboard removed. Use manage secret instead. */
export default function DashboardRedirect() {
  redirect("/manage");
}
