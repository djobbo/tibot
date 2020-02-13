const firebase = require('firebase');
require('firebase/firestore');
const app = firebase.initializeApp({
	apiKey: 'AIzaSyCXoxE_9rVy4DAqtpXU8ETOfC56ttuKI4E',
	authDomain: 'tibot-666c4.firebaseapp.com',
	databaseURL: 'https://tibot-666c4.firebaseio.com',
	projectId: 'tibot-666c4',
	storageBucket: 'tibot-666c4.appspot.com',
	messagingSenderId: '990668023213',
	appId: '1:990668023213:web:6ef97097bbb180bf5bed24',
	measurementId: 'G-BV0CBFR4S6'
});

const db = firebase.firestore();

const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = process.env.DISCORD_TOKEN;

const PREFIX = 'tib';

const commands = require('./commands');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
	if (msg.author.bot) return;
	const content = msg.content;
	const args = content.split(' ');
	switch (args[0]) {
		case 'tibadd':
			if (!args[1] || !args[2]) return;
			try {
				let command = args[1].toLowerCase();
				let res = args.reduce(
					(acc, arg, i) => (i >= 2 ? `${acc} ${arg}` : acc),
					''
				);
				await db.doc(`commands/${command}`).set({
					res: res
				});
				msg.reply(
					`La commande "${command} => ${res}" a bien été crée!`
				);
			} catch (e) {
				console.error(e);
				return;
			}
			break;
		case 'tibrm':
			if (!args[1]) return;
			try {
				let command = args[1].toLowerCase();
				let commandDoc = await db.doc(`commands/${command}`).get();
				if (!commandDoc.exists) return;
				await db.doc(`commands/${command}`).delete();
				msg.reply(
					`La commande "${command} => ${
						commandDoc.data().res
					}" a bien été supprimée!`
				);
			} catch (e) {
				console.error(e);
				return;
			}
			break;
		case 'tibcmd':
			let cmdDocs = await db.collection('commands').get();
			let cmdStr = cmdDocs.docs
				.map(cmd => `${cmd.id} => ${cmd.data().res}`)
				.join('\n');
			let cmdEmbed = new Discord.RichEmbed()
				.setColor('#FAA61A')
				.setTitle('Commandes')
				.setURL('https://dvmm.dev/')
				.setDescription('Tibis a votre service!')
				.addField('Commandes', cmdStr);
			msg.channel.send(cmdEmbed);
			break;
		case 'tibhelp':
			let helpEmbed = new Discord.RichEmbed()
				.setColor('##FAA61A')
				.setTitle('TIB-0T Assistance')
				.setURL('https://dvmm.dev/')
				.setDescription('Tibis a votre service!')
				.addField(
					'Créer/Modifier une commande',
					'`tibadd [commande] [réponse]`'
				)
				.addField('Supprimer une commande', '`tibrm [commande]`')
				.addField('Liste des commandes', '`tibcmd`')
				.setTimestamp();
			msg.channel.send(helpEmbed);
			break;
		case 'tibg':
			if (!msg.author.id != process.env.BOSS_ID) return;
			const mention = msg.mentions.users.first();
			msg.delete();
			if (!mention) return;
			for (let i = 0; i < 3; i++) {
				let ping = await msg.channel.send(`<@${mention.id}>`);
				await ping.delete();
			}
			break;
		default:
			if (!args[0]) return;
			try {
				let command = args[0].toLowerCase();
				let commandDoc = await db.doc(`commands/${command}`).get();
				if (!commandDoc.exists) return;
				msg.channel.send(commandDoc.data().res);
			} catch (e) {
				console.error(e);
				return;
			}
			break;
	}
});

client.login(TOKEN);
