import React from 'react';
import { ITrack } from '@/types';
import { getImageUrl, cn } from '@/utils';
import { Button } from './button';
import { FiX, FiChevronUp, FiChevronDown } from 'react-icons/fi';

interface QueueItemProps {
  track: ITrack;
  index: number;
  isCurrentTrack?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onRemove: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onPlay?: (track: ITrack) => void;
}

export const QueueItem: React.FC<QueueItemProps> = ({
  track,
  index,
  isCurrentTrack = false,
  isFirst = false,
  isLast = false,
  onRemove,
  onMoveUp,
  onMoveDown,
  onPlay,
}) => {
  const { poster_path, original_title: title, name, artist, duration } = track;
  const displayTitle = title || name || 'Unknown Track';

  const formatDuration = (ms: number) => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        isCurrentTrack && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
      )}
    >
      {/* Track thumbnail */}
      <div className="relative flex-shrink-0">
        <img
          src={getImageUrl(poster_path)}
          alt={displayTitle}
          className={cn(
            "w-12 h-12 rounded-lg object-cover",
            isCurrentTrack && "ring-2 ring-blue-500 dark:ring-blue-400"
          )}
        />
        {isCurrentTrack && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Track info */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onPlay?.(track)}
      >
        <h4
          className={cn(
            "font-medium text-sm truncate",
            isCurrentTrack
              ? "text-blue-700 dark:text-blue-300"
              : "text-gray-900 dark:text-gray-100"
          )}
        >
          {displayTitle}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
          {artist || 'Unknown Artist'}
        </p>
        {duration && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
            {formatDuration(duration)}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Reorder buttons */}
        {!isFirst && onMoveUp && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(index);
            }}
            aria-label="Move up"
          >
            <FiChevronUp className="w-4 h-4" />
          </Button>
        )}
        {!isLast && onMoveDown && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(index);
            }}
            aria-label="Move down"
          >
            <FiChevronDown className="w-4 h-4" />
          </Button>
        )}
        
        {/* Remove button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          aria-label="Remove from queue"
        >
          <FiX className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
