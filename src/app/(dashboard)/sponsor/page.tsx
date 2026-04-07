import type { Metadata } from "next";
import SponsorDashboard from "./SponsorDashboard";

export const metadata: Metadata = {
  title: "iExcelo - Sponsor Dashboard",
};

export default function SponsorDashboardPage() {
  return <SponsorDashboard />;
}
