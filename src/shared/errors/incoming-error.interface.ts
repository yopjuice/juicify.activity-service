export interface IncomingGrpcError {
  code: number;
  details: string;
}

export interface IncomingHttpError {
  status: number;
  message: string;
}
