import { Stake } from './stake';
import { HyperverseProvider } from './utils/Provider';
import { ComponentMeta, ComponentStoryFn } from '@storybook/react';
import { hyperverseDecorator } from './utils/decorators';
import Doc from '../docs/stake.mdx';
import React from 'react';

export default {
	title: 'Components/Stake',
	component: Stake,
	parameters: {
		docs: {
			page: Doc,
		},
	},
	decorators: [hyperverseDecorator],
} as ComponentMeta<typeof Stake>;

export const Demo: ComponentStoryFn<typeof Stake> = (args) => (
	<HyperverseProvider>
		<Stake {...args} />
	</HyperverseProvider>
);

Demo.args = {
};
