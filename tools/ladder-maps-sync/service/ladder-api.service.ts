import type { LadderMap } from '../interface/ladder-map.interface.js';

export class LadderApiService {
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
            Accept: 'application/json',
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
          const delay = retryDelayMs * Math.pow(2, attempt); // Exponential backoff
          console.warn(
            `  [WARN] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
            error instanceof Error ? error.message : String(error)
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Failed to fetch after ${maxRetries + 1} attempts: ${lastError?.message}`);
  }

  async fetchLadderMaps(
    apiEndpoint: string,
    maxRetries: number = 3,
    retryDelayMs: number = 1000,
    timeoutMs: number = 30000
  ): Promise<LadderMap[]> {
    console.log(`  Fetching ladder maps from: ${apiEndpoint}`);

    const response = await this.fetchWithRetry(apiEndpoint, maxRetries, retryDelayMs, timeoutMs);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid API response: expected array of maps');
    }

    console.log(`  Found ${data.length} maps in ladder API`);
    return data as LadderMap[];
  }
}
