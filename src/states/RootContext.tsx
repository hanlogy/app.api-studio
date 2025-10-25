import {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {loadRootStateFromCache} from './rootStateHelpers';

export interface RootState {
  readonly workspacePath?: string;
}

export const RootContext = createContext<RootState>({});

export const RootContextProvider = ({children}: PropsWithChildren<{}>) => {
  const [rootState, setRootState] = useState<RootState | undefined>();

  useEffect(() => {
    (async () => {
      const state = await loadRootStateFromCache();
      setRootState(state);
    })();
  }, []);

  if (!rootState) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  return <RootContext value={rootState}>{children}</RootContext>;
};
