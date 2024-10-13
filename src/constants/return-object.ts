type typeError = {
  message: string;
};

export type returnObject = {
  statusCode: number;
  data: any;
  error: typeError;
};

export function genenateReturnObject(
  statusCode: number = 200,
  data: any = {},
  errorMessage: string = 'No error',
): returnObject {
  const result: returnObject = {
    statusCode: statusCode,
    data: data,
    error: {
      message: errorMessage,
    },
  };
  return result;
}
