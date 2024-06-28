import Chat from "@/components/chat";
import useChats from "@/hooks/use-chats";
import useLLM from "@/hooks/use-llm";
import Message from "@/lib/message";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./not-found-page";

export default function ChatPage() {
  const { chatId } = useParams();
  const { process, isLLMTyping, currentLLMMessage } = useLLM();
  const { chats, addMessage } = useChats();
  const chat = chats.find((chat) => chat.id === chatId);
  const [messages, setMessages] = useState<Message[]>([]);

  const [lastUserMessage, setLastUserMessage] = useState<Message | null>(null);
  const [lastAIResponse, setLastAIResponse] = useState<Message | null>(null);

  const handleSendMessage = (content: string) => {
    const createdAt = Date.now();
    const role = "user";
    const message: Message = { content, createdAt, role };
    const newMessages = [...messages, message];
    setMessages(newMessages);
    setLastUserMessage(message);
    process(newMessages);
  };

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages);
    }
  }, [chat]);

  useEffect(() => {
    if (!lastAIResponse || !chatId) return;

    const messages = [];
    if (lastUserMessage) messages.push(lastUserMessage);
    messages.push(lastAIResponse);

    addMessage(chatId, messages);
    setLastUserMessage(null);
    setLastAIResponse(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAIResponse, lastUserMessage, chatId, messages]);

  useEffect(() => {
    // AI stop typing.
    if (!isLLMTyping && currentLLMMessage) {
      setLastAIResponse({
        content: currentLLMMessage,
        createdAt: Date.now(),
        role: "assistant",
      });
    }
  }, [isLLMTyping, currentLLMMessage]);

  if (!chat) return <NotFoundPage />;

  return (
    <Chat
      messages={messages}
      onSendMessage={handleSendMessage}
      isAITyping={isLLMTyping}
      aiTyping={currentLLMMessage}
    />
  );
}
