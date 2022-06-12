export interface IFileBase {
  filename?: string;
  mime?: string;
  size: number;
  description: string;
  chuncksize?: number;
  version: 1;
}

export interface IFileStats extends IFileBase {
  type: 'single' | 'multiple';
}

export interface IFileBuild extends IFileBase {
  chunksDataHex: string[];
}

export interface IFileHeader extends IFileBase {
  chunks: string[];
  extends?: { [key: string]: any };
}

export interface IFileTransactionData extends IFileBase {
  data: string;
}

export interface IFileUploadedResult {
  key: string;
  filename: string;
  mime: string;
  size: number;
  description: string;
}
