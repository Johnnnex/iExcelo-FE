import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { geistSans } from '@/app/layout';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	className?: string;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
	return (
		<button
			className={cn(
				'rounded-[1.5rem] h-fit border cursor-pointer gap-[.5rem] disabled:bg-[#54A9FF] disabled:cursor-not-allowed disabled:border-[#EDEDED] border-[#DBEDFF] hover:bg-[#39F] focus-within:border-[#94C9FF] focus:border-[#94C9FF] focus-visible:border-[#94C9FF] shadow-[0 0 0 1px #6A7BD6] disabled:shadow-[0 0 0 1px #D6D6D6] hover:shadow-none focus-within:bg-[#005AB5] focus:bg-[#005AB5] focus-visible:bg-[#005AB5] transition-all duration-[.4s] bg-[#007FFF] p-[.75rem_1.25rem] text-[1rem] flex items-center font-semibold leading-[1.5rem] text-white shadow-[0_0_0_1px_#6A7BD6]',
				geistSans?.className,
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
};

export { Button };
