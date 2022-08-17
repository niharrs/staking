import { FC } from 'react';
import { HyperverseModuleInstance } from '@decentology/hyperverse';
import { Staker } from './useStaker';

const Provider: FC<HyperverseModuleInstance> = ({ children, tenantId }) => {
	if (!tenantId) {
		throw new Error('Tenant ID is required');
	}
	return (
			<Staker.Provider initialState={{ tenantId: tenantId }}>{children}</Staker.Provider>
	);
};

export { Provider };
