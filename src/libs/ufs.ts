import { lookup } from 'mime-types';
import * as pfs from 'promise-fs';
import { IFileBuild, IFileTransactionData } from 'types/file';
import { Utility } from './utility';

export const TAG_HEX = Buffer.from('upfile ', 'ascii').toString('hex');

export class UpFileSystemBuilder {
  static async build(
    filePath: string,
    filename?: string,
    mimeType: string = 'auto',
    chunkSize: number = 51200
  ): Promise<IFileBuild> {
    const fileId: number = await pfs.open(filePath, 'r');
    const stat: pfs.Stats = await pfs.stat(filePath);
    let start: number = stat.size - (stat.size % chunkSize);
    const mime = !mimeType
      ? undefined
      : mimeType !== 'auto'
      ? mimeType
      : (lookup(filePath.split('/').pop() as string) as string);
    if (stat.size < chunkSize) {
      // Single transaction file type
      const buffer: Buffer = Buffer.alloc(stat.size);
      await pfs.read(fileId, buffer, 0, stat.size, 0);
      const json: IFileTransactionData = {
        version: 1,
        filename: filename!,
        mime: mime!,
        size: stat.size,
        data: buffer.toString('base64').replace(/=/g, '')
      };
      Utility.removeEmpty(json);
      await pfs.close(fileId);

      return {
        version: 1,
        filename: filename!,
        size: stat.size,
        mime: mime!,
        chuncksize: chunkSize,
        chunksDataHex: [TAG_HEX + Buffer.from(JSON.stringify(json), 'utf-8').toString('hex')]
      };
    }

    // Multiple transactions file type
    const chunks: string[] = [];
    while (start >= 0) {
      const bufferLength: number =
        start + chunkSize > stat.size ? stat.size - start : chunkSize;
      const buffer: Buffer = Buffer.alloc(bufferLength);
      await pfs.read(fileId, buffer, 0, bufferLength, start);
      chunks.unshift(TAG_HEX + buffer.toString('hex'));
      start = start - chunkSize;
    }
    await pfs.close(fileId);

    return {
      version: 1,
      filename: filename!,
      size: stat.size,
      mime: mime!,
      chuncksize: chunkSize,
      chunksDataHex: chunks
    };
  }
}
