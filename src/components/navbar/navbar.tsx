import useLLM from "@/hooks/use-llm";
import { MenuIcon, PenSquareIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { SidebarContent } from "../sidebar";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

// Navbar Sheet.
function NavbarSheet({ children }: PropsWithChildren) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className={"dark"}
        style={{ backgroundColor: "#222" }}
      >
        <SheetHeader>
          <SheetTitle>Conversations</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4 h-full">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

// Navbar.
interface NavbarProps {
  onModelClick: () => void;
  onCreateClick: () => void;
}

export function Navbar({ onCreateClick, onModelClick }: NavbarProps) {
  const { model } = useLLM();

  return (
    <div className="flex justify-between w-full p-3 gap-5">
      <NavbarSheet>
        <SidebarContent />
      </NavbarSheet>

      <Button variant="ghost" onClick={onModelClick}>
        {model || "No model loaded"}
      </Button>

      <Link to="/">
        <Button variant="ghost" size="icon" onClick={onCreateClick}>
          <PenSquareIcon className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}
