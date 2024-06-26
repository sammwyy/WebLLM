import ChatHistory from "@/lib/chat-history";
import Message from "@/lib/message";

export default interface ChatsHook {
  chats: ChatHistory[];
  createChat: (title: string, messages: Message[]) => Promise<ChatHistory>;
  listChats: () => Promise<ChatHistory[]>;
  deleteChat: (id: string) => Promise<void>;
  deleteAllChats: () => Promise<void>;
  addMessage: (chatId: string, message: Message | Message[]) => Promise<void>;
  renameChat: (chatId: string, name: string) => Promise<void>;
}
