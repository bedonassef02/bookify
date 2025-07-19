import { lookup } from 'mime-types';
import { FileType } from '../types/file.type';

export const createFileTypeRegex = (fileTypes: FileType[]): RegExp => {
  const mediaTypes = fileTypes
    .map((type) => lookup(type))
    .filter((type) => type !== false);

  return new RegExp(mediaTypes.join('|'));
};
