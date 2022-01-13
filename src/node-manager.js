/** @param {NS} ns **/
export async function main(ns) {
	const node_manager = new NodeManager(ns);
	node_manager.init();

	while (true) {
		node_manager.update();
		ns.print('Waiting 1 min');
		await ns.sleep(60000);
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
			const money = this.ns.getServerMoneyAvailable("home") - 5000000;
			const cost = this.ns.hacknet.getLevelUpgradeCost(id, 1);

			if (cost < money && this.ns.hacknet.upgradeLevel(id, 1)) {
				this.ns.print(`Upgraded Level for node ${id}`);
				continue;
			};
			// Core and Ram upgrades pointless for now...

			// if (this.ns.hacknet.upgradeCore(id, 1)) {
			// 	this.ns.print(`Upgraded Core for node ${id}`);
			// 	continue;
			// };
			// if (this.ns.hacknet.upgradeRam(id, 1)) {
			// 	this.ns.print(`Upgraded Ram for node ${id}`);
			// 	continue;
			// };
		}
	}

	update() {
		this.upgrade();

		const nodes_owned = this.ns.hacknet.numNodes();
		const nodes_max = this.ns.hacknet.maxNumNodes();

		if (nodes_max == nodes_owned) return;

		const id = this.purchase();
		if (!id) return;

		this.ns.print(`Bought node ${id}`);
	}

	purchase() {
		const money = this.ns.getServerMoneyAvailable("home") - 5000000;
		const cost = this.ns.hacknet.getPurchaseNodeCost();
		if (cost > money) return;

		const id = this.ns.hacknet.purchaseNode();
		if (id == -1) return;
		return id;
	}
}
