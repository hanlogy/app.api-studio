import React from 'react';
import { LogBox } from 'react-native';
import { StudioLayout } from '@/components/StudioLayout/StudioLayout';
import { WorkspaceView } from '@/components/WorkspaceView/WorkspaceView';
import { WorkspaceContextProvider } from '@/states/workspace/WorkspaceContextProvider';
import { StudioContextProvider } from '@/states/studio';
import { ThemeContextProvider } from './states/theme/ThemeContextProvider';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

export default function App() {
  return (
    <ThemeContextProvider>
      <StudioContextProvider>
        <StudioLayout>
          <WorkspaceContextProvider>
            <WorkspaceView />
          </WorkspaceContextProvider>
        </StudioLayout>
      </StudioContextProvider>
    </ThemeContextProvider>
  );
}
