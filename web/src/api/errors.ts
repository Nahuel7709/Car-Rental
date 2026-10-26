// Builds the Error to throw when the API answers with an error status.
// The forms already show err.message, so this is the only place that
// decides what the user reads.
export async function errorFromResponse(res: Response): Promise<Error> {
  if (res.status === 429) {
    return new Error(tooManyRequestsMessage(res.headers.get("Retry-After")));
  }

  // The body is not always JSON (for example a proxy error page), so it can fail
  try {
    const data = await res.json();
    if (typeof data?.message === "string") {
      return new Error(data.message);
    }
  } catch {
    // Not JSON: fall through to the generic message
  }
  return new Error("Something went wrong, please try again");
}

function tooManyRequestsMessage(retryAfter: string | null): string {
  const seconds = Number(retryAfter);
  if (!retryAfter || !Number.isFinite(seconds) || seconds <= 0) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  const minutes = Math.ceil(seconds / 60);
  const unit = minutes === 1 ? "minute" : "minutes";
  return `Too many attempts. Please try again in ${minutes} ${unit}.`;
}
