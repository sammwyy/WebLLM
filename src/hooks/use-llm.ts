import { LLMContext } from "@/contexts/llm";
import { useContext } from "react";

const useLLM = () => useContext(LLMContext);

export default useLLM;
