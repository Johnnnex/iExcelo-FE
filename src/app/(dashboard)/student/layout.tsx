/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSideBar, DashboardHeader } from "@/components/organisms";
import { CompleteProfileModal } from "@/components/organisms/student-dashboard";
import { useAuthStore, useStudentStore, useUtilsStore } from "@/store";
import { UserType } from "@/types";
import { SocketProvider } from "@/providers/SocketProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    accessToken,
    refreshToken,
    hydrated: authHydrated,
  } = useAuthStore();
  const {
    profile,
    hydrated: profileHydrated,
    dashboardData,
    isLoadingDashboard,
  } = useStudentStore();

  const { subscribeToPush } = useUtilsStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Auth protection - wait for both stores to hydrate
  useEffect(() => {
    if (!authHydrated || !profileHydrated) return;

    // Check authentication
    if (!isAuthenticated || !accessToken || !refreshToken || !user) {
      router.replace("/login");
      return;
    }

    // Check if user type is student
    if (user.role !== UserType.STUDENT) {
      router.replace("/login");
      return;
    }

    // Check if student profile exists
    if (!profile) {
      router.replace("/login");
      return;
    }

    setIsAuthorized(true);
  }, [authHydrated, profileHydrated]);

  // Request push permission once authorized — best-effort, never blocks render
  useEffect(() => {
    if (isAuthorized) subscribeToPush();
  }, [isAuthorized]);

  // Show modal when user hasn't selected subjects for default exam type
  const showProfileModal =
    isAuthorized &&
    !isLoadingDashboard &&
    dashboardData &&
    dashboardData?.currentExamType?.hasSelectedSubjects === false;

  // Don't render until authorized
  if (!isAuthorized) {
    return null;
  }

  return (
    <SocketProvider>
      <>
        <section className="flex h-screen bg-white">
          <DashboardSideBar
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            portalLabel="STUDENT PORTAL"
            isSponsored={profile?.isSponsored ?? false}
            sponsorName={profile?.sponsorDisplayName}
            showUpgrade={
              !dashboardData?.currentExamType?.isPaid &&
              !(profile?.isSponsored ?? false)
            }
            upgradeUrl={
              !dashboardData?.flags?.showGoPremiumModal &&
              !dashboardData?.currentExamType?.isPaid &&
              !(profile?.isSponsored ?? false)
                ? `/student/upgrade?examTypeId=${dashboardData?.currentExamType?.id}`
                : undefined
            }
          />

          <section className="flex-1 flex flex-col">
            <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
            <main className="flex-1 overflow-y-auto will-change-transform">{children}</main>
          </section>
        </section>

        <CompleteProfileModal isOpen={!!showProfileModal} />
      </>
    </SocketProvider>
  );
}
