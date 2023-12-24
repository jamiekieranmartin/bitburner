/** @param {NS} ns **/
export async function main(ns) {
	const host = ns.args[0];

	const executables = [
		{ file: "BruteSSH.exe", execute: ns.brutessh },
		{ file: "FTPCrack.exe", execute: ns.ftpcrack },
		{ file: "relaySMTP.exe", execute: ns.relaysmtp },
		{ file: "HTTPWorm.exe", execute: ns.httpworm },
		{ file: "SQLInject.exe", execute: ns.sqlinject },
	];

	if (ns.hasRootAccess(host)) return;

	const ports = executables
		.filter(({ file }) => ns.fileExists(file, "home"))
		.map(({ execute }) => execute(host)).length;

	const level = ns.getHackingLevel();
	const required_level = ns.getServerRequiredHackingLevel(host);
	const required_ports = ns.getServerNumPortsRequired(host);

	if (required_level > level || required_ports > ports) return;

	ns.nuke(host);
	ns.print(`${host} cracked`);
	return;
}
