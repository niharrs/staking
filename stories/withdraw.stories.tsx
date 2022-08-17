import { Withdraw } from './withdraw';
import { HyperverseProvider } from './utils/Provider';
import { ComponentMeta, ComponentStoryFn } from '@storybook/react';
import { hyperverseDecorator } from './utils/decorators';
import Doc from '../docs/stake.mdx';
import React from 'react';

export default {
	title: 'Components/Withdraw',
	component: Withdraw,
	parameters: {
		docs: {
			page: Doc,
		},
	},
	decorators: [hyperverseDecorator],
} as ComponentMeta<typeof Withdraw>;

export const Demo: ComponentStoryFn<typeof Withdraw> = (args) => (
	<HyperverseProvider>
		<Withdraw {...args} />
	</HyperverseProvider>
);

Demo.args = {
    account: '0x976EA74026E726554dB657fA54763abd0C3a0aa9'
};
