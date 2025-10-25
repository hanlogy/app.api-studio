/**
 * Api Studio
 * @format
 */

import React from 'react';
import {ScrollView, StatusBar, Text, View} from 'react-native';

import {styles} from './App.styles';

function App(): React.JSX.Element {
  const backgroundStyle = {
    backgroundColor: 'white',
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={backgroundStyle}>
        <View style={styles.container}>
          <Text>Api Studio</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default App;
