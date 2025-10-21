'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Chip from '../atoms/Chip';

const FaqV1 = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const faqs = [
		{
			id: 1,
			question: 'What is iExcelo Exam Revision all about?',
			answer: `It is an exam revision platform for final primary, secondary, and pre-university examinations. It provides expert solutions and explanations to numerous past questions for the above-level exams. It also gives concise but well-explanatory summaries for every topic addressed by every question. It is a single and only last stop for exam success.`,
		},
		{
			id: 2,
			question: 'Who can use iExcelo Exam Revision Platform?',
			answer:
				"The iExcelo Exam Revision Platform is designed for students at various educational levels, including secondary school, high school, and preparation for standardized tests. Whether you're studying for GCSEs, A-Levels, SATs, or other major examinations, our platform provides tailored content to match your needs. Teachers and tutors can also use our platform to supplement their teaching materials and track student progress.",
		},
		{
			id: 3,
			question: 'How much does it cost to use iExcelo exam revision?',
			answer:
				'iExcelo offers flexible pricing plans to suit different needs and budgets. We have a free tier that provides access to basic study materials and limited practice questions. Our premium subscription starts at $9.99/month for individual students, with discounted annual plans available at $89.99/year. We also offer family plans and institutional licenses for schools. Students can try our premium features with a 14-day free trial before committing to a subscription.',
		},
		{
			id: 4,
			question: 'What is iExcelo GiveBack Platform?',
			answer:
				"The iExcelo GiveBack Platform is our community-driven initiative that allows experienced students, educators, and subject matter experts to contribute educational content and help fellow learners. It's built on the principle of knowledge sharing, where contributors can create study guides, practice questions, and tutorial videos. Contributors earn rewards and recognition within our community while making quality education more accessible to students worldwide.",
		},
		{
			id: 5,
			question: 'How can I become a member of iExcelo GiveBack Team?',
			answer:
				"Becoming a member of the iExcelo GiveBack Team is straightforward. First, create an account on our platform and complete your profile with your educational background and areas of expertise. Then, apply through the GiveBack section by submitting sample content that demonstrates your teaching ability and subject knowledge. Our team reviews applications within 5-7 business days. Once approved, you'll gain access to our content creation tools and community forums, and you can start contributing immediately.",
		},
		{
			id: 6,
			question: 'How can I earn money with iExcelo?',
			answer:
				'There are several ways to earn money with iExcelo. As a GiveBack Team member, you earn revenue based on the popularity and usage of your contributed content. We operate on a fair revenue-sharing model where creators receive a percentage of subscription fees attributed to their materials. Additionally, highly-rated contributors can become verified tutors on our platform, offering one-on-one sessions at their own rates. Top contributors also receive bonuses, prizes, and opportunities for sponsored content creation.',
		},
		{
			id: 7,
			question: 'How does iExcelo GiveBack work?',
			answer:
				'iExcelo GiveBack operates on a collaborative content creation model. Contributors submit educational materials through our platform, which undergo a quality review process by our academic team. Once approved, content is made available to students using the platform. We track engagement metrics such as views, completion rates, and student feedback. Contributors are compensated based on these metrics through our revenue-sharing program. The platform also features a rating system where students can review content, helping to highlight the most effective learning materials and rewarding quality contributions.',
		},
	];

	return (
		<section className='py-20 max-w-[1300px] flex justify-between items-start mx-auto w-[90%] bg-white gap-12'>
			<div className='w-[40%] sticky top-12'>
				<Chip
					name='FAQs'
					iconPath='hugeicons:bubble-chat-question'
				/>
				<h2 className='text-5xl mt-8 leading-tight tracking-tight font-semibold text-[#101928] mb-2'>
					Got Questions? We&apos;ve Got Answers
				</h2>
				<p className='text-[#667185] font-normal text-lg leading-7 mb-10'>
					If you have any additional questions or need further clarifications,
					don&apos;t hesitate to get in touch with us. We&apos;re here to help you!
				</p>
			</div>

			<div
				style={{
					boxShadow:
						'0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)',
				}}
				className='border border-[#DCDFE4] py-1 rounded-[2rem] w-[53%] overflow-hidden'
			>
				{faqs.map((faq, index) => (
					<div
						key={faq.id}
						className='border-b border-[#DCDFE4] last:border-b-0'
					>
						<button
							onClick={() => {
								setOpenIndex(openIndex === index ? null : index);
							}}
							className='flex justify-between cursor-pointer items-center w-full py-7 px-6 text-left hover:bg-[#F9FAFB] transition-colors duration-200'
						>
							<div
								className={`flex gap-4 ${
									openIndex === index ? 'border-b' : ''
								} border-[#EDEDED] -mb-7 pb-7 ${
									openIndex === index ? 'text-[#007FFF]' : 'text-[#2B2B2B]'
								} text-[1.25rem] leading-[1.75rem] font-medium pr-4`}
							>
								<span>{String(faq.id).padStart(2, '0')}</span>
								<span>{faq.question}</span>
							</div>
							<Icon
								icon={
									openIndex === index
										? 'hugeicons:minus-sign-circle'
										: 'hugeicons:plus-sign-circle'
								}
								height='2rem'
								width='2rem'
								color={openIndex === index ? '#007FFF' : '#D6D6D6'}
								className='flex-shrink-0 transition-all duration-300'
							/>
						</button>

						<div
							className={`overflow-hidden transition-all duration-300 ease-in-out ${
								openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
							}`}
						>
							<p className='text-[#757575] p-[1rem_1.5rem_1.5rem_1.5rem] leading-[1.75rem] font-[400] text-[1.125rem]'>
								{faq.answer}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default FaqV1;
