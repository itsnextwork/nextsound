import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQueueContext } from '@/context/queueContext';
import { useAudioPlayerContext } from '@/context/audioPlayerContext';
import { QueueItem } from './QueueItem';
import { Button } from './button';
import { FiX, FiMusic } from 'react-icons/fi';
import { cn, getImageUrl } from '@/utils';
import { ITrack } from '@/types';

export const QueuePanel: React.FC = () => {
  const {
    queue,
    currentIndex,
    isQueuePanelOpen,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    closeQueuePanel,
  } = useQueueContext();

  const { currentTrack, playTrack } = useAudioPlayerContext();

  // Close panel on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQueuePanelOpen) {
        closeQueuePanel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isQueuePanelOpen, closeQueuePanel]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isQueuePanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isQueuePanelOpen]);

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderQueue(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < queue.length - 1) {
      reorderQueue(index, index + 1);
    }
  };

  // Determine which tracks to show
  // Show current track at top if it exists, then the queue
  const upcomingQueue = queue.slice(currentIndex + 1);

  return (
    <AnimatePresence>
      {isQueuePanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeQueuePanel}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <FiMusic className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Queue
                </h2>
                {queue.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                    {queue.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {queue.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearQueue}
                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Clear
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeQueuePanel}
                  aria-label="Close queue panel"
                >
                  <FiX className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Currently Playing Track */}
              {currentTrack && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10">
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-3 uppercase tracking-wide">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1" />
                    Now Playing
                  </div>
                  <div className="flex items-center gap-4">
                    <img
                      src={getImageUrl(currentTrack.poster_path)}
                      alt={currentTrack.name || currentTrack.title}
                      className="w-16 h-16 rounded-lg object-cover ring-2 ring-blue-500 dark:ring-blue-400 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {currentTrack.name || currentTrack.title || 'Unknown Track'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {currentTrack.artist || 'Unknown Artist'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Tracks */}
              <div className="p-4">
                {upcomingQueue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FiMusic className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No upcoming tracks
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      Add songs to your queue to see them here
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Up Next ({upcomingQueue.length})
                    </h3>
                    <div className="space-y-1">
                      {upcomingQueue.map((track, idx) => {
                        const actualIndex = currentIndex + 1 + idx;
                        return (
                          <QueueItem
                            key={`${track.id}-${actualIndex}`}
                            track={track}
                            index={actualIndex}
                            isFirst={idx === 0}
                            isLast={idx === upcomingQueue.length - 1}
                            onRemove={removeFromQueue}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            onPlay={playTrack}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
