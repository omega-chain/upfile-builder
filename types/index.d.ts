export interface BuildReq {
  file?: string;
  userText?: string;
}

export interface BuildRes {
  content: string;
}

export interface ExtractRes {
  file?: string;
  text?: string;
  version: number;
  parts: number;
  content: string[];
}
