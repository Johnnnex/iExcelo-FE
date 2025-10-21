import CTA from '@/components/organisms/CTA';
import { Icon } from '@iconify/react';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	title: 'iExcelo - Contact Us',
};

const Contact = () => {
	return (
		<main className='bg-white'>
			<section className='bg-[url(/images/background-pattern-3.png)] bg-center bg-cover justify-center flex-col gap-[1rem] flex items-center h-[100vh]'>
				<h2 className='text-[3.25rem] text-center leading-[3.5rem] tracking-[-1.04px] font-[600] text-[#101928]'>
					Get in Touch
				</h2>
				<p className='text-[#98A2B3] text-center font-[500] tracking-[-.4px] text-[1.25rem] leading-[1.75rem] mb-[4rem]'>
					We&apos;d love to hear from you. Our friendly team is here to help
				</p>
			</section>
			<section className='py-[6rem] max-w-[1300px] justify-between mx-auto w-[90%] flex gap-[2rem]'>
				{[
					{
						icon: 'hugeicons:mail-01',
						name: 'Email',
						content: 'Our friendly team is here to help.',
						moreInfo: 'Platform@iexcelo.com',
					},
					{
						icon: 'hugeicons:location-06',
						name: 'Office',
						content: 'Come say hello at our office HQ.',
						moreInfo:
							'Miolive Excel Academy Ltd, 16B Babalola street, Mushin-Itire Road, Ilasamaja, Lagos, Nigeria',
					},
					{
						icon: 'hugeicons:call-02',
						name: 'Phone',
						content: 'Mon-Fri from 8am to 5pm.',
						moreInfo: '+234 909 999 0919',
					},
				]?.map((item, index) => (
					<div
						key={`__item__${index}`}
						className='flex items-center justify-center gap-[1.25rem] w-[24rem] flex-col'
					>
						<div className='flex items-center justify-center border-[8px] border-[#E6F2FF] rounded-[50%] bg-[#B0D7FF] h-[3.5rem] w-[3.5rem]'>
							<Icon
								icon={item?.icon}
								color='#007FFF'
								height={'1.5rem'}
								width={'1.5rem'}
							/>
						</div>
						<div className='flex flex-col items-center justify-center gap-[.5rem]'>
							<span className='text-[#101928] text-center tracking-[-.4px] font-[700] leading-[1.75rem] text-[1.25rem]'>
								{item?.name}
							</span>
							<span className='text-[#475467] text-center text-[1rem] leading-[1.5rem] font-[400]'>
								{item?.content}
							</span>
						</div>
						<p className='text-[#007FFF] text-center leading-[1.5rem] font-[600] text-[1rem]'>
							{item?.moreInfo}
						</p>
					</div>
				))}
			</section>

			<CTA />
		</main>
	);
};

export default Contact;
