import { NativeModules } from 'react-native';

export async function pickFolder() {
  try {
    const { FolderPicker } = NativeModules;
    return await FolderPicker.selectFolder();
  } catch {}
}
