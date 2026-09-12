export async function waitUntil(
  checkFn: () => Promise<boolean>,
  timeout = 4000,
  interval = 50
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      if (await checkFn()) return;
    } catch (e) {
      // ignore errors in db, etc..
    }
    await new Promise((res) => setTimeout(res, interval));
  }

  throw new Error(`[Timeout Error] Test did not end after ${timeout}ms`);
}
