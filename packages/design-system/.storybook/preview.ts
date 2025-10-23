import type { Preview } from "@storybook/react-vite";

// eslint-disable-next-line import/no-unassigned-import main css import
import "../dist/assets/tailwind.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
