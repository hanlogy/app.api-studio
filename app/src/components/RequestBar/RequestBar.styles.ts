import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles({ isLight, colors }: Theme) {
  return {
    styles: StyleSheet.create({
      container: {
        display: 'flex',
        flexDirection: 'row',
      },

      methodAndUrl: {
        display: 'flex',
        flexDirection: 'row',
        minHeight: 42,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: isLight ? '#999' : '#666',
        paddingHorizontal: 8,
        paddingVertical: 6,
        alignItems: 'center',
        flex: 1,
      },

      method: {
        marginRight: 8,
      },

      url: {
        flex: 1,
      },

      urlText: {
        color: isLight ? '#666' : '#EEE',
        backgroundColor: 'transparent',
      },

      actionButton: {
        flexShrink: 0,
        marginLeft: 8,
        height: 42,
        width: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
      },
      requestButton: {
        backgroundColor: colors.primary,
      },

      requestButtonHovered: {
        backgroundColor: '#8e28e1ff',
      },

      requestButtonPressed: {
        backgroundColor: '#8e28e1EE',
      },
      requestButtonText: {
        color: '#FFF',
      },

      cancelButton: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#AAA',
      },

      cancelButtonHovered: {
        backgroundColor: '#CCC',
      },

      cancelButtonPressed: {
        backgroundColor: '#ddd',
      },

      cancelButtonText: {
        color: '#333',
        marginLeft: 5,
      },
    }),
  };
}
