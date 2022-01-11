/** @param {NS} ns **/
export async function main(ns) {
	let servers = ns.getPurchasedServers();
	for (let hostname of servers) {
		ns.deleteServer(hostname)
	}
}
