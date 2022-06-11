//@ts-ignore
import { IFileHeader, IFileUploadedResult } from '../types/file';
import { TAG_HEX, UpFileSystemBuilder } from './libs/ufs';

/**
 *
 * @param filePath Source path of file
 * @param filename If put undefined, it use original file name
 * @param mimeType If put undefined or auto, get mime from source file
 * @param chuncksize If file exceed from chunk size, split into multiple chunks with chunkSize
 * @param broadcastScriptIterator Handler to create transaction with output into the netwrork
 * @returns
 */
export async function write(
  filePath: string,
  filename: string,
  mimeType: string,
  chuncksize: number,
  broadcastScriptIterator: (script: string) => Promise<string>
): Promise<IFileUploadedResult> {
  /**
   * Build date needed to write as transaction/s
   *
   * If chunksDataHex has single elements, it's mean file size
   * is lower than or equal the chunkSize and file will be write
   * in single transaction else each chunk write to seperate transaction
   * and finally all transactions ids put in header transaction that is
   * start point of file
   */
  const result = await UpFileSystemBuilder.build(filePath, filename, mimeType, chuncksize);

  /**
   * Single file transaction
   */
  if (result.chunksDataHex.length === 1) {
    const writeTransactionId = await broadcastScriptIterator(result.chunksDataHex[0]);

    return {
      key: writeTransactionId,
      filename: result.filename!,
      mime: result.mime!,
      size: result.size
    };
  }

  /**
   * Multi file transactions
   */
  const txids: string[] = [];
  for (let i = 0; i < result.chunksDataHex.length; i++) {
    const writeTransactionId = await broadcastScriptIterator(result.chunksDataHex[i]);
    txids.push(writeTransactionId);
  }

  const json: IFileHeader = {
    version: result.version,
    filename: result.filename!,
    mime: result.mime!,
    size: result.size,
    chuncksize: result.chuncksize!,
    chunks: txids
  };

  const writeHeaderTransactionId = await broadcastScriptIterator(
    TAG_HEX + Buffer.from(JSON.stringify(json), 'utf-8').toString('hex')
  );

  return {
    key: writeHeaderTransactionId,
    filename: result.filename!,
    mime: result.mime!,
    size: result.size
  };
}
