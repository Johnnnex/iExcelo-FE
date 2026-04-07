/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/atoms";
import { Icon } from "@iconify/react";
import { useStudentStore } from "@/store";
import type { ICheckoutPlan } from "@/types";
import { formatDate } from "@/utils";

const currencySymbols: Record<string, string> = {
  NGN: "\u20A6",
  USD: "$",
  GBP: "\u00A3",
  EUR: "\u20AC",
  CAD: "C$",
  AUD: "A$",
};

const currencyToRegion: Record<string, string> = {
  NGN: "NG",
  USD: "US",
  GBP: "GB",
  EUR: "DE",
  CAD: "CA",
  AUD: "AU",
};

function durationLabel(days: number) {
  const months = Math.round(days / 30);
  return months === 1 ? "1 month" : `${months} months`;
}

interface UpdateSubProps {
  targetPlanId: string;
}

function UpdateSubSkeleton() {
  return (
    <section className="min-h-screen flex justify-center items-center">
      <div className="w-235.75 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-lg mb-6" />

        <div className="flex gap-8 mb-8 items-center">
          {/* Current sub skeleton */}
          <div className="rounded-[1rem] flex-1 overflow-hidden border border-gray-200">
            <div className="h-14 bg-gray-200" />
            <div className="p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-5 w-20 bg-gray-100 rounded mb-1" />
              <div className="h-4 w-28 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="h-5 w-28 bg-gray-200 rounded shrink-0" />
          {/* New sub skeleton */}
          <div className="rounded-[1rem] flex-1 overflow-hidden border border-gray-200">
            <div className="h-14 bg-gray-200" />
            <div className="p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-5 w-20 bg-gray-100 rounded mb-1" />
              <div className="h-4 w-28 bg-gray-100 rounded" />
            </div>
          </div>
        </div>

        <div className="h-7 w-40 bg-gray-200 rounded mb-4" />
        <div className="flex flex-col gap-3 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
              <div className="h-4 w-80 bg-gray-100 rounded" />
            </div>
          ))}
        </div>

        <div className="h-7 w-28 bg-gray-200 rounded mb-4" />
        <div className="flex items-center gap-3 w-95">
          <div className="w-11.25 h-11.25 bg-gray-200 rounded" />
          <div className="flex-1">
            <div className="h-5 w-24 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-40 bg-gray-100 rounded" />
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 my-8" />
        <div className="h-4 w-96 bg-gray-100 rounded mb-12.75" />
        <div className="h-11 w-full bg-gray-200 rounded-lg" />
      </div>
    </section>
  );
}

