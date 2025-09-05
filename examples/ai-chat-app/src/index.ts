import { AIService, ChatContainer } from "@tui-kit-ai/ai";
import { useTerminal } from "@tui-kit-ai/core";

const aiService = new AIService({
  provider: "openai",
  model: "gpt-4",
  apiKey: process.env.OPENAI_API_KEY,
});

const { screen } = useTerminal();

const chatContainer = new ChatContainer({
  parent: screen,
  messages: [],
  onMessageSubmit: async (content) => {
    const result = await aiService.streamCompletion([
      { role: "user", content },
    ]);

    for await (const chunk of result.textStream) {
      // Handle streaming response
    }
  },
});

export default chatContainer;
