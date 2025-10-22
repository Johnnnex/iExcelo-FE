import React from 'react';
import { SVGClient } from '../atoms';
import { Button } from '../atoms';
import Link from 'next/link';

const Header = () => {
	return (
		<header className='fixed z-[4] w-full top-[3.25rem]'>
			<div className='flex backdrop-blur-[40px] mx-auto justify-between items-center max-w-[870px] w-[90%] p-[.625rem] bg-[#00356B] rounded-[6.25rem]'>
				<Link href={'/'}>
					<SVGClient src='/svg/logo.svg' />
				</Link>
				<div className='flex items-center text-white gap-[3.25rem]'>
					<nav>
						<ul className='flex gap-[1.5rem] items-center'>
							{[
								{ title: 'Features', href: '/features' },
								{ title: 'About Us', href: '/about' },
								{ title: 'FAQs', href: '/faqs' },
								{ title: 'Contact Us', href: '/contact' },
							].map((_, index) => (
								<li key={`__nav__${index}`}>
									<Link
										className='font-[600] text-[1rem] leading-[1.5rem]'
										href={_?.href}
									>
										{_?.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>
					<div className='flex gap-[1rem] items-center'>
						<button className='font-[600] text-[1rem] leading-[1.5rem] cursor-pointer'>
							Log In
						</button>
						<Button>Sign Up</Button>
					</div>
				</div>
			</div>
		</header>
	);
};

export { Header };
