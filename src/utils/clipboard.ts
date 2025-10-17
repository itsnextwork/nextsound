import { ITrack } from '@/types';

/**
 * Formats multiple tracks into a shareable text format
 * @param tracks - Array of tracks to format
 * @returns Formatted string with track information
 */
export const formatTracksForSharing = (tracks: ITrack[]): string => {
  if (tracks.length === 0) {
    return '';
  }

  const header = tracks.length === 1
    ? 'Check out this track from NextSound:'
    : `Check out these ${tracks.length} tracks from NextSound:`;

  const trackList = tracks.map((track, index) => {
    const trackName = track.name || track.original_title || 'Unknown Track';
    const artistName = track.artist || 'Unknown Artist';
    const spotifyUrl = track.external_urls?.spotify;

    if (spotifyUrl) {
      return `${index + 1}. ${trackName} - ${artistName}\n   ${spotifyUrl}`;
    } else {
      return `${index + 1}. ${trackName} - ${artistName}`;
    }
  }).join('\n\n');

  return `${header}\n\n${trackList}`;
};

/**
 * Copies text to clipboard using the Clipboard API
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  // Check if Clipboard API is available
  if (!navigator.clipboard) {
    console.error('Clipboard API not available');

    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      return successful;
    } catch (error) {
      console.error('Fallback clipboard copy failed:', error);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
