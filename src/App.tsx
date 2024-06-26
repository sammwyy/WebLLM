import { RouterProvider } from "react-router-dom";
import { ChatsProvider } from "./contexts/chats";
import { LLMProvider } from "./contexts/llm";
import router from "./router";

function App() {
  return (
    <LLMProvider>
      <ChatsProvider>
        <RouterProvider router={router} />
      </ChatsProvider>
    </LLMProvider>
  );
}

export default App;
