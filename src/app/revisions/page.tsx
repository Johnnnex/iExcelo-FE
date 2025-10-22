import { Button, Chip } from '@/components/atoms';
import { Icon } from '@iconify/react';
import React from 'react';

const Revisions = () => {
	return (
		<main className='bg-white'>
			<section className='bg-[url(/images/background-pattern-3.png)] bg-center bg-cover flex items-center justify-center h-[100vh]'>
				<div className='flex flex-col gap-[1rem] items-center'>
					<Chip name='iExcelo Exam Revision' />
					<h1 className='text-[3.25rem] font-[600] leading-[3.5rem] text-[#101928] tracking-[-1.04px] max-w-[40rem] mx-auto text-center'>
						Your Smart Companion for Exam Success
					</h1>
					<div className='flex flex-col gap-[1.5rem]'>
						<p className='text-[1.25rem] font-[500] leading-[1.75rem] tracking-[-.4px] max-w-[40rem] mx-auto text-center text-[#98A2B3]'>
							Master every topic, one question at a time. iExcelo&apos;s Exam Revision
							feature gives you access to expertly curated past questions, smart
							explanations, and topic summaries, everything you need to prepare
							confidently and excel in any exam.
						</p>
						<Button style={{ width: 'fit-content', marginInline: 'auto' }}>
							Start Revising Now
							<Icon
								icon='hugeicons:arrow-right-02'
								height={'1.5rem'}
								width={'1.5rem'}
							/>
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Revisions;
