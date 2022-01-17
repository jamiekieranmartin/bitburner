/** @param {NS} ns **/
export async function main(ns) {
	const node_manager = new NodeManager(ns);
	node_manager.init();

	while (true) {
		node_manager.update();
		ns.print('Waiting 1 sec');
		await ns.sleep(1000);
	}
}

class NodeManager {
	/** @param {NS} ns **/
	ns;

	/** @param {NS} ns **/
	constructor(ns) {
		this.ns = ns;
	}

	init() {
		this.ns.disableLog('ALL');
		this.ns.print('Initialising Node Manager');

		const nodes_owned = this.ns.hacknet.numNodes();
		this.ns.print(`Found ${nodes_owned} nodes`);
	}

	upgrade() {
		const nodes_owned = this.ns.hacknet.numNodes();

		for (let id = 0; id < nodes_owned; id++) {
			this.buyWhilePossible(id, this.ns.hacknet.getLevelUpgradeCost, this.ns.hacknet.upgradeLevel);
			this.buyWhilePossible(id, this.ns.hacknet.getCoreUpgradeCost, this.ns.hacknet.upgradeCore);
			this.buyWhilePossible(id, this.ns.hacknet.getRamUpgradeCost, this.ns.hacknet.upgradeRam);
		}
	}

	buyWhilePossible(id, costFn, buyFn) {
		let cost = costFn(id, 1);

		while (this.affordable(cost) && buyFn(id, 1)) {
			this.ns.print(`Upgraded node ${id}`);
			cost = costFn(id, 1);
		};
	}

	update() {
		const nodes_owned = this.ns.hacknet.numNodes();
		const nodes_max = this.ns.hacknet.maxNumNodes();

		if (nodes_max == nodes_owned) return;

		const id = this.purchase();
		if (!id) return;

		this.ns.print(`Bought node ${id}`);

		this.upgrade();
	}

	purchase() {
		const cost = this.ns.hacknet.getPurchaseNodeCost();
		if (!this.affordable(cost)) return;

		const id = this.ns.hacknet.purchaseNode();
		if (id == -1) return;
		return id;
	}

	affordable(cost) {
		const allowance = 0.15;
		const money = this.ns.getServerMoneyAvailable("home") * allowance;
		return cost < money;
	}
}
