import React from 'react';
import { LogBox } from 'react-native';
import { StudioLayout } from '@/components/StudioLayout/StudioLayout';
import { RequestsView } from '@/components/RequestsView/RequestsView';
import { StudioContextProvider } from '@/states/studio';
import { ThemeContextProvider } from './states/theme/ThemeContextProvider';
import { MockServersView } from './components/MockServersView/MockServersView';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

export default function App() {
  return (
    <ThemeContextProvider>
      <StudioContextProvider>
        <StudioLayout
          renderWorkspace={navName => {
            switch (navName) {
              case 'requests':
                return <RequestsView />;
              case 'mockServers':
                return <MockServersView />;
            }
          }}
        />
      </StudioContextProvider>
    </ThemeContextProvider>
  );
}
