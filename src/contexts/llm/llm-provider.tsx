import Message from "@/lib/message";
import { MLCEngine } from "@mlc-ai/web-llm";
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LLMHook, LLMModel, LLMModelState } from "./llm-hook";

export const LLMContext = createContext<LLMHook>({
  abort: () => {},
  clearLLMState: () => {},
  currentLLMMessage: "",
  isLLMTyping: false,
  model: null,
  modelState: "idle",
  process: async () => {},
  loadModel: async () => {},
  modelError: null,
  modelProgress: 0,
});

export const LLMProvider = ({ children }: PropsWithChildren) => {
  // LLM.
  const [model, setModel] = useState<LLMModel | null>(null);
  const [modelProgress, setModelProgress] = useState<number>(0);
  const [modelError, setModelError] = useState<string | null>(null);
  const [modelState, setModelState] = useState<LLMModelState>("idle");
  const engine = useMemo(() => new MLCEngine(), []);

  const loadModel = async (model: LLMModel) => {
    if (!engine) return;
    console.log("Loading model " + model);

    setModelState("waiting");
    setModel(model);
    setModelError(null);

    engine
      .reload(model)
      .then(() => {
        setModelState("ready");
      })
      .catch((err) => {
        setModelError(err.message);
        setModelState("error");
      });
  };

  useEffect(() => {
    if (!engine) return;
    console.log("Setting up engine...");

    setModelState("idle");

    engine.setInitProgressCallback((progress) => {
      const text = progress.text;
      const isDownloading = text.includes("Fetching");
      const isLoading = text.includes("Loading");

      if (isDownloading) {
        setModelState("downloading");
      } else if (isLoading) {
        setModelState("loading");
      }

      // Find progress between "[current/total]".
      const matches = text.match(/\[(\d+)\/(\d+)\]/);
      if (matches) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, current, total] = matches;
        const progress = (parseInt(current) / parseInt(total)) * 100;
        const fixed = Math.round(progress * 100) / 100;
        setModelProgress(fixed);
      }
    });
  }, [engine]);

  // State management.
  const [currentLLMMessage, setCurrentLLMMessage] = useState<string | null>(
    null
  );
  const [isLLMTyping, setIsLLMTyping] = useState<boolean>(false);

  // Actions.
  const process = async (messages: Message[]) => {
    if (!engine) return;
    setCurrentLLMMessage("");

    const conversation = messages.map((msg) => ({
      content: msg.content,
      role: msg.role,
    }));

    const chunks = await engine.chat.completions.create({
      messages: conversation,
      stream: true,
    });

    setIsLLMTyping(true);

    const results = [];

    for await (const chunk of chunks) {
      const [choice] = chunk.choices;
      const content = choice?.delta?.content;

      if (content) {
        results.push(content);
      }

      setCurrentLLMMessage(results.join(""));
    }

    setIsLLMTyping(false);
  };

  const abort = () => {};

  const clearLLMState = () => {};

  return (
    <LLMContext.Provider
      value={{
        abort,
        clearLLMState,
        currentLLMMessage: currentLLMMessage || "",
        isLLMTyping,
        model,
        modelState,
        modelError,
        modelProgress,
        process,
        loadModel,
      }}
    >
      {children}
    </LLMContext.Provider>
  );
};
