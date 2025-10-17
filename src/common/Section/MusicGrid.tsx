import { FC, useState } from "react";
import { TrackCard } from "@/components/ui/TrackCard";
import { MultiShareBar } from "@/components/ui/MultiShareBar";
import { useMultiShare } from "@/hooks/useMultiShare";
import { ITrack } from "@/types";

interface MusicGridProps {
  tracks: ITrack[];
  category: string;
  initialDisplayCount?: number;
  loadMoreCount?: number;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMoreContent?: boolean;
  enableMultiShare?: boolean;
}

const MusicGrid: FC<MusicGridProps> = ({
  tracks,
  category,
  initialDisplayCount = 18, // Show 3 rows initially (6 columns * 3 rows)
  loadMoreCount = 18, // Load 3 more rows each time
  onLoadMore,
  isLoadingMore = false,
  hasMoreContent = false,
  enableMultiShare = false
}) => {
  const [visibleCount, setVisibleCount] = useState(initialDisplayCount);

  // Use custom hook for multi-share functionality
  const {
    selectedTracks,
    selectTrack,
    selectAll,
    shareSelected,
    clearSelection,
    isTrackSelected,
    isLoading,
    hasReachedLimit,
    maxLimit
  } = useMultiShare({ maxSelectionLimit: 10 });

  const handlePlay = (track: ITrack) => {
    console.log('🎵 Track clicked (audio player removed):', track.name || track.title);
    // Audio player functionality removed - this is now just a visual music browser
  };

  const handleSelect = (track: ITrack, selected: boolean) => {
    console.log('🎯 MusicGrid: Track selection changed:', track.name || track.original_title, 'Selected:', selected);
    selectTrack(track, selected);
  };

  const handleShare = async () => {
    console.log('🎯 MusicGrid: Share clicked with', selectedTracks.length, 'tracks:', selectedTracks.map(t => t.name || t.original_title));
    await shareSelected();
  };

  const handleCancel = () => {
    console.log('🎯 MusicGrid: Cancel clicked, clearing', selectedTracks.length, 'selected tracks');
    clearSelection();
  };

  const handleSelectAll = () => {
    console.log('🎯 MusicGrid: Select All clicked with', displayedTracks.length, 'displayed tracks');
    selectAll(displayedTracks);
  };

  const handleLoadMoreClick = () => {
    if (tracks.length > visibleCount) {
      // Show more of existing tracks first
      setVisibleCount(prev => Math.min(prev + loadMoreCount, tracks.length));
    } else if (onLoadMore && hasMoreContent) {
      // Load new tracks from API
      onLoadMore();
      setVisibleCount(prev => prev + loadMoreCount);
    }
  };

  const displayedTracks = tracks.slice(0, visibleCount);
  const showLoadMoreButton =
    (tracks.length > visibleCount) || // More existing tracks to show
    (hasMoreContent && !isLoadingMore); // Or more content available from API

  return (
    <div className="w-full">
      {/* Grid container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
        {displayedTracks.map((track) => (
          <div key={track.id} className="flex flex-col">
            <TrackCard
              track={track}
              category={category}
              isPlaying={false}
              onPlay={handlePlay}
              variant="detailed"
              selectable={enableMultiShare}
              isSelected={isTrackSelected(track.id)}
              onSelect={handleSelect}
            />
          </div>
        ))}
      </div>

      {/* Multi-share action bar */}
      {enableMultiShare && (
        <MultiShareBar
          selectedTracks={selectedTracks}
          onShare={handleShare}
          onCancel={handleCancel}
          onSelectAll={handleSelectAll}
          onClearAll={handleCancel}
          isLoading={isLoading}
          hasReachedLimit={hasReachedLimit}
          maxLimit={maxLimit}
        />
      )}

      {/* Load More Button */}
      {showLoadMoreButton && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMoreClick}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {isLoadingMore ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      {/* Loading indicator when fetching more content */}
      {isLoadingMore && !showLoadMoreButton && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            Loading more tracks...
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicGrid;