/** @param {NS} ns **/
export async function main(ns) {
	let host = ns.args[0];

	let money_threshold = ns.getServerMaxMoney(host) * 0.75;
	let sec_threshold = ns.getServerMinSecurityLevel(host) + 5;

	while (true) {
		if (ns.getServerSecurityLevel(host) > sec_threshold) {
			await ns.weaken(host);
		} else if (ns.getServerMoneyAvailable(host) < money_threshold) {
			await ns.grow(host);
		} else {
			await ns.hack(host);
		}
	}
}
