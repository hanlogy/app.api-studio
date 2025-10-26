/**
 * Api Studio
 * @format
 */

import React from 'react';
import {Text, View, LogBox} from 'react-native';

import {styles} from './App.styles';
import {RootContextProvider} from './states/RootContext';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

const App = (): React.JSX.Element => {
  return (
    <RootContextProvider>
      <View style={styles.container}>
        <Text>Api Studio</Text>
      </View>
    </RootContextProvider>
  );
};

export default App;
