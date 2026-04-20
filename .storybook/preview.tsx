import { ProviderBrowserTheme, ProviderScreenWidth } from '@jenesei-software/jenesei-kit-react';
import type { Preview } from '@storybook/react-vite';
import { StrictMode } from 'react';
import '@jenesei-software/jenesei-kit-react/styles.css'
import './preview.css';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const bg = context.globals.backgrounds?.value; // 'light' | 'dark' | undefined
      const sbMode = (bg === 'dark' || bg === 'light' ? bg : 'auto') as 'light' | 'dark' | 'auto';

      return (
        <StrictMode>
          <ProviderBrowserTheme defaultMode={sbMode}>
            <ProviderScreenWidth>
              <Story />
            </ProviderScreenWidth>
          </ProviderBrowserTheme>
        </StrictMode>
      );
    },
  ],

  parameters: {
    options: {
      //@ts-expect-error
      storySort: (a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }),
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
