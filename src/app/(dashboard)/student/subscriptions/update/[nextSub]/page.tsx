import { Metadata } from "next";
import UpdateSub from "./UpdateSub";

export const metadata: Metadata = {
  title: "iExcelo - Student | Update Subscription",
};

interface PageProps {
  params: Promise<{ nextSub: string }>;
}

export default async function UpdateSubPage({ params }: PageProps) {
  const { nextSub } = await params;
  return <UpdateSub targetPlanId={nextSub} />;
}
