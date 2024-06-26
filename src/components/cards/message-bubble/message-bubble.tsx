import MarkdownRenderer from "@/components/utils/markdown-renderer";
import Message from "@/lib/message";

export interface MessageBubbleProps {
  message: Message;
}

function UserMessageBubble(props: MessageBubbleProps) {
  {
    /* Add border radius to the right side of the message bubble */
  }
  return (
    <div className="flex gap-2 flex-row-reverse">
      <div className="p-3 bg-black text-white rounded-3xl">
        <MarkdownRenderer>{props.message.content}</MarkdownRenderer>
      </div>
    </div>
  );
}

function AiMessageBubble(props: MessageBubbleProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Content */}
      <div className="p-3">
        <MarkdownRenderer>{props.message.content}</MarkdownRenderer>
      </div>
    </div>
  );
}

export function MessageBubble(props: MessageBubbleProps) {
  return props.message.role === "user" ? (
    <UserMessageBubble message={props.message} />
  ) : (
    <AiMessageBubble message={props.message} />
  );
}
