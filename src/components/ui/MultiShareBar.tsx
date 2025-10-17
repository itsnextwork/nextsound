import React, { useEffect } from 'react';
import { Button } from './button';
import { FaShare, FaTimes, FaCheckDouble, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { cn } from '@/utils';
import { ITrack } from '@/types';

interface MultiShareBarProps {
  selectedTracks: ITrack[];
  onShare: () => void;
  onCancel: () => void;
  onSelectAll?: () => void;
  onClearAll?: () => void;
  isLoading?: boolean;
  hasReachedLimit?: boolean;
  maxLimit?: number;
  className?: string;
}

export const MultiShareBar: React.FC<MultiShareBarProps> = ({
  selectedTracks,
  onShare,
  onCancel,
  onSelectAll,
  onClearAll,
  isLoading = false,
  hasReachedLimit = false,
  maxLimit = 10,
  className
}) => {
  const selectedCount = selectedTracks.length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to cancel
      if (e.key === 'Escape' && selectedCount > 0) {
        e.preventDefault();
        onCancel();
      }

      // Cmd+Shift+S (Mac) or Ctrl+Shift+S (Windows/Linux) to share
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 's' && selectedCount > 0) {
        e.preventDefault();
        if (!isLoading) {
          onShare();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCount, onShare, onCancel, isLoading]);

  if (selectedCount === 0) return null;

  const handleShareClick = () => {
    console.log('🎯 MultiShareBar: Share button clicked with', selectedCount, 'tracks');
    onShare();
  };

  const handleCancelClick = () => {
    console.log('🎯 MultiShareBar: Cancel button clicked');
    onCancel();
  };

  const handleSelectAllClick = () => {
    console.log('🎯 MultiShareBar: Select All clicked');
    onSelectAll?.();
  };

  const handleClearAllClick = () => {
    console.log('🎯 MultiShareBar: Clear All clicked');
    onClearAll?.();
  };

  return (
    <div
      role="toolbar"
      aria-label="Multi-track selection toolbar"
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
        "bg-white dark:bg-gray-800 shadow-2xl rounded-2xl",
        "border-2 border-accent-orange dark:border-accent-orange",
        "px-4 sm:px-6 py-3 sm:py-4",
        "flex flex-col sm:flex-row items-center gap-3 sm:gap-4",
        "transition-all duration-300 ease-in-out",
        "animate-in slide-in-from-bottom-4 fade-in",
        "max-w-[95vw] sm:max-w-none",
        className
      )}
    >
      {/* Left section: Selected count and quick actions */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        {/* Selected count */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200",
            hasReachedLimit ? "bg-red-500" : "bg-accent-orange"
          )}>
            <span className="text-white font-bold text-sm">{selectedCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base">
              {selectedCount === 1 ? '1 track' : `${selectedCount} tracks`}
            </span>
            {hasReachedLimit && (
              <span className="text-xs text-red-500 dark:text-red-400">
                Max {maxLimit} reached
              </span>
            )}
          </div>
        </div>

        {/* Quick action buttons for mobile */}
        <div className="flex sm:hidden items-center gap-2">
          {onSelectAll && (
            <Button
              onClick={handleSelectAllClick}
              variant="ghost"
              size="icon"
              disabled={isLoading}
              aria-label="Select all tracks"
              className="w-8 h-8 text-gray-700 dark:text-gray-300"
            >
              <FaCheckDouble className="w-3 h-3" />
            </Button>
          )}
          {onClearAll && (
            <Button
              onClick={handleClearAllClick}
              variant="ghost"
              size="icon"
              disabled={isLoading}
              aria-label="Clear all selections"
              className="w-8 h-8 text-gray-700 dark:text-gray-300"
            >
              <FaTimesCircle className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Divider - hidden on mobile */}
      <div className="hidden sm:block w-px h-10 bg-gray-300 dark:bg-gray-600" />

      {/* Action buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Select All / Clear All - visible on desktop */}
        <div className="hidden sm:flex items-center gap-2">
          {onSelectAll && (
            <Button
              onClick={handleSelectAllClick}
              variant="ghost"
              disabled={isLoading}
              aria-label="Select all tracks"
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                "font-semibold px-3 py-2 rounded-full text-sm",
                "hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <FaCheckDouble className="w-3 h-3 mr-2" />
              Select All
            </Button>
          )}
          {onClearAll && (
            <Button
              onClick={handleClearAllClick}
              variant="ghost"
              disabled={isLoading}
              aria-label="Clear all selections"
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                "font-semibold px-3 py-2 rounded-full text-sm",
                "hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <FaTimesCircle className="w-3 h-3 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Share button */}
        <Button
          onClick={handleShareClick}
          disabled={isLoading}
          aria-label={`Share ${selectedCount} selected track${selectedCount === 1 ? '' : 's'}`}
          className={cn(
            "bg-accent-orange hover:bg-accent-orange/90 text-white",
            "font-semibold px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base",
            "transition-all duration-200 hover:scale-105",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            "flex-1 sm:flex-none"
          )}
        >
          {isLoading ? (
            <>
              <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
              Copying...
            </>
          ) : (
            <>
              <FaShare className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Share Selected</span>
              <span className="sm:hidden">Share</span>
            </>
          )}
        </Button>

        {/* Cancel button */}
        <Button
          onClick={handleCancelClick}
          variant="ghost"
          disabled={isLoading}
          aria-label="Cancel selection"
          className={cn(
            "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
            "font-semibold px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base",
            "hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <FaTimes className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Cancel</span>
        </Button>
      </div>

      {/* Keyboard shortcut hint - visible on desktop */}
      <div className="hidden lg:flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd>
        <span className="mx-1">to cancel</span>
        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded ml-2">⌘⇧S</kbd>
        <span className="mx-1">to share</span>
      </div>
    </div>
  );
};
