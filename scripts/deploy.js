const hre = require('hardhat');
const fs = require('fs-extra');
const { constants } = require('ethers');

const main = async () => {
	const [deployer] = await ethers.getSigners();
	console.log('Deployer Address: ', deployer.address);
	const hyperverseAdmin = deployer.address;
	console.log('Deploying contracts with the account:', deployer.address);
	console.log('Account balance:', (await deployer.getBalance()).toString());

	const ExampleExternalContract = await hre.ethers.getContractFactory('ExampleExternalContract');
	const exampleExternalContract = await ExampleExternalContract.deploy();

	const Staker = await hre.ethers.getContractFactory('Staker');
	const stakerContract = await Staker.deploy(hyperverseAdmin, exampleExternalContract.address);
	await stakerContract.deployed();
	console.log('Staker Contract deployed to: ', stakerContract.address);

	const StakerFactory = await hre.ethers.getContractFactory('StakerFactory');
	const stakerFactory = await StakerFactory.deploy(stakerContract.address, hyperverseAdmin);
	await stakerFactory.deployed();

	console.log(`[${hre.network.name}] Staker Contract deployed to: ${stakerContract.address}`);
	console.log(`[${hre.network.name}] Staker Factory deployed to: ${stakerFactory.address}`);

	const env = JSON.parse(fs.readFileSync('contracts.json').toString());
	env[hre.network.name] = env[hre.network.name] || {};
	env[hre.network.name].testnet = env[hre.network.name].testnet || {};

	env[hre.network.name].testnet.contractAddress = stakerContract.address;
	env[hre.network.name].testnet.factoryAddress = stakerFactory.address;

	// Save contract addresses back to file
	fs.writeJsonSync('contracts.json', env, { spaces: 2 });

	// Deploy default tenant
	let proxyAddress = constants.AddressZero;
	await stakerFactory.createInstance(deployer.address);
	while (proxyAddress === constants.AddressZero) {
		proxyAddress = await stakerFactory.getProxy(deployer.address);
	}
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

runMain();
