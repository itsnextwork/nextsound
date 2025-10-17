import { useState, useCallback } from 'react';
import { ITrack } from '@/types';
import { formatTracksForSharing, copyToClipboard } from '@/utils/clipboard';
import { addToast } from '@/components/ui/use-toast';

export interface UseMultiShareOptions {
  maxSelectionLimit?: number;
}

export interface UseMultiShareReturn {
  selectedTracks: ITrack[];
  selectTrack: (track: ITrack, selected: boolean) => void;
  selectAll: (tracks: ITrack[]) => void;
  shareSelected: () => Promise<void>;
  clearSelection: () => void;
  isTrackSelected: (trackId: number) => boolean;
  isLoading: boolean;
  hasReachedLimit: boolean;
  maxLimit: number;
}

const DEFAULT_MAX_LIMIT = 10;

/**
 * Custom hook for managing multi-track selection and sharing
 * @param options - Configuration options
 * @returns Object with selection state and handler functions
 */
export const useMultiShare = (options?: UseMultiShareOptions): UseMultiShareReturn => {
  const maxLimit = options?.maxSelectionLimit ?? DEFAULT_MAX_LIMIT;
  const [selectedTracks, setSelectedTracks] = useState<ITrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectTrack = useCallback((track: ITrack, selected: boolean) => {
    if (selected) {
      setSelectedTracks(prev => {
        // Check if limit reached
        if (prev.length >= maxLimit) {
          addToast({
            title: 'Selection limit reached',
            description: `You can only select up to ${maxLimit} tracks at once`,
            variant: 'error',
          });
          return prev;
        }
        return [...prev, track];
      });
    } else {
      setSelectedTracks(prev => prev.filter(t => t.id !== track.id));
    }
  }, [maxLimit]);

  const selectAll = useCallback((tracks: ITrack[]) => {
    const tracksToSelect = tracks.slice(0, maxLimit);
    setSelectedTracks(tracksToSelect);

    if (tracks.length > maxLimit) {
      addToast({
        title: 'Selection limit applied',
        description: `Selected first ${maxLimit} tracks (limit reached)`,
        variant: 'default',
      });
    } else {
      addToast({
        title: 'All tracks selected',
        description: `${tracks.length} tracks selected`,
        variant: 'success',
      });
    }
  }, [maxLimit]);

  const shareSelected = useCallback(async () => {
    if (selectedTracks.length === 0) {
      return;
    }

    setIsLoading(true);

    try {
      // Format tracks for sharing
      const shareText = formatTracksForSharing(selectedTracks);

      if (!shareText) {
        addToast({
          title: 'No content to share',
          description: 'Please select tracks with valid information',
          variant: 'error',
        });
        return;
      }

      // Copy to clipboard
      const success = await copyToClipboard(shareText);

      if (success) {
        // Show success toast
        const trackWord = selectedTracks.length === 1 ? 'track' : 'tracks';
        addToast({
          title: 'Links copied!',
          description: `${selectedTracks.length} ${trackWord} copied to clipboard`,
          variant: 'success',
        });

        // Clear selection after successful share
        setSelectedTracks([]);
      } else {
        addToast({
          title: 'Failed to copy',
          description: 'Please try again',
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error sharing tracks:', error);
      addToast({
        title: 'Failed to copy',
        description: 'An error occurred while copying',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedTracks]);

  const clearSelection = useCallback(() => {
    setSelectedTracks([]);
  }, []);

  const isTrackSelected = useCallback((trackId: number) => {
    return selectedTracks.some(t => t.id === trackId);
  }, [selectedTracks]);

  const hasReachedLimit = selectedTracks.length >= maxLimit;

  return {
    selectedTracks,
    selectTrack,
    selectAll,
    shareSelected,
    clearSelection,
    isTrackSelected,
    isLoading,
    hasReachedLimit,
    maxLimit,
  };
};
