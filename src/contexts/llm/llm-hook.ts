import Message from "@/lib/message";

export type LLMModel =
  | "Llama-3-8B-Instruct-q4f32_1-MLC-1k"
  | "Llama-2-7b-chat-hf-q4f32_1-MLC-1k"
  | "Hermes-2-Pro-Llama-3-8B-q4f16_1-MLC"
  | "Phi-3-mini-4k-instruct-q4f16_1-MLC"
  | "Mistral-7B-Instruct-v0.3-q4f16_1-MLC"
  | "OpenHermes-2.5-Mistral-7B-q4f16_1-MLC"
  | "NeuralHermes-2.5-Mistral-7B-q4f16_1-MLC"
  | "WizardMath-7B-V1.1-q4f16_1-MLC"
  | "gemma-2b-it-q4f16_1-MLC"
  | "Qwen2-0.5B-Instruct-q0f16-MLC"
  | "stablelm-2-zephyr-1_6b-q4f16_1-MLC"
  | "RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC"
  | "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC";

export type LLMModelState =
  | "ready"
  | "error"
  | "loading"
  | "downloading"
  | "waiting"
  | "idle";

export const LLMModels: LLMModel[] = [
  "Llama-3-8B-Instruct-q4f32_1-MLC-1k",
  "Llama-2-7b-chat-hf-q4f32_1-MLC-1k",
  "Hermes-2-Pro-Llama-3-8B-q4f16_1-MLC",
  "Phi-3-mini-4k-instruct-q4f16_1-MLC",
  "Mistral-7B-Instruct-v0.3-q4f16_1-MLC",
  "OpenHermes-2.5-Mistral-7B-q4f16_1-MLC",
  "NeuralHermes-2.5-Mistral-7B-q4f16_1-MLC",
  "WizardMath-7B-V1.1-q4f16_1-MLC",
  "gemma-2b-it-q4f16_1-MLC",
  "Qwen2-0.5B-Instruct-q0f16-MLC",
  "stablelm-2-zephyr-1_6b-q4f16_1-MLC",
  "RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC",
  "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC",
];

export interface LLMHook {
  // Model state.
  model: LLMModel | null;
  modelProgress: number;
  modelError: string | null;
  modelState: LLMModelState;

  // State management.
  currentLLMMessage: string;
  isLLMTyping: boolean;
  clearLLMState: () => void;

  // Actions.
  process(messages: Message[]): void;
  loadModel(model: LLMModel): void;
  abort(): void;
}
