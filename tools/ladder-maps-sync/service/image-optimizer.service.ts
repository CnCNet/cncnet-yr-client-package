import sharp from 'sharp';
import { stat } from 'fs/promises';

export interface ImageOptimizationOptions {
  enabled: boolean;
  minFileSizeKB: number;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
}

export class ImageOptimizerService {
  constructor(private readonly options: ImageOptimizationOptions) {}

  async optimizeImage(imagePath: string): Promise<void> {
    if (!this.options.enabled) {
      return;
    }

    try {
      // Check file size
      const stats = await stat(imagePath);
      const fileSizeKB = stats.size / 1024;

      if (fileSizeKB < this.options.minFileSizeKB) {
        console.log(`    [INFO] Image size ${fileSizeKB.toFixed(1)}KB is below threshold, skipping optimization`);
        return;
      }

      console.log(`    [INFO] Optimizing image (${fileSizeKB.toFixed(1)}KB)...`);

      // Load the image
      let pipeline = sharp(imagePath);

      // Get metadata to check dimensions
      const metadata = await pipeline.metadata();

      // Resize if needed
      if (
        (this.options.maxWidth && metadata.width && metadata.width > this.options.maxWidth) ||
        (this.options.maxHeight && metadata.height && metadata.height > this.options.maxHeight)
      ) {
        pipeline = pipeline.resize(this.options.maxWidth, this.options.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Optimize and save back to the same file
      await pipeline
        .png({
          quality: this.options.quality,
          compressionLevel: 9,
          palette: true, // Use palette-based PNG if possible
        })
        .toFile(imagePath + '.tmp');

      // Check new size
      const newStats = await stat(imagePath + '.tmp');
      const newFileSizeKB = newStats.size / 1024;
      const savings = fileSizeKB - newFileSizeKB;
      const savingsPercent = (savings / fileSizeKB) * 100;

      // Only replace if we actually reduced the size
      if (newFileSizeKB < fileSizeKB) {
        const fs = await import('fs/promises');
        await fs.rename(imagePath + '.tmp', imagePath);
        console.log(
          `    [INFO] Optimized: ${fileSizeKB.toFixed(1)}KB → ${newFileSizeKB.toFixed(1)}KB (saved ${savings.toFixed(1)}KB, ${savingsPercent.toFixed(1)}%)`
        );
      } else {
        // Keep original if optimization didn't help
        const fs = await import('fs/promises');
        await fs.unlink(imagePath + '.tmp');
        console.log(`    [INFO] Kept original (optimization didn't reduce size)`);
      }
    } catch (error) {
      console.warn(
        `    [WARN] Failed to optimize image:`,
        error instanceof Error ? error.message : String(error)
      );
      // Clean up temp file if it exists
      try {
        const fs = await import('fs/promises');
        await fs.unlink(imagePath + '.tmp');
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
