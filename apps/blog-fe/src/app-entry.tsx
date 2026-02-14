import viteLogo from "/vite.svg";
import { Button, Code, Heading, Text } from "@miniapps/design-system";
import { Effect } from "effect";
import { useCallback, useState } from "react";

import reactLogo from "./assets/react.svg";

const DEFAULT_COUNT = 0;
const INCREMENT_BY = 1;

export const App: React.FC = () => {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const onClick = useCallback(async () => {
    await Effect.runPromise(Effect.logFatal("test"));
    setCount((count) => count + INCREMENT_BY);
  }, [count]);

  const handleClick = useCallback(() => {
    void onClick();
  }, [onClick]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <div className="mb-8 flex gap-8">
        <a href="https://vite.dev">
          <img
            src={viteLogo}
            className="h-24 w-24 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev">
          <img
            src={reactLogo}
            className="animate-spin-slow h-24 w-24 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg"
            alt="React logo"
          />
        </a>
      </div>
      <Heading level={1} className="mb-8">
        Vite + React
      </Heading>
      <div className="flex flex-col items-center gap-6 rounded-lg bg-white p-8 text-center shadow-lg">
        <Button onClick={handleClick}>count is {count}</Button>
        <Text as="p">
          Edit <Code>src/App.tsx</Code> and save to test HMR
        </Text>
      </div>
    </div>
  );
};
