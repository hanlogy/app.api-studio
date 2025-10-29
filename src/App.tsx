import React from 'react';
import {Text, LogBox} from 'react-native';

import {StudioLayout} from '@/components/StudioLayout/StudioLayout';
import {StudioLoader} from '@/components/StudioLoader/StudioLoader';
import {StudioContextProvider} from '@/states/studio/StudioContextProvider';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

const App = (): React.JSX.Element => {
  return (
    <StudioContextProvider>
      <StudioLoader>
        <StudioLayout>
          <Text>Api Studio</Text>
        </StudioLayout>
      </StudioLoader>
    </StudioContextProvider>
  );
};

export default App;