const UpdateSub = ({ targetPlanId }: UpdateSubProps) => {
  const router = useRouter();
  const {
    lastExamTypeId,
    activeSubscription,
    isLoadingSubscription,
    fetchActiveSubscription,
    checkoutInfo,
    isLoadingCheckoutInfo,
    fetchCheckoutInfo,
    cardInfo,
    isLoadingCardInfo,
    fetchCardInfo,
    fetchManageLink,
    upgradeSubscription,
    isUpgrading,
  } = useStudentStore();

  const [targetPlan, setTargetPlan] = useState<ICheckoutPlan | null>(null);
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);

  // Fetch active subscription
  useEffect(() => {
    if (!lastExamTypeId) return;
    fetchActiveSubscription(lastExamTypeId);
  }, [lastExamTypeId]);

  // Fetch checkout info to get target plan details with price
  useEffect(() => {
    if (!lastExamTypeId || isLoadingSubscription) return;

    const region = activeSubscription?.currency
      ? currencyToRegion[activeSubscription.currency] || "US"
      : undefined;

    fetchCheckoutInfo(lastExamTypeId, region);
  }, [lastExamTypeId, isLoadingSubscription, activeSubscription?.currency]);

  // Extract target plan from checkout info
  useEffect(() => {
    if (!checkoutInfo?.plans) return;
    const plan = checkoutInfo.plans.find((p) => p.id === targetPlanId);
    setTargetPlan(plan || null);
  }, [checkoutInfo, targetPlanId]);

  // Fetch card info
  useEffect(() => {
    if (!lastExamTypeId || !activeSubscription) return;
    fetchCardInfo(lastExamTypeId);
  }, [lastExamTypeId, activeSubscription?.id]);

  const handleUpdateCard = () => {
    if (!lastExamTypeId || isUpdatingCard) return;
    setIsUpdatingCard(true);

    fetchManageLink(lastExamTypeId, (link) => {
      window.open(link, "_blank", "noopener,noreferrer");
    });

    // Reset after a timeout in case the redirect doesn't happen
    setTimeout(() => setIsUpdatingCard(false), 5000);
  };

  const currencySymbol = checkoutInfo
    ? currencySymbols[checkoutInfo.currency] || ""
    : activeSubscription
      ? currencySymbols[activeSubscription.currency] || ""
      : "\u20A6";

  const isSamePlan = activeSubscription?.planId === targetPlanId;

  // Loading state
  if (isLoadingSubscription || isLoadingCheckoutInfo) {
    return <UpdateSubSkeleton />;
  }

  // No active subscription — shouldn't be on this page
  if (!activeSubscription) {
    return (
      <section className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            No active subscription found. Please subscribe first.
          </p>
          <Button onClick={() => router.push("/student/subscriptions")}>
            Go to Subscriptions
          </Button>
        </div>
      </section>
    );
  }

  // Target plan not found
  if (!targetPlan) {
    return (
      <section className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Plan not found.</p>
          <Button onClick={() => router.push("/student/subscriptions")}>
            Go to Subscriptions
          </Button>
        </div>
      </section>
    );
  }

  const currentPlanPrice = `${currencySymbol}${activeSubscription.amountPaid.toLocaleString()}`;
  const targetPlanPrice = `${currencySymbol}${targetPlan.price.toLocaleString()}`;

  return (
    <>
      <section className="min-h-screen flex justify-center items-center relative">
        <button
          onClick={() => router.back()}
          className="text-gray-400 top-[2rem] left-[2rem] absolute hover:text-gray-600 mb-8"
        >
          <Icon icon="hugeicons:arrow-left-01" className="w-8 h-8" />
        </button>
        <div className="w-235.75">
          <h1 className="mb-6 text-[#2B2B2B] text-[1.75rem] font-[600] leading-9 tracking-[-.56px]">
            Update Subscription
          </h1>

          {isSamePlan && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
              This is your current plan. Please select a different plan to
              update.
            </div>
          )}

          <div className="flex gap-8 mb-8 items-center">
            {/* Current Subscription */}
            <div
              style={{ boxShadow: "0 0 0 1px #DCDFE4" }}
              className="rounded-[1rem] flex-1 bg-white overflow-hidden"
            >
              <div className="p-[2rem_1.5rem_1rem_1.5rem] text-white font-[500] leading-7 text-[1.125rem] bg-[#007FFF]">
                Current Subscription
              </div>
              <div className="p-6">
                <h3 className="text-[#212636] text-[1.5rem] font-[600] leading-8 tracking-[-.48px] mb-1">
                  {activeSubscription.plan.name}
                </h3>
                <h5 className="text-[#2B2B2B] text-[1.125rem] leading-7 font-[500]">
                  {currentPlanPrice}
                </h5>
                <p className="text-[#757575] text-[1rem] font-[400] leading-6">
                  every {durationLabel(activeSubscription.plan.durationDays)}
                </p>
              </div>
            </div>

            <div className="flex items-center font-[600] text-[#E32E89] gap-2 shrink-0">
              Change to{" "}
              <Icon
                className="w-6 h-6 text-inherit"
                icon="hugeicons:arrow-right-02"
              />
            </div>

            {/* New Subscription */}
            <div
              style={{ boxShadow: "0 0 0 1px #DCDFE4" }}
              className="rounded-[1rem] flex-1 bg-white overflow-hidden"
            >
              <div className="p-[2rem_1.5rem_1rem_1.5rem] text-white font-[500] leading-7 text-[1.125rem] bg-[#E32E89]">
                New Subscription
              </div>
              <div className="p-6">
                <h3 className="text-[#212636] text-[1.5rem] font-[600] leading-8 tracking-[-.48px] mb-1">
                  {targetPlan.name}
                </h3>
                <h5 className="text-[#2B2B2B] text-[1.125rem] leading-7 font-[500]">
                  {targetPlanPrice}
                </h5>
                <p className="text-[#757575] text-[1rem] font-[400] leading-6">
                  every {durationLabel(targetPlan.durationDays)}
                </p>
              </div>
            </div>
          </div>

          <h4 className="text-[#171717] tracking-[-.48px] leading-8 font-[600] text-[1.5rem] mb-4">
            What to Expect
          </h4>
          <ul className="flex gap-3 flex-col">
            {[
              "Your new subscription starts today.",
              `Starting ${formatDate(activeSubscription.nextPaymentDate ?? activeSubscription.endDate)}, you'll be charged ${targetPlanPrice}/${durationLabel(targetPlan.durationDays)}.`,
              "We'll apply the remainder of your current bill to your new subscription. Your new billing date is the day that credit runs out.",
            ].map((item, index) => (
              <li
                key={`___item__${index}`}
                className="flex items-start gap-3 text-[#2B2B2B]"
              >
                <Icon
                  icon="hugeicons:checkmark-circle-01"
                  className="w-5 h-5 text-inherit shrink-0 mt-0.5"
                />
                <span className="text-[1rem] leading-6 font-[400]">{item}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-[#171717] tracking-[-.48px] leading-8 font-[600] text-[1.5rem] mb-4 mt-8">
            Payment
          </h4>
          <div className="flex w-95 justify-between">
            <div className="flex items-center gap-3">
              <Icon icon="hugeicons:credit-card" className="w-11.25 h-11.25" />
              <div className="flex-col flex">
                <span className="text-[#2B2B2B] text-[1.125rem] leading-7 font-[500]">
                  {isLoadingCardInfo ? (
                    <span className="inline-block h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  ) : cardInfo ? (
                    `${cardInfo.brand} Card`
                  ) : (
                    "Saved Card"
                  )}
                </span>
                <span className="text-[#757575] leading-6 font-[400] text-[1rem]">
                  {isLoadingCardInfo ? (
                    <span className="inline-block h-4 w-40 bg-gray-100 rounded animate-pulse mt-1" />
                  ) : cardInfo ? (
                    `*****${cardInfo.last4} | ${cardInfo.expMonth}/${cardInfo.expYear}`
                  ) : (
                    "No card info available"
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={handleUpdateCard}
              disabled={isUpdatingCard}
              className="text-[#E32E89] leading-6 font-[600] text-[1rem] disabled:opacity-50 flex items-center gap-2"
            >
              {isUpdatingCard && (
                <Icon icon="svg-spinners:ring-resize" className="w-4 h-4" />
              )}
              Update
            </button>
          </div>

          <span className="block h-[1px] bg-[#EDEDED] my-8" />
          <p className="leading-6 mb-12.75 font-[400] text-[1rem] text-[#2B2B2B]">
            You hereby authorise iExcelo to charge you automatically every month
            until you cancel your subscription. Full terms are available{" "}
            <Link className="text-[#E32E89] underline" href="/terms">
              here.
            </Link>
          </p>
          <Button
            className="w-full justify-center"
            disabled={isSamePlan}
            loading={isUpgrading}
            onClick={() => {
              if (!lastExamTypeId || isSamePlan) return;
              upgradeSubscription(
                { targetPlanId, examTypeId: lastExamTypeId },
                () => router.push("/student/subscriptions"),
              );
            }}
          >
            {isSamePlan ? "This is your current plan" : "Update Subscription"}
          </Button>
        </div>
      </section>
    </>
  );
};

export default UpdateSub;
