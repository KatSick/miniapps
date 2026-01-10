import { Button } from "@miniapps/design-system";
import { useCallback, useState } from "react";

import reactLogo from "./assets/react.svg";
// eslint-disable-next-line import/no-absolute-path vite specifics
import viteLogo from "/vite.svg";

const DEFAULT_COUNT = 0;
const INCREMENT_BY = 1;

export const App: React.FC = () => {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const onClick = useCallback(() => {
    setCount((count) => count + INCREMENT_BY);
  }, [count]);

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
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Vite + React</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Button onClick={onClick}>count is {count}</Button>
        <p className="text-gray-600">
          Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">src/App.tsx</code>{" "}
          and save to test HMR
        </p>
      </div>
      <p className="text-gray-500 text-sm mt-8 text-center max-w-md">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
};
