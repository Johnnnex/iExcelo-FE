import React from 'react';
import { Button } from '../atoms';
import { Icon } from '@iconify/react';

const CTA = ({
	title = 'Your Journey to Excellence Starts Now',
	content = 'Revise smarter, support others through giveback, and unlock new opportunities with our affiliate program',
}: {
	title?: string;
	content?: string;
}) => {
	return (
		<section className='py-[6rem] max-w-[1300px] mx-auto w-[90%]'>
			<div className='bg-[url(/images/background-pattern-2.png)] bg-cover rounded-[2rem] bg-center'>
				<div className='py-[5.5rem] flex flex-col items-center mx-auto w-[70%] text-white'>
					<h3 className='mb-[.5rem] leading-[3rem] text-center tracking-[-.8px] font-[600] text-[2.5rem]'>
						{title}
					</h3>
					<p className='mb-[2rem] leading-[1.75rem] text-center text-[1.125rem] font-[400]'>
						{content}
					</p>
					<Button>
						Join Now
						<Icon
							icon='hugeicons:arrow-right-02'
							height={'1.5rem'}
							width={'1.5rem'}
						/>
					</Button>
				</div>
			</div>
		</section>
	);
};

export { CTA };
