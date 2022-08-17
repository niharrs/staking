import { StoryFn } from '@storybook/react';
import { HyperverseProvider } from './Provider';
import React from 'react';

export const hyperverseDecorator = (Story: StoryFn) => (
	<HyperverseProvider>
		<Story />
	</HyperverseProvider>
);
