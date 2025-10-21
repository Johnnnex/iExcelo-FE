import { Icon } from '@iconify/react';
import React from 'react';

const Chip = ({ name, iconPath }: { name: string; iconPath?: string }) => {
	return (
		<div className='flex p-[.5rem_.75rem] items-center w-fit rounded-[1rem] gap-[.5rem] border border-[#F6BEDA] bg-[#FCEAF3]'>
			{iconPath && (
				<Icon
					icon={iconPath}
					height={'1.25rem'}
					width={'1.25rem'}
					color='#E32E89'
				/>
			)}
			<span className='text-[#E958A1] text-[1rem] font-[500] leading-[1.5rem]'>
				{name}
			</span>
		</div>
	);
};

export default Chip;
