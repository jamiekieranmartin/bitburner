/** @param {NS} ns **/
export async function main(ns) {
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

	const purchased_servers = ns.getPurchasedServers()

	for (const server of [...servers, ...purchased_servers]) {
		ns.killall(server)
	}
}
