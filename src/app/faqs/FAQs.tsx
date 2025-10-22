'use client';

import { CTA } from '@/components/organisms';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';

const FAQs = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [activeCategory, setActiveCategory] = useState<string>('general');

	const categories = [
		'general',
		'exam-revision-platform',
		'give-back',
		'affiliate-program',
	];

	const faqData = [
		{
			id: 1,
			category: 'general',
			question: 'What is iExcelo?',
			answer:
				'iExcelo is a comprehensive educational platform designed to help students excel in their academic pursuits through innovative learning tools and resources.',
		},
		{
			id: 2,
			category: 'general',
			question: 'How do I create an account?',
			answer:
				'You can create an account by clicking the sign-up button on our homepage and filling in your details. The process takes less than 2 minutes.',
		},
		{
			id: 3,
			category: 'general',
			question: 'Is iExcelo free to use?',
			answer:
				'We offer both free and premium plans. The free plan gives you access to basic features, while premium unlocks advanced tools and exclusive content.',
		},
		{
			id: 4,
			category: 'general',
			question: 'What devices can I use iExcelo on?',
			answer:
				'iExcelo works seamlessly on all devices including desktop computers, tablets, and smartphones. Our platform is fully responsive and optimized for all screen sizes.',
		},
		{
			id: 5,
			category: 'exam-revision-platform',
			question: 'What is iExcelo Exam Revision all about?',
			answer:
				'It is an exam revision platform for final primary, secondary, and pre-university examinations. It provides expert solutions and explanations to numerous past questions for the above-level exams. It also gives concise but well-explanatory summaries for every topic addressed by every question. It is a single and only last stop for exam success.',
		},
		{
			id: 6,
			category: 'exam-revision-platform',
			question: 'Which exam bodies are covered?',
			answer:
				'We cover major exam bodies including WAEC, NECO, JAMB, BECE, and other regional examination boards. Our content is regularly updated to match current syllabi.',
		},
		{
			id: 7,
			category: 'exam-revision-platform',
			question: 'How many past questions are available?',
			answer:
				'Our platform hosts over 50,000 past questions spanning the last 15 years across all major subjects. New questions are added regularly as they become available.',
		},
		{
			id: 8,
			category: 'exam-revision-platform',
			question: 'Can I practice offline?',
			answer:
				'Yes! Premium users can download question sets and study materials for offline practice. This ensures you can continue learning even without internet access.',
		},
		{
			id: 9,
			category: 'give-back',
			question: 'What is the Give Back initiative?',
			answer:
				'Our Give Back program provides free access to underprivileged students and sponsors educational resources in underserved communities across Africa.',
		},
		{
			id: 10,
			category: 'give-back',
			question: 'How can I contribute to Give Back?',
			answer:
				"You can contribute by donating directly through our platform, volunteering as a tutor, or sponsoring a student. Every contribution makes a real difference in a student's life.",
		},
		{
			id: 11,
			category: 'give-back',
			question: 'Who benefits from the Give Back program?',
			answer:
				'The program benefits students from low-income families, orphanages, and rural communities who lack access to quality educational resources.',
		},
		{
			id: 12,
			category: 'affiliate-program',
			question: 'How does the affiliate program work?',
			answer:
				'Our affiliate program allows you to earn commission by referring new users to iExcelo. You receive a unique referral link and earn up to 30% commission on qualifying sales.',
		},
		{
			id: 13,
			category: 'affiliate-program',
			question: 'What are the payout terms?',
			answer:
				'Payouts are processed monthly once you reach the minimum threshold of $50. Payments are made via bank transfer or PayPal within 7 business days.',
		},
		{
			id: 14,
			category: 'affiliate-program',
			question: 'Can schools join the affiliate program?',
			answer:
				'Absolutely! We have special partnership terms for schools and educational institutions. Contact our partnerships team for customized commission structures.',
		},
		{
			id: 15,
			category: 'affiliate-program',
			question: 'How do I track my referrals?',
			answer:
				'You get access to a comprehensive dashboard that shows real-time statistics including clicks, conversions, and earnings. You can track everything from your affiliate portal.',
		},
	];

	const formatCategoryName = (category: string) => {
		return category
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const filteredFAQs = faqData.filter((faq) => faq.category === activeCategory);

	return (
		<main className='bg-white'>
			<section className='bg-[url(/images/background-pattern-3.png)] bg-center bg-cover justify-center flex-col gap-[1rem] flex items-center h-[100vh]'>
				<h2 className='text-[3.25rem] text-center leading-[3.5rem] tracking-[-1.04px] font-[600] text-[#101928]'>
					Frequently Asked Questions
				</h2>
				<p className='text-[#98A2B3] text-center font-[500] max-w-[50rem] tracking-[-.4px] text-[1.25rem] leading-[1.75rem] mb-[4rem]'>
					Everything you need to know about the product and its benefits. Can&apos;t
					find the answer you&apos;re looking for?{' '}
					<a
						href=''
						className='text-[#E32E89] underline'
					>
						Please contact our friendly team.
					</a>
				</p>
			</section>
			<section className='py-[6rem] max-w-[1300px] items-start justify-between mx-auto w-[90%] flex gap-[2rem]'>
				<div className='flex sticky top-[3rem] gap-[1.5rem] w-[100%] flex-col max-w-[17.125rem]'>
					{categories.map((category, index) => (
						<button
							className={`pl-[.875rem] transition-colors duration-[.4s] text-left border-l-[2px] ${
								activeCategory === category
									? 'border-[#007FFF] text-[#007FFF]'
									: 'border-transparent text-[#98A2B3]'
							} py-[.3rem] font-[500] text-[1.25rem] leading-[1.75rem] tracking-[-.4px] cursor-pointer w-full hover:bg-[#00000010]`}
							key={`__button__item__deet__${index}__`}
							onClick={() => {
								setActiveCategory(category);
								setOpenIndex(null);
							}}
						>
							{formatCategoryName(category)}
						</button>
					))}
				</div>
				<div className='max-w-[51.75rem] w-[100%] flex flex-col gap-[1rem]'>
					{filteredFAQs.map((faq, index) => (
						<button
							key={faq.id}
							onClick={() => {
								setOpenIndex(openIndex === index ? null : index);
							}}
							className={`p-[2rem] text-left cursor-pointer transition-colors duration-[.4s] hover:bg-[#F9FAFB] rounded-[1rem] ${
								openIndex === index ? 'bg-[#F9FAFB]' : ''
							}`}
						>
							<div className='flex justify-between cursor-pointer items-center w-full'>
								<div
									className={`flex gap-4 border-[#EDEDED] ${
										openIndex === index ? 'text-[#007FFF]' : 'text-[#2B2B2B]'
									} text-[1.125rem] leading-[1.75rem] font-medium pr-4`}
								>
									<span>{faq.question}</span>
								</div>
								<Icon
									icon={
										openIndex === index
											? 'hugeicons:minus-sign-circle'
											: 'hugeicons:plus-sign-circle'
									}
									height='1.625rem'
									width='1.625rem'
									color={openIndex === index ? '#007FFF' : '#D6D6D6'}
									className='flex-shrink-0 transition-all duration-300'
								/>
							</div>

							<div
								className={`overflow-hidden transition-all duration-300 ease-in-out ${
									openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
								}`}
							>
								<p className='text-[#98A2B3] pt-[.625rem] leading-[1.5rem] font-[400] text-[1rem]'>
									{faq.answer}
								</p>
							</div>
						</button>
					))}
				</div>
			</section>

			<CTA />
		</main>
	);
};

export default FAQs;
