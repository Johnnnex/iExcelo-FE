import { Metadata } from "next";
import { NotificationsPage } from "@/components/organisms/NotificationsPage";

export const metadata: Metadata = {
  title: "iExcelo - Student | Notifications",
};

export default function Page() {
  return <NotificationsPage />;
}
