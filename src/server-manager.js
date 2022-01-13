import { uid } from './uid';

/** @param {NS} ns **/
export async function main(ns) {
	if (!ns.args.length) {
		ns.args.push('n00dles');
	}

	const server_manager = new ServerManager(ns);
	await server_manager.init();

	while (true) {
		await server_manager.update();
		ns.print('Waiting 1 min');
		await ns.sleep(60000);
	}
}

class ServerManager {
	/** @param {NS} ns **/
	ns;
	target;

	/** @param {NS} ns **/
	constructor(ns) {
		this.ns = ns;
		this.target = ns.args[0];
	}

	async init() {
		this.ns.disableLog('ALL');
		this.ns.print('Initialising Server Manager');

		const servers = this.ns.getPurchasedServers();
		this.ns.print(`Found ${servers.length} servers`);

		for (const host of servers) {
			await this.reset(host);
		}
	}

	async upgrade() {
		const servers = this.ns.getPurchasedServers();

		for (const host of servers) {
			const ram = this.ns.getServerMaxRam(host);
			const max_ram = this.ns.getPurchasedServerMaxRam();

			if (max_ram > ram && this.purchase()) {
				this.ns.deleteServer(host);
			}
		}
	}

	async update() {
		await this.upgrade();

		const servers = this.ns.getPurchasedServers();
		const servers_max = this.ns.getPurchasedServerLimit();

		if (servers_max == servers.length) return;

		const host = await this.purchase();
		if (!host) return;

		this.ns.print(`Bought Server ${host}`);
		await this.reset(host);
	}

	async purchase() {
		let max_ram = 0;

		for (let i = 1; i <= 20; i++) {
			let ram = Math.pow(2, i);

			const money = this.ns.getServerMoneyAvailable("home");
			const cost = this.ns.getPurchasedServerCost(ram);

			if (cost > money) break;
			max_ram = ram;
		}

		if (max_ram == 0) return;

		const name = uid(10);
		const host = this.ns.purchaseServer(name, max_ram);

		return host;
	}

	async reset(host) {
		const script = "hack.js";

		this.ns.print(`Resetting server ${host} to attack ${this.target}`);
		this.ns.killall(host);

		await this.ns.scp(script, "home", host);

		const ram = this.ns.getServerMaxRam(host);
		const required_ram = this.ns.getScriptRam(script, host);
		const threads = ram / required_ram;

		this.ns.exec(script, host, threads, this.target);
		this.ns.print(`Running ${script} on server ${host} targeting ${this.target}`);
	}
}
