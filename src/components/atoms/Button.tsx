import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { geistSans } from "@/app/layout";
import { Icon } from "@iconify/react";

type ButtonVariant = "contained" | "outlined";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  disableLoader?: boolean; // This option was added due to the fact that sometimes one may not want a loader, just disabled button (rare but needed)
  variant?: ButtonVariant;
}

const containedStyles =
  "rounded-[1.5rem] h-fit border cursor-pointer gap-[.5rem] disabled:bg-[#54A9FF] disabled:cursor-not-allowed disabled:border-[#EDEDED] border-[#DBEDFF] hover:bg-[#39F] focus-within:border-[#94C9FF] focus:border-[#94C9FF] focus-visible:border-[#94C9FF] disabled:shadow-[0_0_0_1px_#D6D6D6] hover:shadow-none focus-within:bg-[#005AB5] focus:bg-[#005AB5] focus-visible:bg-[#005AB5] transition-all duration-[.4s] bg-[#007FFF] p-[.75rem_1.25rem] text-[1rem] flex items-center font-semibold justify-center leading-[1.5rem] text-white shadow-[0_0_0_1px_#6A7BD6]";

const outlinedStyles =
  "px-6 py-2.5 border border-[#007FFF] justify-center text-[#007FFF] rounded-full font-semibold leading-[1.5rem] text-[1rem] hover:bg-blue-100! focus:bg-blue-50 p-[.75rem_1.25rem] focus-visible:bg-blue-100 active:bg-blue-200 transition-colors cursor-pointer h-fit flex items-center gap-[.5rem] disabled:opacity-50 disabled:cursor-not-allowed";

const Button = ({
  children,
  className,
  loading,
  disableLoader,
  variant = "contained",
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={loading || props?.disabled}
      className={cn(
        variant === "outlined" ? outlinedStyles : containedStyles,
        geistSans?.className,
        className,
      )}
      {...props}
    >
      {children}
      {loading && !disableLoader && (
        <Icon icon={"svg-spinners:ring-resize"} color="inherit" />
      )}
    </button>
  );
};

export { Button };
