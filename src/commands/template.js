module.exports = {
  aliases: ["test"],
  type: "prefixed",
  method: (msg, args) => {
    console.log("hey");
    msg.channel.send("baise ta mere fdp");
  }
};

/*  types:
 **    • prefixed: executes if a message === [prefix] [command]
 **    • plain: executes if a message === one of the aliases
 **    • intext: executes if one of the aliases appear anywhere in a message
 */
