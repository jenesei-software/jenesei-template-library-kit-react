import { ProviderBrowserTheme, ProviderDialog, ProviderGeolocation, ProviderPermission, ProviderScreenWidth } from '@jenesei-software/jenesei-kit-react';
import type { Preview } from '@storybook/react-vite';
import { PropsWithChildren, StrictMode } from 'react';
import '@jenesei-software/jenesei-kit-react/styles.css'
import './preview.css';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const bg = context.globals.backgrounds?.value; // 'light' | 'dark' | undefined
      const sbMode = (bg === 'dark' || bg === 'light' ? bg : 'auto') as 'light' | 'dark' | 'auto';

      return (
        <StrictMode>
          <ProviderPermission>
            <ProviderGeolocation>
              <ProviderBrowserTheme defaultMode={sbMode}>
                <ProviderDialog zIndex={999}>
                  <Layout>
                    <Story />
                  </Layout>
                </ProviderDialog>
              </ProviderBrowserTheme>
            </ProviderGeolocation>
          </ProviderPermission>
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

const Layout = (props: PropsWithChildren) => {
  // const { theme } = useBrowserTheme();
  return <ProviderScreenWidth>{props.children}</ProviderScreenWidth>;
};
export default preview;