import { ChatGroq } from "@langchain/groq";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import readline from "readline/promises";
import dotenv from "dotenv";
dotenv.config();

/**
  1. Define a node function 
  2. Build the graph
  3. compile and invoke the graph

 */

// Initilize the LLM
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  //   maxTokens: undefined,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY,
});

// 1. Define a node function
async function callModel(state) {
  // call the LLM using APIs
  const response = await llm.invoke(state.messages);
  console.log("Calling the Model");
  return { messages: [response] };
}

// 2 Build the graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addEdge("agent", "__end__");

// 3. compile and invoke the graph
const app = workflow.compile();

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

    const finalState = await app.invoke({
      messages: [{ role: "user", content: userInput }],
    });
    const lastMessages = finalState.messages[finalState.messages.length - 1];
    console.log(`AI :`,lastMessages.content);
  }

  rl.close();
}

main();
