export default interface Message {
  content: string;
  role: "assistant" | "user" | "system";
  createdAt: number;
}
