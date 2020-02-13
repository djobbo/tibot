const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = process.env.DISCORD_TOKEN;

const PREFIX = 'tib';

const commands = require('./commands');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
	const content = msg.content;
	// const args = content
	// 	.replace(PREFIX, '')
	// 	.split(' ')
	// 	.filter(x => x !== '');
	// commands.forEach(command => {
	// 	switch (command.type) {
	// 		case 'prefixed':
	// 			if (content.startsWith(PREFIX)) {
	// 				if (arrayStartsWith(args.join(' '), command.aliases)) {
	// 					command.method(msg, args);
	// 					console.log('bruh');
	// 				}
	// 			}
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// });

	const audit = await msg.guild
		.fetchAuditLogs({ type: 'MEMBER_UPDATE' })
		.then(audit => {
			console.log(
				audit.entries
					.map(x => {
						const obj = {
							user: x.executor.username,
							target: x.target.username,
							changes: x.changes
								.filter(y => y.key === 'nick')
								.map(y => ({ old: y.old, new: y.new }))
						};
						return obj.changes.map(
							change =>
								`• [${obj.user} >> ${
									obj.target
								}]: ${change.old ||
									obj.target} ==> ${change.new || obj.target}`
						);
					})
					.filter(x => x.length > 0)
					.join('\n')
			);
		})
		.catch(console.error);
});

client.login(TOKEN);

function arrayStartsWith(str, arr) {
	for (let i = 0; i < arr.length; i++) {
		console.log(str.startsWith(arr[i]));
		if (str.startsWith(arr[i])) return true;
	}
	return false;
}
