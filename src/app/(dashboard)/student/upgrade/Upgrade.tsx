"use client";

import { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { useStudentStore } from "@/store";
import type { ICheckoutInfo } from "@/types";

// Currency symbols mapping
const currencySymbols: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  CAD: "C$",
  AUD: "A$",
};

// Plan styling configurations (matching Subscriptions.tsx design)
const planStyles = [
  {
    badge: {
      text: "Starter",
      color: "text-[#5925DC] bg-[#F4F3FF] border-[#D9D6FE]",
    },
    icon: { icon: "hugeicons:star", bg: "gradients-subtle-hue-2" },
  },
  {
    badge: {
      text: "Most Popular",
      color: "text-[#175CD3] bg-[#EFF8FF] border-[#B2DDFF]",
    },
    icon: { icon: "hugeicons:crown", bg: "gradients-subtle-hue-5" },
  },
  {
    badge: {
      text: "Best Value",
      color: "bg-[#FEF6EE] text-[#B93815] border-[#F9DBAF]",
    },
    icon: { icon: "hugeicons:sparkles", bg: "gradients-subtle-hue-9" },
  },
];

const defaultFeatures = [
  "Unlimited revision and mock tests",
  "Real-time performance tracking",
  "Access to all subjects",
  "Detailed answer explanations",
];

// Payment methods based on provider
const getPaymentMethods = (provider: string) => {
  const methods = [];

  if (provider === "paystack") {
    methods.push({
      id: "paystack",
      label: "Paystack",
      icon: null,
      isPaystack: true,
    });
  } else if (provider === "stripe") {
    methods.push({ id: "stripe", label: "stripe", icon: null, isStripe: true });
  }

  return methods;
};

interface UpgradeProps {
  examTypeId: string;
  checkoutInfo: ICheckoutInfo | null;
}

