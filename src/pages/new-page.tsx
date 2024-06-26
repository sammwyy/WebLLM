import Chat from "@/components/chat";
import useChats from "@/hooks/use-chats";
import useLLM from "@/hooks/use-llm";
import Message from "@/lib/message";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewPage() {
  const { createChat } = useChats();
  const { process, isLLMTyping, currentLLMMessage } = useLLM();
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  const handleSendMessage = async (content: string) => {
    const createdAt = Date.now();
    const role = "user";
    const message: Message = { content, createdAt, role };
    setMessages([...messages, message]);
    const chat = await createChat("New chat", [message]);

    setTimeout(() => {
      process(chat.messages);
      navigate(`/chat/${chat.id}`);
    }, 100);
  };

  return (
    <div>
      <Chat
        messages={messages}
        onSendMessage={handleSendMessage}
        isAITyping={isLLMTyping}
        aiTyping={currentLLMMessage}
      />
    </div>
  );
}
