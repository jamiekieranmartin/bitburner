/** @param {NS} ns **/
export async function main(ns) {
	const root_manager = new RootManager(ns);
	await root_manager.init();

	while (true) {
		await root_manager.update();
		ns.print("Waiting 1 min");
		await ns.sleep(60000);
	}
}

class RootManager {
	/** @param {NS} ns **/
	ns;
	executables;

	/** @param {NS} ns **/
	constructor(ns) {
		this.ns = ns;

		this.executables = [
			{ file: "BruteSSH.exe", execute: this.ns.brutessh },
			{ file: "FTPCrack.exe", execute: this.ns.ftpcrack },
			{ file: "relaySMTP.exe", execute: this.ns.relaysmtp },
			{ file: "HTTPWorm.exe", execute: this.ns.httpworm },
			{ file: "SQLInject.exe", execute: this.ns.sqlinject },
		];
	}

	async init() {
		this.ns.disableLog("ALL");
		this.ns.print("Initialising Root Manager");
	}

	async update() {
		const hostname = this.ns.getHostname();
		this.ns.print(`Scanning ${hostname} for hosts`);
		const hosts = this.ns.scan(hostname);

		let hacked = 0;

		for (const host of hosts) {
			if (this.crack(host)) {
				await this.spawn(host);
				hacked += 1;
			}
			this.ns.print("Waiting 1 min");
			await this.ns.sleep(60000);
		}

		if (hacked === hosts.length) this.selfDestruct();
	}

	async spawn(host) {
		const script = "root-manager.js";
		if (this.ns.scriptRunning(script, host)) return;

		await this.ns.scp(script, "home", host);
		this.ns.print(`Spawning ${script} on ${host}`);
		this.ns.exec(script, host, 1);
	}

	crack(host) {
		if (this.ns.hasRootAccess(host)) return true;

		const ports = this.executables
			.filter(({ file }) => this.ns.fileExists(file, "home"))
			.forEach(({ execute }) => execute(host)).length;

		const level = this.ns.getHackingLevel();
		const required_level = this.ns.getServerRequiredHackingLevel(host);
		const required_ports = this.ns.getServerNumPortsRequired(host);

		if (required_level > level || required_ports > ports) return false;

		this.ns.nuke(host);
		this.ns.print(`${host} cracked`);
		return true;
	}

	getHackablePorts() {
		return this.executables.filter(({ file }) =>
			this.ns.fileExists(file, "home")
		).length;
	}

	selfDestruct() {
		const name = this.ns.getScriptName();
		const hostname = this.ns.getHostname();
		this.ns.kill(name, hostname);
	}
}
