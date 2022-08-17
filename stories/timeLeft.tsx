import { useStaker } from '../source/react';
//import { useEvm } from '@decentology/hyperverse-evm/react';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import React from 'react';

export const TimeLeft = ({ ...props }) => {
	const staker = useStaker();
	// const { address } = useEvm();
	const [data, setData] = useState<BigNumber>();

	useEffect(() => {
		if (staker.timeLeft) {
			staker.timeLeft?.().then(setData);
		}
	}, [staker.timeLeft]);

	const time = () => {
		return data ? <p>{JSON.stringify(data)}</p> : <p>{JSON.stringify(staker.error)}</p>;
	};

	return <div className="time"> Time remaning: {time()}</div>;
};
