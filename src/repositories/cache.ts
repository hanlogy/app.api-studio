import {type JsonRecord} from '@/definitions';
import {readJsonRecord, writeJsonRecord} from '@/helpers/fileIO';
import RNFS from 'react-native-fs';

const cacheFolder = `${RNFS.LibraryDirectoryPath}/Application Support/ApiStudio`;

export async function saveToCache(fileName: string, data: JsonRecord) {
  await writeJsonRecord({dir: cacheFolder, fileName, data});
}

export async function readFromCache(fileName: string) {
  return readJsonRecord({dir: cacheFolder, fileName});
}
