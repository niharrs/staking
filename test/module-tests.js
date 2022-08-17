const { ethers } = require('hardhat');
const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { utils } = require('ethers');

describe('Staker', function () {
	let stakerctr;
	let Staker;
	let StakerFactory;
	let stakerfactoryCtr;
	let alice;
	let aliceProxyContract;
	let bob;
	let cara;

	beforeEach(async () => {
		Staker = await ethers.getContractFactory('Staker');
		[owner, alice, bob, cara] = await ethers.getSigners();
		stakerctr = await Staker.deploy(owner.address, owner.address);
		await stakerctr.deployed();

		StakerFactory  = await ethers.getContractFactory('StakerFactory');
		stakerfactoryCtr = await StakerFactory.deploy(stakerctr.address, owner.address);
		await stakerfactoryCtr.deployed();

		await stakerfactoryCtr.connect(alice).createInstance(alice.address);
		aliceProxyContract = await Staker.attach(await stakerfactoryCtr.getProxy(alice.address));
	});

	it('Master Contract should match Staker Contract', async function () {
		const time = await stakerctr.timeLeft();
		// const time1 = await stakerfactoryCtr.timeLeft();
		console.log(time);
		console.log(stakerfactoryCtr.address);
		console.log(stakerctr.address);
		console.log(aliceProxyContract.address);
		expect(await stakerfactoryCtr.masterContract()).to.equal(stakerctr.address);
	});
});