export default function Upgrade({ examTypeId, checkoutInfo }: UpgradeProps) {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Transform checkout info into display format
  const plans = useMemo(() => {
    if (!checkoutInfo?.plans) return [];
    return checkoutInfo.plans.map((plan, index) => ({
      ...plan,
      style: planStyles[index] || planStyles[0],
      formattedPrice: `${currencySymbols[checkoutInfo.currency] || ""}${plan.price.toLocaleString()}`,
    }));
  }, [checkoutInfo]);

  // Set default selected plan and payment method on initial load
  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans, selectedPlanId]);

  useEffect(() => {
    if (checkoutInfo?.provider && !selectedMethod) {
      setSelectedMethod(checkoutInfo.provider);
    }
  }, [checkoutInfo, selectedMethod]);

  const currentPlan = plans.find((p) => p.id === selectedPlanId);
  const currency = checkoutInfo?.currency || "NGN";
  const currencySymbol = currencySymbols[currency] || "₦";
  const provider = checkoutInfo?.provider || "paystack";

  const { initiateCheckout, isCheckingOut } = useStudentStore();

  const handleSubscribe = () => {
    if (!currentPlan || !checkoutInfo) return;

    initiateCheckout(
      {
        planId: currentPlan.id,
        examTypeId,
        region: checkoutInfo.region,
      },
      (url) => {
        window.location.href = url;
      },
    );
  };

  const paymentMethods = getPaymentMethods(provider);

  // Show error state if checkout info failed to load
  if (!checkoutInfo || plans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <Icon
            icon="hugeicons:alert-circle"
            className="w-16 h-16 text-red-500 mx-auto mb-4"
          />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Plans
          </h1>
          <p className="text-gray-500 mb-4">
            We couldn&apos;t load the subscription plans. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 mb-8"
          >
            <Icon icon="hugeicons:cancel-01" className="w-8 h-8" />
          </button>

          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Choose your plan with us!
            </h1>
            <p className="text-gray-500">
              Which package options fits you best?
            </p>
            {checkoutInfo.region && (
              <p className="text-xs text-gray-400 mt-2">
                Prices shown in {currency}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setShowPayment(true);
                  }}
                  className="cursor-pointer"
                >
                  <div
                    style={{
                      boxShadow: isSelected
                        ? "0 0 0 2px #007FFF, 0 5px 22px 0 rgba(0, 0, 0, 0.04)"
                        : "0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)",
                    }}
                    className="p-[1rem_.75rem_1.25rem_.75rem] rounded-[1.5rem] bg-white transition-shadow"
                  >
                    <div
                      style={{
                        boxShadow:
                          "0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)",
                      }}
                      className="p-[1.5rem_1.25rem] mb-6 rounded-[1.25rem] gradients-linear-grey"
                    >
                      <span
                        className={cn(
                          "block mb-3.5 font-[500] text-[.875rem] leading-5 p-[.125rem_.625rem] border w-fit mix-blend-multiply rounded-[1rem] bg-[#EFF8FF]",
                          plan.style.badge.color,
                        )}
                      >
                        {plan.style.badge.text}
                      </span>
                      <div
                        className={cn(
                          "w-fit h-fit p-3.5 rounded-full",
                          plan.style.icon.bg,
                        )}
                      >
                        <Icon
                          icon={plan.style.icon.icon}
                          className="w-6 h-6 text-white"
                        />
                      </div>
                      <p className="text-[1.125rem] mt-3.5 mb-2 font-[500] leading-7 text-[#2B2B2B]">
                        {plan.name}
                      </p>
                      <h6 className="tracking-[-.64px] text-[2rem] leading-10 font-[500]">
                        {plan.formattedPrice}
                      </h6>
                    </div>

                    <ul className="flex mb-24 flex-col gap-3">
                      {defaultFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Icon
                            icon="hugeicons:checkmark-circle-01"
                            className="w-5 h-5 text-[#2B2B2B]"
                          />
                          <p className="text-[#2B2B2B] text-[.875rem] font-[400] leading-5">
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full justify-center">
                      Select Plan
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PaymentMethodSelector inline */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <button
                onClick={() => setShowPayment(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="hugeicons:cancel-01" className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Payment Method
                </h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center justify-between p-3 md:p-4 rounded-xl border cursor-pointer transition-colors ${
                        selectedMethod === method.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {method.icon && (
                          <Icon
                            icon={method.icon}
                            className="w-5 h-5 text-gray-600"
                          />
                        )}
                        {method.isPaystack && (
                          <span className="text-cyan-500 font-bold">
                            ≡ paystack
                          </span>
                        )}
                        {method.isStripe && (
                          <span className="text-purple-600 font-bold text-lg">
                            stripe
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Subscribe to iExcelo {currentPlan?.name || "Plan"}
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">
                    {currentPlan?.formattedPrice || `${currencySymbol}0`}
                  </span>
                  <span className="text-sm text-gray-500">
                    for {currentPlan?.durationDays || 0} days
                  </span>
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">
                      {currentPlan?.formattedPrice || `${currencySymbol}0`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900">{currencySymbol}0.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-3">
                    <span className="text-gray-900">Today&apos;s Total</span>
                    <span className="text-gray-900">
                      {currentPlan?.formattedPrice || `${currencySymbol}0`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-gray-100">
              <Button
                className="w-full justify-center"
                onClick={handleSubscribe}
                loading={isCheckingOut}
                disabled={!currentPlan}
              >
                Subscribe
              </Button>
              <p className="text-center text-xs text-gray-500 mt-4">
                By subscribing, you authorize iExcelo to charge you according to
                the terms until you cancel.
              </p>
              <div className="flex items-center justify-center gap-2 md:gap-4 mt-4 text-xs text-gray-400">
                <span>
                  Powered by{" "}
                  {provider === "stripe" ? (
                    <span className="text-purple-600 font-bold">stripe</span>
                  ) : (
                    <span className="text-cyan-500 font-bold">paystack</span>
                  )}
                </span>
                <span>|</span>
                <a href="#" className="hover:text-gray-600">
                  Terms
                </a>
                <a href="#" className="hover:text-gray-600">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
