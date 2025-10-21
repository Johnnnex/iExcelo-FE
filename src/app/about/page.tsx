/* eslint-disable @next/next/no-img-element */
import Button from '@/components/atoms/Button';
import Chip from '@/components/atoms/Chip';
import SVGClient from '@/components/atoms/SVGClient';
import CTA from '@/components/organisms/CTA';
import { Icon } from '@iconify/react';
import { Metadata } from 'next';
import React, { Fragment } from 'react';

export const metadata: Metadata = {
	title: 'iExcelo - About',
};

const About = () => {
	return (
		<main className='bg-white'>
			<section className='bg-[url(/images/background-pattern-3.png)] bg-center bg-cover flex items-center h-[100vh]'>
				<div className='max-w-[1300px] w-[90%] flex items-center justify-between gap-[2.3125rem] mx-auto'>
					<div className='w-[50%]'>
						<Chip name='About Us' />
						<h1 className='my-[1rem] text-[3.25rem] font-[600] tracking-[-1.04px] text-[#101928] leading-[3.5rem]'>
							The Journey <br /> Behind iExeclo
						</h1>
						<p className='mb-[1.5rem] text-[1.25rem] max-w-[33rem] leading-[1.75rem] tracking-[-.4px] text-[#98A2B3] font-[500]'>
							At iExcelo, we&apos;re bridging the gap between preparation and
							opportunity. Our platform gives you access to curated past questions, and
							expert-backed explanations that simplify learning. Beyond academics, our
							Giveback and Affiliate programs empower students to contribute,
							collaborate, and grow while supporting others on their journey to
							success.
						</p>
						<Button>
							Contact Us
							<Icon
								icon='hugeicons:call'
								height={'1.5rem'}
								width={'1.5rem'}
							/>
						</Button>
					</div>
					<img
						src={'/images/hero-img-3.png'}
						alt='Hero Image 3'
						className='w-[50%] h-[34.5rem]'
						loading='lazy'
					/>
				</div>
			</section>
			<section className='py-[6rem] max-w-[1300px] mx-auto w-[90%]  flex flex-col gap-[2rem] justify-end'>
				<div className='flex items-center justify-between gap-[5.125rem]'>
					<div className='w-[48%] flex flex-col gap-[1rem]'>
						{[
							{
								title: 'Exam Revision Platform',
								icon: 'exam',
								content: `At iExcelo, we're dedicated to helping students excel in their exams. Our Exam Revision Platform offers interactive study materials, practice questions, and expertly provided answers with clear explanations to help you fully understand each topic. Each question comes with a concise summary of the topic it addresses, ensuring you grasp key concepts and are ready for your exams. With 24/7 access, students can study at their own pace, boosting confidence and improving performance. Whether you're preparing for high school exams or entrance assessments, iExcelo provides the tools to help you not only pass but excel.`,
							},
							{
								title: 'Give Back Program',
								content: `iExcelo GiveBack connects generous sponsors with students in need, offering access to exam revision subscriptions, educational materials, and capital projects for schools. Whether sponsoring a student's revision or funding school improvements, your support makes a lasting impact on education. Sponsors can track progress and send encouraging messages to their beneficiaries directly through their dashboard. We believe this will encourage and motivate them to strive and become successful like you. By contributing, you're not only helping students excel but also transforming the future of education.`,
								icon: 'handheart',
							},
						]?.map((item, index) => (
							<Fragment key={`__item__${index}`}>
								<div className='flex flex-col gap-[.75rem]'>
									<span className='flex text-[#007FFF] text-[2rem] leading-[2.5rem] font-[500] tracking-[-.64px] gap-[.5rem] items-center'>
										<SVGClient src={`/svg/${item?.icon}.svg`} />
										{item?.title}
									</span>
									<p className='font-[400] text-[#667185] text-[1.125rem] leading-[1.75rem]'>
										{item?.content}
									</p>
								</div>

								{index === 0 && <div className='h-[1px] bg-[#EDEDED] w-full' />}
							</Fragment>
						))}
					</div>
					<img
						src={'/images/about-img-1.png'}
						alt='About Image 1'
						className='w-[45%] h-[34.5rem]'
						loading='lazy'
					/>
				</div>
			</section>

			<section className='py-[6rem] max-w-[1300px] mx-auto w-[90%]'>
				<div className='w-fit mx-auto mb-[2rem]'>
					<Chip name='Our Team' />
				</div>
				<h2 className='text-[2.75rem] text-center leading-[3rem] tracking-[-.88px] font-[600] text-[#101928] mb-[.5rem]'>
					Our Dedicated Team
				</h2>
				<p className='text-[#667185] text-center font-[400] text-[1.125rem] leading-[1.75rem] mb-[4rem]'>
					Meet the passionate individuals driving iExcelo&apos;s mission.
				</p>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2rem] mx-auto'>
					{[
						{
							name: 'Iranlowo J. M',
							office: 'Founder & CEO',
							qualifications: 'MBBS, MRCGP, Digital Entrepreneur',
							href: 'https://johnex.com',
						},
						{
							name: 'Funmilola C. O',
							office: 'Chief Operating Officer',
							qualifications: 'B.Sc. Biochemistry, PMP Certified',
							href: 'https://johnex.com',
						},
						{
							name: 'Kennedy C. O',
							office: 'Project and Content Manager',
							qualifications: 'B.Sc. Biology',
							href: 'https://johnex.com',
						},
					]?.map((teamDeets, index) => (
						<div
							key={`___team__deets__${index}`}
							style={{ backgroundImage: `url(/images/team-member-${index + 1}.png)` }}
							className='rounded-[1rem] overflow-hidden bg-center bg-cover relative w-full h-[30rem]'
						>
							<div className='absolute p-[0_1rem_1.5rem_1rem] bottom-0 left-0 w-full'>
								<div className='backdrop-blur-[12px] text-white p-[1.5rem_1.25rem] bg-[rgba(255,_255,_255,_0.30)] border border-[rgba(255,_255,_255,_0.50)]'>
									<div className='flex items-center justify-between mb-[1rem]'>
										<h6 className='text-[1.75rem] font-[600] tracking-[-.56px] leading-[2.25rem]'>
											{teamDeets?.name}
										</h6>
										<a
											target='_blank'
											href={teamDeets?.href}
										>
											<Icon
												icon={`hugeicons:arrow-up-right-01`}
												height={`1.5rem`}
												width={`1.5rem`}
											/>
										</a>
									</div>
									<p className='text-[1.125rem] font-[600] leading-[1.75rem] mb-[.25rem]'>
										{teamDeets?.office}
									</p>
									<p className='text-[1rem] font-[400] leading-[1.5rem]'>
										{teamDeets?.qualifications}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className='gap-[2rem] mt-[4rem] flex w-[70%] mx-auto'>
					{[
						{
							name: 'Samson O. S',
							office: 'Chief Editor',
							qualifications: 'HND Industrial Maintenance Engineering',
							href: 'https://johnex.com',
						},
						{
							name: 'Ajiboye B. O',
							office: 'Academic Director',
							qualifications: 'B.Sc. Anatony, MSc. Anatomy',
							href: 'https://johnex.com',
						},
					]?.map((teamDeets, index) => (
						<div
							key={`___team__deets__${index}`}
							style={{ backgroundImage: `url(/images/team-member-${index + 4}.png)` }}
							className='rounded-[1rem] overflow-hidden bg-center bg-cover relative w-full h-[30rem]'
						>
							<div className='absolute p-[0_1rem_1.5rem_1rem] bottom-0 left-0 w-full'>
								<div className='backdrop-blur-[12px] text-white p-[1.5rem_1.25rem] bg-[rgba(255,_255,_255,_0.30)] border border-[rgba(255,_255,_255,_0.50)]'>
									<div className='flex items-center justify-between mb-[1rem]'>
										<h6 className='text-[1.75rem] font-[600] tracking-[-.56px] leading-[2.25rem]'>
											{teamDeets?.name}
										</h6>
										<a
											target='_blank'
											href={teamDeets?.href}
										>
											<Icon
												icon={`hugeicons:arrow-up-right-01`}
												height={`1.5rem`}
												width={`1.5rem`}
											/>
										</a>
									</div>
									<p className='text-[1.125rem] font-[600] leading-[1.75rem] mb-[.25rem]'>
										{teamDeets?.office}
									</p>
									<p className='text-[1rem] font-[400] leading-[1.5rem]'>
										{teamDeets?.qualifications}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className='py-[6rem] bg-[url(/images/background-pattern-4.png)] bg-cover bg-center'>
				<div className='flex gap-[2rem] max-w-[1300px] mx-auto w-[90%] justify-between items-center'>
					<img
						src={'/images/about-img-2.png'}
						alt='About Image 2'
						className='w-[42%] aspect-square'
						loading='lazy'
					/>
					<div className='w-[45%] flex flex-col gap-[2rem]'>
						{[
							{
								title: 'Our Mission',
								icon: 'target',
								content: `We're on a mission to make quality exam preparation accessible, engaging, and meaningful. iExcelo bridges smart learning with social impact helping students achieve excellence while empowering others through our GiveBack initiative.`,
							},
							{
								title: 'Give Back Program',
								content: `We believe education should inspire, not intimidate. Our values center on excellence, empathy, and empowerment combining technology, knowledge, and community to help every learner rise and give others the chance to do the same.`,
								icon: 'binoculars',
							},
						]?.map((item, index) => (
							<Fragment key={`__item__${index}`}>
								<div className='flex flex-col gap-[.75rem]'>
									<span className='flex text-[#007FFF] text-[2rem] leading-[2.5rem] font-[500] tracking-[-.64px] gap-[.5rem] items-center'>
										<SVGClient src={`/svg/${item?.icon}.svg`} />
										{item?.title}
									</span>
									<p className='font-[400] text-[#667185] text-[1.125rem] leading-[1.75rem]'>
										{item?.content}
									</p>
								</div>

								{index === 0 && <div className='h-[1px] bg-[#EDEDED] w-full' />}
							</Fragment>
						))}
					</div>
				</div>
			</section>
			<CTA />
		</main>
	);
};

export default About;
