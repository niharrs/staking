# Stake

<p> The `stake` function from `stakerLibrary` stakes ETH in the contract. </p>

---

<br>

### Stake

<p> The `Stake` function stakes ETH in the contract. </p>

```jsx
	const stake = async() => {
		try {
			const stakeTxn = await base.proxyContract?.stake();
			return stakeTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};
```

### Stories

```jsx
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
```

### Main UI Component

```jsx
import { useStaker } from '../source/react';
import { useEvm } from '@decentology/hyperverse-evm/react';
import './style.css';
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
```

For more information about our modules please visit: [**Hyperverse Docs**](docs.hyperverse.dev)
