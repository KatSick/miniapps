import { Button, Code, Heading, Text } from "@miniapps/design-system";
import { useCallback, useState } from "react";

import reactLogo from "./assets/react.svg";
// eslint-disable-next-line import/no-absolute-path vite specifics
import viteLogo from "/vite.svg";
import { Effect } from "effect";

const DEFAULT_COUNT = 0;
const INCREMENT_BY = 1;

export const App: React.FC = () => {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const onClick = useCallback(async () => {
    await Effect.runPromise(Effect.logFatal("test"));
    setCount((count) => count + INCREMENT_BY);
  }, [count]);

  const handleClick = useCallback(() => {
    onClick()
      .then(() => {
        // oxlint-disable-next-line no-console
        console.log("clicked");
      })
      .catch((error: unknown) => {
        // oxlint-disable-next-line no-console
        console.error(error);
      });
  }, [onClick]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev">
          <img
            src={viteLogo}
            className="h-24 w-24 hover:drop-shadow-lg transition-all duration-300 hover:scale-110"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev">
          <img
            src={reactLogo}
            className="h-24 w-24 hover:drop-shadow-lg transition-all duration-300 hover:scale-110 animate-spin-slow"
            alt="React logo"
          />
        </a>
      </div>
      <Heading level={1} className="mb-8">
        Vite + React
      </Heading>
      <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col gap-6 items-center">
        <Button onClick={handleClick}>count is {count}</Button>
        <Text as="p">
          Edit <Code>src/App.tsx</Code> and save to test HMR
        </Text>
      </div>
    </div>
  );
};
