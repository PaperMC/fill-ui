type OperationError = {
  message: string;
};

export function getOperationErrorMessage(error: OperationError | null | undefined, action: string): string | null {
  if (!error) return null;

  console.error(`Unable to ${action}`, error);
  return `Unable to ${action}. Please try again.`;
}

export function getUnexpectedOperationResultMessage(action: string, error?: unknown): string {
  console.error(`Unable to ${action}: the response did not contain the expected data.`, error);
  return `Unable to ${action}. Please try again.`;
}
