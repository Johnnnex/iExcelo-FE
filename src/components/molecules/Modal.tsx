"use client";

import { cn } from "@/lib/utils";
import { CARD_SHADOW } from "@/utils";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  /** Classes applied to the white content box — controls width, border-radius, overflow, etc. */
  className?: string;
  /** Tailwind z-index class. Defaults to "z-50". */
  zIndex?: string;
  /** Override white-box overflow. Use "hidden" when the modal manages its own internal scroll zones. Defaults to "auto". */
  overflowY?: "auto" | "hidden";
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  zIndex = "z-50",
  overflowY = "auto",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/40 flex items-center justify-center p-4",
        zIndex,
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white flex flex-col max-h-[95vh]",
          overflowY === "hidden" ? "overflow-hidden" : "overflow-y-auto",
          className,
        )}
        style={{ boxShadow: CARD_SHADOW }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
