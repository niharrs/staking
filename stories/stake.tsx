import { useStaker } from '../source/react';
import { useEvm } from '@decentology/hyperverse-evm/react';
// import './style.css';
import { ReactElement } from 'react';
import React from 'react';

export const Stake = ({ ...props }): ReactElement => {
	const { stake } = useStaker();
	const { Connect } = useEvm();

	return (
		<>
			<Connect />
			<button
				type="button"
				className={['storybook-button', `storybook-button--large`].join(' ')}
				style={{ color: 'blue' }}
				onClick={() => {
					stake?.();
				}}
			>
				Stake
			</button>
		</>
	);
};
