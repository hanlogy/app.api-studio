import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },

  sectionTitle: {
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 36,
    alignItems: 'center',
  },

  sectionTitleText: {
    color: '#666',
  },

  metaItems: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  durationText: {
    marginRight: 16,
    color: '#999',
  },

  responseHeadersText: {
    fontFamily: 'Menlo',
    fontSize: 12,
    lineHeight: 20,
    color: '#666',
  },

  tabView: {
    paddingHorizontal: 16,
  },

  bodyNoneText: {
    marginTop: 8,
    color: '#ccc',
    fontStyle: 'italic',
  },

  tabContent: {
    paddingBottom: 16,
  },
});
