/**
 * ImageKit URL helpers
 *
 * Builds optimized URLs for videos and auto-generated thumbnails.
 * ImageKit supports URL transformations via the `tr` query parameter.
 */

/**
 * Appends ImageKit transformations to a video URL for optimal streaming.
 * - f-auto: auto-selects best format (WebM, MP4, etc.) supported by the browser
 * - q-auto: auto-selects optimal quality (good balance of size vs quality)
 */
export function getOptimizedVideoUrl(imageKitUrl: string): string {
  if (!imageKitUrl) return imageKitUrl;
  try {
    const url = new URL(imageKitUrl);
    // Only apply to ImageKit URLs
    if (!url.hostname.includes('imagekit.io')) return imageKitUrl;
    // Append transformation params
    url.searchParams.set('tr', 'f-auto,q-auto');
    return url.toString();
  } catch {
    return imageKitUrl;
  }
}

/**
 * Generates a thumbnail image URL from an ImageKit video URL.
 * ImageKit can auto-generate video thumbnails via the /ik-thumbnail.jpg endpoint.
 *
 * For vertical (9:16 TikTok): 400x711 snapshot at 1 second
 * For horizontal (16:9 YouTube): 640x360 snapshot at 1 second
 */
export function getVideoThumbnailUrl(
  imageKitUrl: string,
  aspectRatio: 'vertical' | 'horizontal' = 'vertical'
): string {
  if (!imageKitUrl) return '';
  try {
    const url = new URL(imageKitUrl);
    if (!url.hostname.includes('imagekit.io')) return '';

    // Build the thumbnail URL: append /ik-thumbnail.jpg after the video path
    const thumbUrl = new URL(imageKitUrl);
    thumbUrl.pathname = thumbUrl.pathname + '/ik-thumbnail.jpg';

    if (aspectRatio === 'horizontal') {
      // 16:9 - 640x360
      thumbUrl.searchParams.set('tr', 'so-1,w-640,h-360,fo-center');
    } else {
      // 9:16 - 400x711
      thumbUrl.searchParams.set('tr', 'so-1,w-400,h-711,fo-center');
    }

    return thumbUrl.toString();
  } catch {
    return '';
  }
}
