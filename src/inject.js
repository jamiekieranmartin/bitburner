/** @param {NS} ns **/
export async function main(ns) {
	const target = ns.args[0];
	const servers = ns.args.filter((_, i) => i);

	for (let host of servers) {
		if (ns.getServerRequiredHackingLevel(host) > ns.getHackingLevel()) continue;

		await ns.scp("hack.js", "home", host);

		let ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
		let required_ram = ns.getScriptRam("hack.js", "home");
		let threads = ram / required_ram;
		ns.exec("hack.js", host, threads, target);
	}
}
