import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

export class MapDownloadService {
  private async fetchWithRetry(
    url: string,
    maxRetries: number,
    retryDelayMs: number,
    timeoutMs: number
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'cncnet-yr-client-package-maps-sync/1.0',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          const delay = retryDelayMs * Math.pow(2, attempt);
          console.warn(
            `  [WARN] Download attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
            error instanceof Error ? error.message : String(error)
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Failed to download after ${maxRetries + 1} attempts: ${lastError?.message}`);
  }

  async downloadFile(
    url: string,
    destPath: string,
    maxRetries: number = 3,
    retryDelayMs: number = 1000,
    timeoutMs: number = 30000
  ): Promise<void> {
    const response = await this.fetchWithRetry(url, maxRetries, retryDelayMs, timeoutMs);

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const stream = Readable.fromWeb(response.body as any);
    const writeStream = createWriteStream(destPath);

    await pipeline(stream, writeStream);
  }
}
