const Discord = require("discord.js");
const client = new Discord.Client();

const TOKEN = process.env.DISCORD_TOKEN;

const PREFIX = "tib";

const commands = require("./commands");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  const content = msg.content;
  const args = content
    .replace(PREFIX, "")
    .split(" ")
    .filter(x => x !== "");
  commands.forEach(command => {
    switch (command.type) {
      case "prefixed":
        if (content.startsWith(PREFIX)) {
          console.log(args.join(" "));
          if (arrayStartsWith(args.join(" "), command.aliases)) {
            command.method(msg, args);
            console.log("bruh");
          }
        }
        break;
      default:
        break;
    }
  });
});

client.login(TOKEN);

function arrayStartsWith(str, arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(str.startsWith(arr[i]));
    if (str.startsWith(arr[i])) return true;
  }
  return false;
}

console.log(arrayStartsWith("test", ["ab", "testing", "tes"]));
