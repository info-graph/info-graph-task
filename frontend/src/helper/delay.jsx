export const delay = async (startTime, minDelay = 2000) => {
  const elapsed = Date.now() - startTime;
  const delay = minDelay - elapsed;
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};