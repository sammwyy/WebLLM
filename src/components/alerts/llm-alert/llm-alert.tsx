import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useLLM from "@/hooks/use-llm";
import { Download, InfoIcon, Loader, TriangleAlert } from "lucide-react";

export function LLMAlert() {
  const { modelError, modelState, modelProgress } = useLLM();

  if (modelState === "idle") {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Select a model to start chatting with the AI.
        </AlertDescription>
      </Alert>
    );
  } else if (modelState == "waiting") {
    return (
      <Alert>
        <Loader className="h-4 w-4" />
        <AlertTitle>Initializing</AlertTitle>
        <AlertDescription>
          LLM Engine is initializing. This may take a few seconds.
        </AlertDescription>
      </Alert>
    );
  } else if (modelState == "downloading") {
    return (
      <Alert>
        <Download className="h-4 w-4" />
        <AlertTitle>Downloading</AlertTitle>
        <AlertDescription>
          Downloading the model. This may take a few minutes. ({modelProgress}%)
        </AlertDescription>
      </Alert>
    );
  } else if (modelState == "loading") {
    return (
      <Alert>
        <Loader className="h-4 w-4" />
        <AlertTitle>Starting</AlertTitle>
        <AlertDescription>
          Loading the model. This may take a few seconds. ({modelProgress}
          %)
        </AlertDescription>
      </Alert>
    );
  } else if (modelState == "error") {
    return (
      <Alert>
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{modelError}</AlertDescription>
      </Alert>
    );
  } else {
    return <></>;
  }
}
