import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles({ isLight }: Theme) {
  return {
    styles: StyleSheet.create({
      container: {
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        maxWidth: 800,
      },
      left: {
        flex: 1,
        paddingRight: 32,
      },
      right: {
        flex: 1,
      },

      openRecentTitle: {
        marginBottom: 12,
        color: '#666',
      },
    }),

    openButtonStyles: StyleSheet.create({
      default: {
        backgroundColor: isLight ? '#f6f6f6' : '#666',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
      },

      hovered: {
        backgroundColor: isLight ? '#EEEE' : '#555',
      },

      pressed: {
        backgroundColor: isLight ? '#DDD' : '#333',
      },
    }),

    tileStyles: StyleSheet.create({
      default: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f6f6f6',
      },

      pressed: {
        backgroundColor: '#DDD',
      },

      hovered: {
        backgroundColor: '#eee',
      },

      name: {
        color: '#333',
        fontWeight: '500',
        marginBottom: 4,
      },

      dir: {
        color: '#666',
      },
    }),
  };
}
