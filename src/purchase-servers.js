/** @param {NS} ns **/
export async function main(ns) {
	let ram = ns.args[0];
	let target = ns.args[1];
	let i = 0;

	while (i < ns.getPurchasedServerLimit()) {
		let money = ns.getServerMoneyAvailable("home");
		let cost = ns.getPurchasedServerCost(ram);

		if (cost > money) continue;

		let host = ns.purchaseServer('pserv-' + i, ram);
		await ns.scp("hack.js", "home", host);

		let required_ram = ns.getScriptRam("hack.js", host);
		let threads = ram / required_ram;
		ns.exec("hack.js", host, threads, target);
		++i;
	}
}
