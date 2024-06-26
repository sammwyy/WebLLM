import { ChatsContext } from "@/contexts/chats";
import { useContext } from "react";

const useChats = () => useContext(ChatsContext);

export default useChats;
