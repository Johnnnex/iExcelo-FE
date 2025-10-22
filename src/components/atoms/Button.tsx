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
				'rounded-[1.5rem] h-fit border cursor-pointer gap-[.5rem] border-[#DBEDFF] bg-[#007FFF] p-[.75rem_1.25rem] text-[1rem] flex items-center font-semibold leading-[1.5rem] text-white shadow-[0_0_0_1px_#6A7BD6]',
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
