import React from 'react';
import { SVGClient } from '../atoms';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer className='bg-[#E6F2FF] py-[4rem]'>
			<section className='max-w-[1300px] mx-auto w-[90%]'>
				<div className='flex flex-col gap-[4rem]'>
					<div className='flex items-start justify-between'>
						<div className='flex flex-col gap-[2rem]'>
							<Link href={'/'}>
								<SVGClient src='/svg/logo.svg' />
							</Link>
							<ul className='flex gap-[1.5rem]'>
								{[
									{ name: 'About Us', url: '/about' },
									{ name: 'FAQs', url: '/faqs' },
									{ name: 'Contact Us', url: '/contact' },
								]?.map((navItem, index) => (
									<li key={`__nav__item__${index}`}>
										<Link
											className='text-[1rem] leading-[1.5rem] text-[#1D2739] font-[500]'
											href={navItem?.url}
										>
											{navItem?.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div className='flex flex-col max-w-[26.7rem] gap-[1.5rem]'>
							<div className='flex flex-col gap-[.25rem]'>
								<span className='text-[#1D2739] text-[.875rem] font-[500] leading-[1.25rem]'>
									Office Address:
								</span>
								<span className='leading-[1.25rem] font-[400] text-[#667185] text-[.875rem]'>
									Miolive Excel Academy Ltd, 16B Babalola street, Mushin-Itire Road,
									Ilasamaja, Lagos, Nigeria
								</span>
							</div>
							<div className='flex flex-col gap-[.25rem]'>
								<span className='text-[#1D2739] text-[.875rem] font-[500] leading-[1.25rem]'>
									E-mail Address::
								</span>
								<span className='leading-[1.25rem] font-[400] text-[#667185] text-[.875rem]'>
									Platform@iexcelo.com
								</span>
							</div>
						</div>
					</div>
					<div className='border-t border-[#DCDFE4] flex justify-between items-center pt-[2rem]'>
						<div className='flex gap-[1.5rem] items-center'>
							{[
								{ path: 'facebook', url: '/' },
								{ path: 'twitter', url: '/' },
								{ path: 'instagram', url: '/' },
							]?.map((item, index) => (
								<a
									href={item?.path}
									target='_blank'
									key={`__icon__social__${index}`}
									className='h-[1.5rem] w-[1.5rem] rounded-[50%] bg-[#007FFF] flex items-center justify-center'
								>
									<SVGClient src={`/svg/${item?.path}.svg`} />
								</a>
							))}
						</div>
						<div className='flex gap-[2rem] items-center'>
							{[
								{ title: 'Terms of Service', url: '/terms' },
								{ title: 'Privacy Policy', url: '/privacy' },
								{ title: '© Copyright 2025 | All rights are reserved by iExcelo' },
							]?.map((item, index) =>
								item?.url ? (
									<Link
										href={item?.url}
										className='text-[#667185] leading-[1.25rem] font-[400] text-[.875rem]'
										key={`__link__${index}`}
									>
										{item?.title}
									</Link>
								) : (
									<span
										className='text-[#667185] leading-[1.25rem] font-[400] text-[.875rem]'
										key={`__text__${index}`}
									>
										{item?.title}
									</span>
								)
							)}
						</div>
					</div>
				</div>
			</section>
		</footer>
	);
};

export { Footer };
