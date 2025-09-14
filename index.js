import readline from "readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  while (true) {
    const userInput = await rl.question("You : ");
    if (
      userInput.toLowerCase() === "exit" ||
      userInput.toLowerCase() === "quit" ||
      userInput.toLowerCase() === "bye"
    ) {
      console.log("Exiting...");
      break;
    }
    console.log(`you Said : ${userInput}`);
  }

  rl.close();
}

main();