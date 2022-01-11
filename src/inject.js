/** @param {NS} ns **/
export async function main(ns) {
	const target = ns.args[0];

	const servers = [
		"CSEC",
		"harakiri-sushi",
		"hong-fang-tea",
		"joesguns",
		"sigma-cosmetics",
		"iron-gym",
		"nectar-net",
		"zer0",
		"max-hardware",
		"silver-helix",
		"phantasy",
		"neo-net",
		"n00dles"
	]

	for (let host of servers) {
		ns.brutessh(host);
		ns.ftpcrack(host);
		ns.nuke(host);

		let success = await ns.scp("hack.js", "home", host);
		if (!success) throw new Error('could not scp');

		let ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
		let required_ram = ns.getScriptRam("hack.js", "home");
		let threads = ram / required_ram;
		ns.exec("hack.js", host, threads, target);
	}
}
