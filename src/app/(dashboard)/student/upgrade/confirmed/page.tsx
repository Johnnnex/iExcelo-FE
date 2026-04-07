import { Metadata } from "next";
import SubscriptionConfirmed from "./SubscriptionConfirmed";

export const metadata: Metadata = {
  title: "iExcelo - Subscription Confirmed",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    session_id?: string;
    reference?: string;
  }>;
}

export default async function ConfirmedPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <SubscriptionConfirmed
      sessionId={params.session_id}
      reference={params.reference}
    />
  );
}
