import { LLMModel, LLMModels } from "@/contexts/llm";
import useChats from "@/hooks/use-chats";
import useLLM from "@/hooks/use-llm";
import ChatHistory from "@/lib/chat-history";
import { Ban, EditIcon, SaveIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function SidebarChat({ chat }: { chat: ChatHistory }) {
  const { pathname } = useLocation();
  const isSelected = pathname.includes(chat.id);

  const { renameChat, deleteChat } = useChats();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);

  const toggleEdit = () => setEditing((prev) => !prev);

  const handleCancelEdit = () => {
    setNewTitle(chat.title);
    toggleEdit();
  };

  const handleSaveEdit = () => {
    renameChat(chat.id, newTitle);
    toggleEdit();
  };

  const handleDelete = () => {
    deleteChat(chat.id);
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const onMouseEnter = () => setHover(true);
    const onMouseLeave = () => setHover(false);

    button.addEventListener("mouseenter", onMouseEnter);
    button.addEventListener("mouseleave", onMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", onMouseEnter);
      button.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const BTN = (
    <Button
      className="w-full justify-between p-0"
      variant={isSelected ? "outline" : "ghost"}
      ref={buttonRef}
    >
      {/* Title */}
      <div>
        {editing ? (
          <Input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        ) : (
          <p className="text-white p-3">{chat.title}</p>
        )}
      </div>

      {/* Menu */}
      <div className="flex p-3">
        {hover && !editing && (
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="w-5 text-red-500"
              onClick={handleDelete}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-5"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleEdit();
              }}
            >
              <EditIcon className="h-4 w-4" />
            </Button>
          </div>
        )}

        {editing && (
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="w-5 text-red-500"
              onClick={() => handleCancelEdit()}
            >
              <Ban className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-5 text-green-500"
              onClick={() => handleSaveEdit()}
            >
              <SaveIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Button>
  );

  if (editing) {
    return BTN;
  } else {
    return <Link to={`/chat/${chat.id}`}>{BTN}</Link>;
  }
}

export function Sidebar() {
  const { loadModel, modelProgress, modelState, modelError } = useLLM();
  const { chats } = useChats();

  return (
    <div className="w-60 h-full flex flex-col justify-between gap-1 p-3 bg-black">
      <div className="flex flex-col gap-2">
        {/* Create a new chat. */}
        <Link to="/">
          <Button className="w-full">New chat</Button>
        </Link>

        {/* List of chats. */}
        <div className="flex flex-col-reverse gap-1">
          {chats.map((chat) => (
            <SidebarChat key={chat.id} chat={chat} />
          ))}
        </div>
      </div>

      {/* Change Model */}
      <div>
        <p className="text-xs mb-2 text-center w-full">
          {modelState == "idle" && "No model loaded."}
          {modelState == "waiting" && "Initializing LLM engine..."}
          {modelState == "error" && "Error: " + modelError}
          {modelState == "ready" && "Model is ready."}
          {modelState == "loading" && `Model is loading (${modelProgress}%)`}
          {modelState == "downloading" &&
            `Model is downloading (${modelProgress}%)`}
        </p>

        <Select
          onValueChange={(v: LLMModel) => {
            loadModel(v);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Model" />
          </SelectTrigger>
          <SelectContent>
            {LLMModels.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
