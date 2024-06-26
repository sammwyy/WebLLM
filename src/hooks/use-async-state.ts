import { useEffect, useState } from "react";

type PromiseBody<T> = Promise<T> | (() => Promise<T>);
type AsyncState<T> = [T, boolean, unknown | null];

const useAsyncState = <T>(
  executor: PromiseBody<T>,
  initial?: T
): AsyncState<T> => {
  const [state, setState] = useState<T | undefined>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const execute = async () => {
      setLoading(true);
      try {
        const data = await (typeof executor === "function"
          ? executor()
          : executor);
        setState(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    execute();
  }, [executor, initial]);

  return [state as T, loading, error];
};

export default useAsyncState;
