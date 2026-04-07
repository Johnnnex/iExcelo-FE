import type { Metadata } from "next";
import SponsorStudentAnalytics from "./SponsorStudentAnalytics";

export const metadata: Metadata = {
  title: "iExcelo - Sponsor | Student Analytics",
};

export default async function SponsorStudentAnalyticsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  return <SponsorStudentAnalytics studentId={studentId} />;
}
