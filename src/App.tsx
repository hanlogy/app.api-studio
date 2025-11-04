import React from 'react';
import { LogBox } from 'react-native';

import { StudioLayout } from '@/components/StudioLayout/StudioLayout';
import { StudioLoader } from '@/components/StudioLoader/StudioLoader';
import { StudioContextProvider } from '@/states/studio/StudioContextProvider';
import { WorkspaceView } from './components/WorkspaceView/WorkspaceView';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

const App = (): React.JSX.Element => {
  return (
    <StudioContextProvider>
      <StudioLoader>
        <StudioLayout>
          <WorkspaceView />
        </StudioLayout>
      </StudioLoader>
    </StudioContextProvider>
  );
};

export default App;
