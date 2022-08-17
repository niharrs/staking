import { TimeLeft } from './timeLeft';
import { HyperverseProvider } from './utils/Provider';
import { ComponentMeta, ComponentStoryFn } from '@storybook/react';
// import Doc from '../docs/getBaseURI.mdx';
import React from 'react';

export default {
	title: 'Components/TimeLeft',
	component: TimeLeft,
	// parameters: {
	// 	docs: {
	// 		page: Doc,
	// 	},
	// },
} as ComponentMeta<typeof TimeLeft>;

const Template: ComponentStoryFn<typeof TimeLeft>= (args) => (
	<HyperverseProvider>
		<TimeLeft {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {};
