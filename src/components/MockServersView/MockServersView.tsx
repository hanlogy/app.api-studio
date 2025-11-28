import { useThemeContext } from '@/states/theme';
import { useWorkspaceContext } from '@/states/workspace';
import { Text, ScrollView, View } from 'react-native-macos';
import { createStyles } from './MockServersView.styles';
import { Clickable } from '../clickables';
import { useCallback, useMemo, useState } from 'react';
import type { MockServer } from '@/definitions';
import { JsonViewer } from '../JsonViewer';

export function MockServersView() {
  const { workspace, isServerRunning, startServer, stopServer } =
    useWorkspaceContext();
  const { theme } = useThemeContext();
  const { styles, serverItemStyles, serverContext } = createStyles(theme);
  const [currentServer, setCurrentServer] = useState<MockServer>();

  const isRunning = useMemo(() => {
    if (!currentServer?.port || !isServerRunning) {
      return false;
    }
    return isServerRunning(currentServer.port);
  }, [currentServer?.port, isServerRunning]);

  const toggleServer = useCallback(() => {
    if (!startServer || !stopServer || !currentServer?.port) {
      return;
    }
    if (isRunning) {
      stopServer(currentServer.port);
    } else {
      startServer(currentServer.port);
    }
  }, [stopServer, startServer, currentServer?.port, isRunning]);

  if (!workspace) {
    return <></>;
  }

  const { servers } = workspace;

  return (
    <View style={styles.container}>
      <View style={styles.leftBar}>
        <View style={styles.leftBarTop}>
          <Text>Mock Servers</Text>
        </View>

        <ScrollView contentContainerStyle={styles.leftBarContent}>
          {servers.map(server => {
            const { name, port } = server;
            return (
              <Clickable
                key={[name, port].join('_')}
                onPress={() => {
                  setCurrentServer(server);
                }}
                style={serverItemStyles.button}
                hoveredStyle={serverItemStyles.buttonHovered}
                pressedStyle={serverItemStyles.buttonPressed}>
                <View
                  style={[
                    serverItemStyles.statusDot,
                    isServerRunning?.(port)
                      ? serverItemStyles.statusDotActive
                      : undefined,
                  ]}
                />
                <Text>{name}</Text>
              </Clickable>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.mainContent}>
        {currentServer ? (
          <View style={serverContext.container}>
            <View style={serverContext.toolbar}>
              <Clickable
                onPress={() => toggleServer()}
                style={serverContext.toggleButton}
                hoveredStyle={serverContext.toggleButtonHovered}
                pressedStyle={serverContext.toggleButtonPressed}>
                <Text>{isRunning ? 'Stop' : 'Start'}</Text>
              </Clickable>
            </View>
            <ScrollView contentContainerStyle={styles.serverConfig}>
              <JsonViewer value={currentServer} />
            </ScrollView>
          </View>
        ) : (
          <View>
            <Text />
          </View>
        )}
      </View>
    </View>
  );
}
