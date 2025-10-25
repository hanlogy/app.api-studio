/**
 * Api Studio
 * @format
 */

import React from 'react';
import {Text, View} from 'react-native';

import {styles} from './App.styles';
import {RootContextProvider} from './states/RootContext';

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
