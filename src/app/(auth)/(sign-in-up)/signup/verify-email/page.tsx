"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { Button } from "@/components/atoms";
import { Icon } from "@iconify/react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { signupEmail, setSignupEmail } = useAuthStore();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleGoBack = () => {
    setSignupEmail(null);
    router.push("/signup");
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    if (!signupEmail) {
      toast.error("Email not found. Please sign up again.");
      router.push("/signup");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await api.post("/auth/verify-email", {
        email: signupEmail,
        code,
      });

      toast.success(
        response.data?.message ||
          "Email verified successfully! You can now log in.",
      );

      // Clear signup email and redirect to login
      setSignupEmail(null);
      router.push("/login");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to verify email. Please try again.";
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  // Redirect to signup if no email is stored
  if (!signupEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md text-center">
          <p className="text-gray-600 mb-4">
            No email found. Please sign up first.
          </p>
          <Button
            onClick={() => router.push("/signup")}
            className="w-full justify-center"
          >
            Go to Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB] px-4">
      <div className="w-full max-w-md">
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center font-semibold text-sm gap-2 cursor-pointer text-[#2B2B2B] hover:text-gray-900"
        >
          <Icon
            icon="hugeicons:arrow-left-02"
            height="1.25rem"
            width="1.25rem"
            color="inherit"
          />
          Go Back
        </button>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F2FF]">
              <Icon
                icon="hugeicons:mail-02"
                height="2rem"
                width="2rem"
                color="#007FFF"
              />
            </div>
            <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-2">
              Verify your email
            </h1>
            <p className="text-sm text-[#757575]">
              We sent a 6-digit verification code to
            </p>
            <p className="text-sm font-medium text-[#2B2B2B] mt-1">
              {signupEmail}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#2B2B2B] mb-2">
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setCode(value);
              }}
              placeholder="000000"
              className="w-full rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-center text-2xl font-medium tracking-widest focus:border-[#007FFF] focus:outline-none focus:ring-2 focus:ring-[#007FFF]/20"
            />
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || code.length !== 6}
            className="w-full justify-center"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </Button>

          <p className="mt-6 text-center text-sm text-[#757575]">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              className="font-semibold text-[#007FFF] hover:underline"
              onClick={async () => {
                try {
                  await api.post("/auth/resend-verification", {
                    email: signupEmail,
                  });
                  toast.success("Verification code resent!");
                } catch {
                  toast.error("Failed to resend code. Please try again.");
                }
              }}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
