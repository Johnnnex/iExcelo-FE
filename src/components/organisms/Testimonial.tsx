/* eslint-disable react-hooks/exhaustive-deps */
'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '../atoms';

// Dummy data
const testimonials = [
	{
		quote:
			'Great job, with iExcelo I blast my WASSCE with A1 Parallel after i used it for my exam revision. Thank you for the great job here.',
		name: 'Jacob Ramsey',
		role: 'WASSCE Student',
	},
	{
		quote:
			'iExcelo transformed my study habits completely. The practice questions were exactly what I needed to ace my exams. Highly recommend!',
		name: 'Sarah Johnson',
		role: 'JAMB Candidate',
	},
	{
		quote:
			'I was struggling with Mathematics until I found iExcelo. The step-by-step solutions helped me understand concepts I thought were impossible.',
		name: 'Michael Okonkwo',
		role: 'SS3 Student',
	},
	{
		quote:
			"Best exam prep platform I've ever used. The mock tests gave me the confidence I needed to excel in my actual exams.",
		name: 'Fatima Ahmed',
		role: 'NECO Student',
	},
	{
		quote:
			"Thanks to iExcelo, I improved my grades from C's to A's in just three months. The personalized study plans made all the difference.",
		name: 'David Mensah',
		role: 'WASSCE Graduate',
	},
];

const Testimonial = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [fade, setFade] = useState(true);

	// Auto-rotate testimonials every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			handleNext();
		}, 5000);

		return () => clearInterval(interval);
	}, [currentIndex]);

	const handleTransition = (newIndex: number) => {
		setFade(false);
		setTimeout(() => {
			setCurrentIndex(newIndex);
			setFade(true);
		}, 300);
	};

	const handleNext = () => {
		const newIndex = (currentIndex + 1) % testimonials.length;
		handleTransition(newIndex);
	};

	const handlePrev = () => {
		const newIndex =
			(currentIndex - 1 + testimonials.length) % testimonials.length;
		handleTransition(newIndex);
	};

	const currentTestimonial = testimonials[currentIndex];

	return (
		<section className='flex lg:gap-[5.25rem] md:gap-[2rem] gap-[1rem] flex-col lg:flex-row my-[.375rem] items-center'>
			<Button
				className='lg:block hidden'
				style={{ borderRadius: '50%', aspectRatio: '1/1' }}
				onClick={handlePrev}
				data-aos='fade-right'
				data-aos-duration='600'
			>
				<Icon
					icon={'hugeicons:arrow-left-02'}
					width={'1.5rem'}
					height={'1.5rem'}
					color='#fff'
				/>
			</Button>
			<div
				className='relative z-[1]'
				data-aos='fade-up'
				data-aos-duration='800'
			>
				<div
					style={{
						boxShadow:
							'0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)',
					}}
					className='bg-[#fff] border-[.833px] max-w-[90%] md:max-w-[100%] mx-auto border-[#DCDFE4] rounded-[1rem] p-[2.5rem_.75rem] md:p-[5rem_2.4375rem] flex-1'
				>
					<div
						style={{
							opacity: fade ? 1 : 0,
							transition: 'opacity 300ms ease-in-out',
						}}
					>
						<h3 className='md:text-[2.25rem] text-[2rem] font-[600] text-[#101928] tracking-[-.64px] md:tracking-[-.72px] leading-[2.5rem] md:leading-[2.75rem]'>
							&ldquo;{currentTestimonial.quote}&rdquo;
						</h3>
						<span className='block h-[1px] bg-[#DCDFE4] w-full my-[2.5rem]' />
						<div className='flex gap-[0.9375rem] items-center'>
							<img
								src={`/images/avatar.png`}
								alt='Avatar'
								loading='lazy'
								className='h-[4rem] w-[4rem]'
							/>
							<div className='flex flex-col gap-[.25rem]'>
								<span className='leading-[2rem] font-[500] text-[1.5rem] tracking-[-.48px]'>
									{currentTestimonial.name}
								</span>
								<span className='leading-[1.75rem] tracking-[-.4px] text-[#98A2B3] font-[500] text-[1.25rem]'>
									{currentTestimonial.role}
								</span>
							</div>
						</div>
					</div>

					<div className='absolute bg-[#E6F2FF] testimonial-box border border-[#39F] md:left-[-2.25rem] left-0 top-[2rem] z-[-1] rounded-[.84375rem]' />
				</div>
			</div>
			<Button
				className='lg:block hidden'
				style={{ borderRadius: '50%', aspectRatio: '1/1' }}
				onClick={handleNext}
				data-aos='fade-left'
				data-aos-duration='600'
			>
				<Icon
					icon={'hugeicons:arrow-right-02'}
					width={'1.5rem'}
					height={'1.5rem'}
					color='#fff'
				/>
			</Button>

			<div
				className='flex items-center justify-between md:w-[12rem] w-[8.5rem] lg:hidden'
				data-aos='fade-up'
				data-aos-duration='600'
				data-aos-delay='100'
			>
				<Button
					style={{ borderRadius: '50%', aspectRatio: '1/1' }}
					onClick={handlePrev}
				>
					<Icon
						icon={'hugeicons:arrow-left-02'}
						// width={'.8125rem'}
						// height={'.8125rem'}
						color='#fff'
					/>
				</Button>
				<Button
					style={{ borderRadius: '50%', aspectRatio: '1/1' }}
					onClick={handleNext}
				>
					<Icon
						icon={'hugeicons:arrow-right-02'}
						// width={'.8125rem'}
						// height={'.8125rem'}
						color='#fff'
					/>
				</Button>
			</div>
		</section>
	);
};

export { Testimonial };
