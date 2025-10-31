import {JsonRecord} from '@/definitions';
import RNFS from 'react-native-fs';
import {isPlainObject} from './isPlainObject';

export const readJsonRecordFile = async (
  filePath: string,
): Promise<JsonRecord> => {
  try {
    const value = JSON.parse(await RNFS.readFile(filePath, 'utf8'));

    if (isPlainObject(value)) {
      throw new Error();
    }
    return value;
  } catch {
    return {};
  }
};
