/* eslint-disable @next/next/no-img-element */
import { Button, Chip } from '@/components/atoms';
import { CTA } from '@/components/organisms';
import { Icon } from '@iconify/react';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	title: 'iExcelo - Affiliate',
};

const Affiliate = () => {
	return (
		<main className='bg-white'>
			<section className='bg-[url(/images/background-pattern-3.png)] bg-center bg-cover flex items-center h-[100vh]'>
				<div className='max-w-[1300px] w-[90%] flex items-center justify-between mx-auto'>
					<div className='w-[50%]'>
						<Chip name='iExcelo Affiliate Program' />
						<h1 className='my-[1rem] text-[3.25rem] font-[600] tracking-[-1.04px] text-[#101928] leading-[3.5rem]'>
							Earn While Empowering Education
						</h1>
						<p className='mb-[1.5rem] text-[1.25rem] max-w-[37rem] leading-[1.75rem] tracking-[-.4px] text-[#98A2B3] font-[500]'>
							Turn your network into impact and income! As an iExcelo affiliate,
							you&apos;ll earn up to 15% commission for every student who subscribes
							through your referral.
						</p>
						<Button>
							Join now
							<Icon
								icon='hugeicons:arrow-right-02'
								height={'1.5rem'}
								width={'1.5rem'}
							/>
						</Button>
					</div>
					<figure className='w-[50%] overflow-visible h-[34.5rem] relative'>
						<img
							src={'/images/hero-img-4.png'}
							alt='Hero Image 4'
							className='absolute inset-0 scale-x-[1.35] w-full h-full'
							loading='lazy'
						/>
					</figure>
				</div>
			</section>

			<section className='py-[6rem] flex justify-between items-center max-w-[1300px] mx-auto w-[90%]'>
				<div className='w-[53%]'>
					<div className='mb-[2rem] '>
						<Chip
							name='Our Benefits'
							iconPath='hugeicons:star'
						/>
					</div>
					<h2 className='text-[2.75rem] leading-[3rem] tracking-[-.88px] font-[600] text-[#101928] mb-[.5rem]'>
						Why Join the Affiliate Program?
					</h2>
					<p className='text-[#667185] font-[400] text-[1.125rem] leading-[1.75rem] mb-[2.5rem]'>
						Promote iExcelo on social media, share your link, and start earning, while
						helping students across Nigeria and West Africa unlock their full academic
						potential.
					</p>
					<div className=' gap-[2.1875rem_1rem] grid grid-cols-1 md:grid-cols-2'>
						{[
							{
								content: `Track sign-ups and commissions in real time`,
								icon: 'hugeicons:analytics-01',
							},
							{
								content: `Generate and share your unique affiliate link`,
								icon: 'hugeicons:share-01',
							},
							{
								content: `Request payouts with ease`,
								icon: 'hugeicons:money-receive-02',
							},
							{
								content: `Monitor your performance and success`,
								icon: 'hugeicons:chart-evaluation',
							},
						]?.map((item, index) => (
							<div
								key={`__box__item__${index}`}
								style={{
									boxShadow:
										'0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)',
								}}
								className='p-[1.5rem_1.125rem] flex gap-[1rem] items-center bg-white rounded-[.75rem] overflow-hidden'
							>
								<span className='p-[.875rem] flex items-center justify-center w-fit bg-[#E6F2FF] rounded-[50%]'>
									<Icon
										icon={item?.icon}
										height={'1.5rem'}
										width={'1.5rem'}
										color='#007FFF'
									/>
								</span>
								<p className='leading-[1.75rem] text-[#1D2739] w-[90%] tracking-[-.4px] font-[500] text-[1.25rem]'>
									{item?.content}
								</p>
							</div>
						))}
					</div>
				</div>
				<figure className='w-[41%]'>
					<img
						src={`/images/affiliate-img-1.png`}
						alt='Affiliate Image 1'
					/>
				</figure>
			</section>

			<CTA />
		</main>
	);
};

export default Affiliate;
