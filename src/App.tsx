import React from 'react';
import {Text, LogBox} from 'react-native';

import {StudioLayout} from './components/StudioLayout/StudioLayout';
import {StudioContextProvider} from './states/studio/StudioContextProvider';
import {StudioLoader} from './components/StudioLoader/StudioLoader';

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
