import { HyperverseConfig } from "@decentology/hyperverse";
import { EvmLibraryBase, getProvider } from "@decentology/hyperverse-evm";
import { ethers, BigNumber } from "ethers";
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { CancellablePromise, pseudoCancellable } from "real-cancellable-promise";
import { getEnvironment } from "./environment";

export type StakerLibraryType = Awaited<ReturnType<typeof StakerLibraryInternal>>;
export function StakerLibrary(...args: Parameters<typeof StakerLibraryInternal>): CancellablePromise<StakerLibraryType> {
	return pseudoCancellable(StakerLibraryInternal(...args));
}

async function StakerLibraryInternal(
	hyperverse: HyperverseConfig,
	providerOrSigner?: ethers.providers.Provider | ethers.Signer
) {
	const { FactoryABI, factoryAddress, ContractABI } = getEnvironment(
		hyperverse.blockchain?.name!,
		hyperverse.network
	);
	if (!providerOrSigner) {
		providerOrSigner = getProvider(hyperverse.network);
	}
	const base = await EvmLibraryBase(
		'Staker',
		hyperverse,
		factoryAddress!,
		FactoryABI,
		ContractABI,
		providerOrSigner
	);

	console.log(base);

	const stake = async() => {
		try {
			const stakeTxn = await base.proxyContract?.stake();
			return stakeTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const execute = async() => {
		try {
			const executeTxn = await base.proxyContract?.execute();
			return executeTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const withdraw = async(account: string) => {
		try {
			const withdrawTxn = await base.proxyContract?.withdraw(account);
			return withdrawTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const receive = async() => {
		try {
			const receiveTxn = await base.proxyContract?.receive();
			return receiveTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const timeLeft = async() => {
		try {
			const timeLeft = await base.proxyContract?.timeLeft();
			const time = BigNumber.from(timeLeft) as BigNumber;
			console.log("Time left: ", timeLeft.toNumber());
			console.log("Time: ", time);
			return time;
		} catch (error) {
			throw error;
		}
	};

	return {
		...base,
		stake,
		execute,
		withdraw,
		receive,
		timeLeft
	}
}

