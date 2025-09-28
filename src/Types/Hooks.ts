import { useEffect, useState } from "react";

export type ExternalCallback<T> = [T, ((value: T) => void) | undefined];
export type CallbackBridge<T> = [T, (value: T) => void];

export function useExternal<T>(prop: ExternalCallback<T>): CallbackBridge<T> {
  const [propValue, setPropValue] = prop;
  const [stateValue, setStateValue] = useState(propValue);

  const setValue = (value: T) => {
    setStateValue(value);
    setPropValue?.(value);
  };

  useEffect(() => {
    setStateValue(propValue);
  }, [propValue])

  return [stateValue, setValue];
};