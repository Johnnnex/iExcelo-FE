"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/components/atoms";
import { useNotificationStore } from "@/store/notification.store";
import { cn } from "@/lib/utils";
import type { INotification } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toUTC(iso: string): Date {
  return new Date(/Z$|[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + "Z");
}

function relativeTime(iso: string): string {
  const diff = Date.now() - toUTC(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function notifIcon(type: INotification["type"]): string {
  switch (type) {
    case "new_message":
      return "hugeicons:bubble-chat-notification";
    case "new_chatroom":
      return "hugeicons:messenger";
    case "giveback_activated":
      return "hugeicons:healtcare";
    case "subscription_expiring":
    case "subscription_expired":
      return "hugeicons:wallet-01";
    case "exam_result":
      return "hugeicons:book-open-02";
    default:
      return "hugeicons:notification-01";
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div
      className="flex items-start gap-4 p-5 rounded-[.5rem] animate-pulse"
      style={{
        boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 2px 8px 0 rgba(0,0,0,0.04)",
      }}
    >
      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 w-48 bg-gray-200 rounded-md" />
          <div className="h-3 w-14 bg-gray-100 rounded-md flex-shrink-0" />
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-md" />
        <div className="h-3 w-3/5 bg-gray-100 rounded-md" />
      </div>
    </div>
  );
}

// ─── Notification row ─────────────────────────────────────────────────────────

function NotificationRow({
  notification,
  onMark,
}: {
  notification: INotification;
  onMark: (id: string) => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.isRead) onMark(notification.id);
    router.push(notification.url);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left flex items-start gap-4 p-5 rounded-[.5rem] transition-colors",
        !notification.isRead
          ? "bg-[#F0F8FF] hover:bg-[#E8F4FF]"
          : "bg-white hover:bg-[#FAFAFA]",
      )}
      style={{
        boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 2px 8px 0 rgba(0,0,0,0.04)",
      }}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
          !notification.isRead
            ? "bg-[#DBEDFF] text-[#007FFF]"
            : "bg-[#F5F5F5] text-[#A3A3A3]",
        )}
      >
        <Icon icon={notifIcon(notification.type)} className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-[.9375rem] leading-5",
              !notification.isRead
                ? "font-[600] text-[#171717]"
                : "font-[400] text-[#2B2B2B]",
            )}
          >
            {notification.title}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[.75rem] text-[#A3A3A3] whitespace-nowrap">
              {relativeTime(notification.createdAt)}
            </span>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-[#007FFF] flex-shrink-0 mt-1" />
            )}
          </div>
        </div>
        <p className="text-[.875rem] text-[#757575] leading-5 mt-0.5">
          {notification.body}
        </p>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function NotificationsPage() {
  const {
    notifications,
    notificationsTotal,
    notificationsPage,
    isLoadingNotifications,
    unreadCount,
    isMarkingRead,
    fetchNotifications,
    markRead,
    markAllRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasMore = notifications.length < notificationsTotal;

  const handleLoadMore = () => {
    fetchNotifications(notificationsPage + 1);
  };

  return (
    <section className="xl:px-[2rem] px-[.875rem] py-[1.25rem] mx-auto">
      {/* Page header */}
      <div className="flex mb-8 flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl flex items-center font-bold gap-3 text-gray-900">
            Notifications
            {unreadCount > 0 && (
              <span className="flex items-center justify-center bg-[#E32E89] text-white text-[.75rem] font-[600] rounded-full w-6 h-6">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your activity feed from iExcelo
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            onClick={markAllRead}
            loading={isMarkingRead}
          >
            <Icon icon="hugeicons:tick-double-02" className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {isLoadingNotifications && notifications.length === 0 ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3 text-[#A3A3A3]">
            <Icon icon="hugeicons:notification-01" className="w-10 h-10" />
            <p className="text-[.9375rem]">No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications.map((n) => (
              <NotificationRow key={n.id} notification={n} onMark={markRead} />
            ))}

            {hasMore && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingNotifications}
                  className="text-[.875rem] text-[#007FFF] font-[500] hover:underline disabled:opacity-50 py-2"
                >
                  {isLoadingNotifications ? (
                    <span className="flex items-center gap-2">
                      <Icon
                        icon="svg-spinners:ring-resize"
                        className="w-4 h-4"
                      />
                      Loading...
                    </span>
                  ) : (
                    `Load more (${notificationsTotal - notifications.length} remaining)`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
