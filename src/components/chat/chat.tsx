import useLLM from "@/hooks/use-llm";
import Message from "@/lib/message";
import { useEffect, useRef, useState } from "react";
import LLMAlert from "../alerts/llm-alert";
import MessageBubble from "../cards/message-bubble";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface ChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  aiTyping?: string;
  isAITyping?: boolean;
}

export function Chat(props: ChatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLLMTyping, modelState } = useLLM();
  const disabled = isLLMTyping || modelState !== "ready";

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      props.onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [isLLMTyping, props.messages]);

  return (
    <div className="flex flex-col justify-between h-full max-w-2xl p-3 m-autos">
      <div className="flex flex-col gap-3 overflow-auto p-3" ref={containerRef}>
        {/* Chat bubbles */}
        {props.messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {/* AI typing indicator */}
        {props.isAITyping && (
          <MessageBubble
            message={{
              content: props.aiTyping || "AI is typing...",
              role: "assistant",
              createdAt: -1,
            }}
          />
        )}
      </div>

      {/* Chat input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <LLMAlert />

        <div className="flex gap-2 mt-4">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow"
            disabled={disabled}
          />
          <Button onClick={handleSendMessage} disabled={disabled}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
