/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @next/next/no-img-element */
import { Button, Chip } from '@/components/atoms';
import { CTA } from '@/components/organisms';
import { Icon } from '@iconify/react';
import React from 'react';

const GiveBack = () => {
	return (
		<main className='bg-white'>
			<section className='bg-[url(/images/background-pattern-3.png)] bg-center bg-cover flex items-center h-[100vh]'>
				<div className='max-w-[1300px] w-[90%] flex items-center justify-between gap-[2.3125rem] mx-auto'>
					<div className='w-[50%]'>
						<Chip name='iExcelo GIveback' />
						<h1 className='my-[1rem] text-[3.25rem] font-[600] tracking-[-1.04px] text-[#101928] leading-[3.5rem]'>
							Learn, Excel, and Make a Difference
						</h1>
						<p className='mb-[1.5rem] text-[1.25rem] max-w-[33rem] leading-[1.75rem] tracking-[-.4px] text-[#98A2B3] font-[500]'>
							Join iExelo Giveback to support learning for underprivileged students. A
							trusted platform that connects your donations to real educational impact.
							Every contribution helps learners in need access tools and resources to
							succeed.
						</p>
						<Button>
							Join the Giveback Program
							<Icon
								icon='hugeicons:arrow-right-02'
								height={'1.5rem'}
								width={'1.5rem'}
							/>
						</Button>
					</div>
					<img
						src={'/images/hero-img-5.png'}
						alt='Hero Image 5'
						className='w-[50%] h-[37.5rem]'
						loading='lazy'
					/>
				</div>
			</section>

			<section className='py-[6rem] max-w-[1300px] flex justify-between items-center mx-auto w-[90%]'>
				<div className='w-[47%]'>
					<div className='mb-[2rem]'>
						<Chip
							name='Our Benefits'
							iconPath='hugeicons:star'
						/>
					</div>
					<h2 className='text-[2.75rem] leading-[3rem] w-[90%] tracking-[-.88px] font-[600] text-[#101928] mb-[.5rem]'>
						Why Join the GiveBack Program?
					</h2>
					<p className='text-[#667185] font-[400] text-[1.125rem] leading-[1.75rem] mb-[2.5rem]'>
						Every learner deserves a fair chance to succeed. By partnering with
						iExcelo, you&apos;re not just giving access to education, you&apos;re
						investing in future leaders, innovators, and changemakers.
					</p>
					<div className='flex gap-[1.5rem] flex-col'>
						{[
							[
								{
									icon: 'hugeicons:book-open-02',
									type: 'container',
									title: 'Create Impact',
									content: `Your success story becomes someone else's starting point.`,
								},
								{ type: 'divider' },
								{
									icon: 'hugeicons:book-open-02',
									type: 'container',
									title: 'Transparent Reports',
									content: `See exactly how and where your donation makes an impact.`,
								},
							],
							[
								{
									icon: 'hugeicons:book-open-02',
									type: 'container',
									title: 'Build Legacy',
									content: `Contribute to shaping the next generation of achievers.`,
								},
								{ type: 'divider' },
								{
									icon: 'hugeicons:book-open-02',
									type: 'container',
									title: 'Transparent Reports',
									content: `Join as a partner to sponsor entire learning communities.`,
								},
							],
							,
						]?.map((item, index) => (
							<div
								key={`__item__${index}`}
								className='flex justify-between w-full items-center'
							>
								{item?.map((itemChild, index) =>
									itemChild?.type === 'divider' ? (
										<span
											key={`__divider___${index}`}
											className='h-[12.1875rem] w-[1px] bg-[#DCDFE4]'
										/>
									) : (
										<div
											key={`__container___${index}`}
											className='flex flex-col w-[45%] gap-[2rem]'
										>
											<span
												style={{
													boxShadow:
														'0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)',
												}}
												className='p-[.75rem] rounded-[.5rem] w-fit border-[2px] border-[#DBEDFF] bg-[#007FFF]'
											>
												<Icon
													icon={itemChild?.icon!}
													height={'1.25rem'}
													width={'1.25rem'}
													color='#FFFFFF'
												/>
											</span>
											<div className='flex flex-col gap-[.5rem]'>
												<h4 className='text-[1.25rem] text-[#101928] tracking-[-.4px] leading-[1.75rem] font-[500]'>
													{itemChild?.title}
												</h4>
												<p className='text-[#667185] text-[.875rem] font-[400] leading-[1.25rem]'>
													{itemChild?.content}
												</p>
											</div>
										</div>
									)
								)}
							</div>
						))}
					</div>
				</div>
				<figure className='w-[47%]'>
					<img
						src={`/images/giveback-img-1.png`}
						alt='Giveback Image 1'
					/>
				</figure>
			</section>

			<section className='max-w-[1300px] pb-[6rem] mx-auto w-[90%]'>
				<div className='mb-[2rem] w-fit mx-auto'>
					<Chip name='How It Works' />
				</div>
				<h2 className='text-center text-[#101928] tracking-[-.88px] leading-[3rem] font-[600] text-[2.75rem] mb-[4rem]'>
					Turning Support into Success
				</h2>
				<div className='flex gap-[2rem]'>
					{[
						{
							direction: 'column',
							icon: 'hugeicons:medal-02',
							title: 'Inspire Through Identity',
							content: `Your name proudly appears on the dashboard of every child or student you sponsor as their unique ID, a symbol of hope that reminds them someone believes in their potential.`,
						},
						{
							direction: 'column-reverse',
							icon: 'hugeicons:medal-02',
							title: 'Inspire Through Identity',
							content: `Your name proudly appears on the dashboard of every child or student you sponsor as their unique ID, a symbol of hope that reminds them someone believes in their potential.`,
						},
						{
							direction: 'column',
							icon: 'hugeicons:medal-02',
							title: 'Inspire Through Identity',
							content: `Your name proudly appears on the dashboard of every child or student you sponsor as their unique ID, a symbol of hope that reminds them someone believes in their potential.`,
						},
					]?.map((item, index) => (
						<div
							style={{
								flexDirection: item?.direction as 'column' | 'column-reverse',
							}}
							key={`__item__card__${index}`}
							className='flex flex-col h-[28.9375rem] flex-1 gap-[1.5rem]'
						>
							<div className='flex flex-col gap-[2rem]'>
								<span
									style={{
										boxShadow:
											'0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)',
									}}
									className='p-[.75rem] rounded-[.5rem] w-fit border-[2px] border-[#DBEDFF] bg-[#007FFF]'
								>
									<Icon
										icon={item?.icon!}
										height={'1.25rem'}
										width={'1.25rem'}
										color='#FFFFFF'
									/>
								</span>
								<div className='flex flex-col gap-[.5rem]'>
									<h4 className='text-[1.25rem] text-[#101928] tracking-[-.4px] leading-[1.75rem] font-[500]'>
										{item?.title}
									</h4>
									<p className='text-[#667185] text-[.875rem] font-[400] leading-[1.25rem]'>
										{item?.content}
									</p>
								</div>
							</div>
							<figure
								style={{
									backgroundImage: `url(/images/giveback-img-${index + 2}.jpg)`,
								}}
								className='flex-1 w-full bg-cover rounded-[.75rem] overflow-hidden bg-center'
							/>
						</div>
					))}
				</div>
			</section>

			<CTA
				title='Be the Reason Someone Excels'
				content='Our dedication, honesty and transparency has earned us successful and well-cherished partners.'
			/>
		</main>
	);
};

export default GiveBack;
