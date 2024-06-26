import ChatHistory from "@/lib/chat-history";
import Message from "@/lib/message";
import { DBSchema, IDBPDatabase, openDB } from "idb";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import ChatsHook from "./chats-hook";

interface ChatDB extends DBSchema {
  chats: {
    key: string;
    value: ChatHistory;
  };
}

export const ChatsContext = createContext<ChatsHook>({
  chats: [],
  createChat: async () => {
    throw new Error("ChatsContext not yet implemented");
  },
  listChats: async () => {
    throw new Error("ChatsContext not yet implemented");
  },
  deleteChat: async () => {
    throw new Error("ChatsContext not yet implemented");
  },
  deleteAllChats: async () => {
    throw new Error("ChatsContext not yet implemented");
  },
  addMessage: async () => {
    throw new Error("ChatsContext not yet implemented");
  },
  renameChat: async () => {
    throw new Error("ChatsContext not yet implemented");
  },
});

export const ChatsProvider = ({ children }: PropsWithChildren) => {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [db, setDB] = useState<IDBPDatabase<ChatDB> | null>(null);

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB<ChatDB>("chat-db", 1, {
        upgrade(db) {
          db.createObjectStore("chats", {
            keyPath: "id",
          });
        },
      });
      setDB(db);
    };
    initDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (db) {
      listChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  const createChat = async (
    title: string,
    messages: Message[]
  ): Promise<ChatHistory> => {
    if (!db) throw new Error("Database not initialized");

    // Save chat to storage.
    const id = crypto.randomUUID();
    const now = Date.now();
    const chat: ChatHistory = {
      id,
      title,
      messages,
      createdAt: now,
      updatedAt: now,
    };
    await db.put("chats", chat);

    // Update local state.
    setChats((prev) => [...prev, chat]);

    return chat;
  };

  const listChats = async () => {
    if (!db) return [];

    // Get all chats from storage.
    const chats = await db.getAll("chats");

    // Update local state.
    setChats([...chats]);

    return chats;
  };

  const deleteChat = async (id: string) => {
    if (!db) return;

    // Delete chat from storage.
    await db.delete("chats", id);

    // Update local state.
    setChats((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteAllChats = async () => {
    if (!db) return;

    // Clear storage.
    const tx = db.transaction("chats", "readwrite");
    await tx.objectStore("chats").clear();
    await tx.done;

    // Update local state.
    setChats([]);
  };

  const addMessage = async (chatId: string, messages: Message | Message[]) => {
    if (!db) return;

    // Fix message list.
    const message = Array.isArray(messages) ? messages : [messages];

    // Save message to storage.
    const chat = await db.get("chats", chatId);
    if (!chat) return;
    chat.messages.push(...message);
    chat.updatedAt = Date.now();
    await db.put("chats", chat);

    // Update local state.
    const index = chats.findIndex((c) => c.id === chatId);
    if (index === -1) return;
    const newChats = [...chats];
    newChats[index] = chat;
    setChats(newChats);
  };

  const renameChat = async (chatId: string, name: string) => {
    if (!db) return;

    // Save message to storage.
    const chat = await db.get("chats", chatId);
    if (!chat) return;
    chat.title = name;
    chat.updatedAt = Date.now();
    await db.put("chats", chat);

    // Update local state.
    const index = chats.findIndex((c) => c.id === chatId);
    if (index === -1) return;
    const newChats = [...chats];
    newChats[index] = chat;
    setChats(newChats);
  };

  return (
    <ChatsContext.Provider
      value={{
        chats,
        createChat,
        listChats,
        deleteChat,
        deleteAllChats,
        addMessage,
        renameChat,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
