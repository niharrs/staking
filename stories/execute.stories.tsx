import { Execute } from './execute';
import { HyperverseProvider } from './utils/Provider';
import { ComponentMeta, ComponentStoryFn } from '@storybook/react';
import { hyperverseDecorator } from './utils/decorators';
import Doc from '../docs/stake.mdx';
import React from 'react';

export default {
	title: 'Components/Execute',
	component: Execute,
	parameters: {
		docs: {
			page: Doc,
		},
	},
	decorators: [hyperverseDecorator],
} as ComponentMeta<typeof Execute>;

export const Demo: ComponentStoryFn<typeof Execute> = (args) => (
	<HyperverseProvider>
		<Execute {...args} />
	</HyperverseProvider>
);

Demo.args = {
};
