import { useState, useEffect, useCallback } from 'react';
import { createContainer, useContainer } from '@decentology/unstated-next';

import { useEvm } from '@decentology/hyperverse-evm/react';
import { StakerLibrary, StakerLibraryType } from '../stakerLibrary';
import { useHyperverse } from '@decentology/hyperverse/react';
import { useEventListener } from './useEventListener';

function StakerState(initialState: { tenantId: string } = { tenantId: '' }) {
	const { tenantId } = initialState;
	const { readOnlyProvider, signer } = useEvm();
	const hyperverse = useHyperverse();
	const [stakerLibrary, setStakerLibrary] = useState<StakerLibraryType>();

	useEffect(() => {
		const lib = StakerLibrary(hyperverse, signer || readOnlyProvider).then(setStakerLibrary).catch(() => {

		})
		return lib.cancel;
	}, [signer, readOnlyProvider]);

	const useStakerEvents = (eventName: string, callback: any) => {
		return useEventListener(
			eventName,
			useCallback(callback, [stakerLibrary?.proxyContract]),
			stakerLibrary?.proxyContract
		);
	};

	return {
		...stakerLibrary,
		loading: !stakerLibrary,
		tenantId,
		useStakerEvents
	};
}

export const Staker = createContainer(StakerState);

export function useStaker() {
	return useContainer(Staker);
}
