/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { Button } from "@/components/atoms";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { signupEmail, verifyEmail, resendVerificationCode, hydrated } =
    useAuthStore();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Exponential countdown state
  const [countdown, setCountdown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate next cooldown: 60, 90, 120, 150... (adds 30 each time)
  const getNextCooldown = useCallback((count: number) => {
    return 60 + count * 30;
  }, []);

  // Start countdown timer
  const startCountdown = useCallback((seconds: number) => {
    setCountdown(seconds);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Redirect if no email
  useEffect(() => {
    if (!hydrated) return;

    if (!signupEmail) {
      toast.error("No email provided. Please sign up first.");
      router.replace("/signup");
    }
  }, []);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down (backspace)
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Handle verify
  const handleVerify = () => {
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);

    verifyEmail({ email: signupEmail!, code }, () => {
      setIsVerifying(false);
      // Redirect to login after successful verification
      router.push("/login");
    });

    // Reset verifying state if there was an error (callback won't be called)
    setTimeout(() => setIsVerifying(false), 3000);
  };

  // Handle resend code
  const handleResend = () => {
    if (countdown > 0) return;

    setIsResending(true);

    resendVerificationCode(signupEmail!, () => {
      setIsResending(false);
      // Clear the OTP inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      // Start countdown with exponential increase
      const nextCooldown = getNextCooldown(resendCount);
      startCountdown(nextCooldown);
      setResendCount((prev) => prev + 1);
    });

    // Reset resending state if there was an error (callback won't be called)
    setTimeout(() => setIsResending(false), 3000);
  };

  if (!signupEmail) {
    return null;
  }

  const canResend = countdown === 0 && !isResending;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] mb-2">
          Verify Your Email
        </h1>
        <p className="text-sm text-[#667085]">
          We sent a 6-digit verification code to{" "}
          <span className="font-semibold text-[#2B2B2B]">{signupEmail}</span>.
          Enter the code below to verify your account.
        </p>
      </div>

      <div className="space-y-6">
        {/* OTP Input Boxes */}
        <div className="flex gap-3 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-xl font-semibold border border-[#D0D5DD] rounded-lg focus:border-[#007FFF] focus:outline-none transition-colors"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={isVerifying || otp.join("").length !== 6}
          className="w-full justify-center"
          loading={isVerifying}
        >
          Verify Email
        </Button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-[#667085] mb-2">
            Didn&apos;t receive the code?
          </p>
          {countdown > 0 ? (
            <p className="text-sm text-[#667085]">
              Can resend in{" "}
              <span className="font-semibold text-[#2B2B2B]">
                {formatTime(countdown)}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="text-sm font-semibold text-[#007FFF] hover:text-[#0052CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
