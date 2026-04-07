"use client";

import { ReactNode, useState } from "react";
import { DashboardSideBar, DashboardHeader } from "@/components/organisms";
import type { DashboardNavItem } from "@/types";

const adminNavItems: DashboardNavItem[] = [
  {
    name: "Dashboard",
    icon: "hugeicons:dashboard-square-02",
    href: "/admin",
  },
  {
    name: "Admin Management",
    icon: "hugeicons:user-01",
    href: "/admin/management",
  },
  {
    name: "Exam Revision",
    icon: "hugeicons:book-open-02",
    href: "/admin/exam-revision",
    children: [
      {
        name: "Exams",
        icon: "hugeicons:book-open-02",
        href: "/admin/exam-revision/exams",
      },
      {
        name: "Subjects",
        icon: "hugeicons:book-04",
        href: "/admin/exam-revision/subjects",
      },
      {
        name: "Questions",
        icon: "hugeicons:question-mark-circle",
        href: "/admin/exam-revision/questions",
      },
      {
        name: "Topics",
        icon: "hugeicons:tag-01",
        href: "/admin/exam-revision/topics",
      },
    ],
  },
  {
    name: "Students",
    icon: "hugeicons:users-group-rounded",
    href: "/admin/students",
  },
  {
    name: "Sponsor",
    icon: "hugeicons:hand-heart-02",
    href: "/admin/sponsor",
  },
  {
    name: "Affiliates",
    icon: "hugeicons:currency-exchange-circle",
    href: "/admin/affiliates",
  },
  {
    name: "Subscriptions",
    icon: "hugeicons:wallet-01",
    href: "/admin/subscriptions",
  },
  {
    name: "Testimonials",
    icon: "hugeicons:star-01",
    href: "/admin/testimonials",
  },
  {
    name: "Bulk Emails",
    icon: "hugeicons:mailbox",
    href: "/admin/bulk-emails",
  },
  {
    name: "Analytics",
    icon: "hugeicons:chart-column-01",
    href: "/admin/analytics",
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="flex h-screen bg-white">
      <DashboardSideBar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={adminNavItems}
        portalLabel="ADMIN PORTAL"
        showUpgrade={false}
      />

      <section className="flex-1 flex flex-col">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </section>
    </section>
  );
}
