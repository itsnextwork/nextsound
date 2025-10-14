import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-aria-components';
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiVolumeX,
  FiShuffle,
  FiRepeat,
  FiHeart,
  FiMoreHorizontal,
  FiMinimize2,
  FiMaximize2
} from 'react-icons/fi';
import { ITrack } from '@/types';
import { getImageUrl } from '@/utils/helper';
import { cn } from '@/utils/helper';

interface MiniPlayerProps {
  currentTrack?: ITrack | null;
  isPlaying?: boolean;
  progress?: number;
  volume?: number;
  isShuffled?: boolean;
  repeatMode?: 'off' | 'one' | 'all';
  onTogglePlay?: () => void;
  onSkipPrevious?: () => void;
  onSkipNext?: () => void;
  onSeek?: (position: number) => void;
  onVolumeChange?: (volume: number) => void;
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  onToggleFavorite?: () => void;
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  className?: string;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentTrack,
  isPlaying = false,
  progress = 0,
  volume = 80,
  isShuffled = false,
  repeatMode = 'off',
  onTogglePlay,
  onSkipPrevious,
  onSkipNext,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
  isMinimized = false,
  onToggleMinimize,
  className
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const progressRef = useRef<HTMLDivElement>(null);

  // Update local progress when prop changes (but not while dragging)
  useEffect(() => {
    if (!isDragging) {
      setLocalProgress(progress);
    }
  }, [progress, isDragging]);

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeClick = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange?.(volume);
    } else {
      setIsMuted(true);
      onVolumeChange?.(0);
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite?.();
  };

  const duration = currentTrack.duration || 180000; // Fallback to 3 minutes
  const currentTime = (localProgress / 100) * duration / 1000;
  const totalTime = duration / 1000;

  if (isMinimized) {
    return (
      <div className={cn(
        "fixed bottom-4 right-4 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50 transition-all duration-300 hover:scale-105",
        className
      )}>
        <div className="flex items-center space-x-2">
          <img
            src={getImageUrl(currentTrack.poster_path)}
            alt={currentTrack.title || currentTrack.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <Button
            onPress={onTogglePlay}
            className="flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
          >
            {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4 ml-0.5" />}
          </Button>
          <Button
            onPress={onToggleMinimize}
            className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <FiMaximize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 z-40 transition-all duration-300",
      className
    )}>
      {/* Progress bar - full width at top */}
      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 cursor-pointer group" ref={progressRef}>
        <div 
          className="h-full bg-blue-600 transition-all duration-100 rounded-full relative group-hover:bg-blue-500"
          style={{ width: `${localProgress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mr-1.5"></div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        {/* Track info */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="relative">
            <img
              src={getImageUrl(currentTrack.poster_path)}
              alt={currentTrack.title || currentTrack.name}
              className="w-12 h-12 rounded-lg object-cover shadow-md dark:brightness-75 dark:contrast-110 dark:saturate-90"
            />
            {/* Audio visualizer dots */}
            {isPlaying && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <div className="flex space-x-0.5">
                  <div className="w-0.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  <div className="w-0.5 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-0.5 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
              {currentTrack.title || currentTrack.name || 'Unknown Track'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 truncate text-xs">
              {currentTrack.artist || 'Unknown Artist'}
            </p>
          </div>
          
          <Button
            onPress={handleFavoriteClick}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110",
              isFavorite 
                ? "text-red-500 hover:text-red-600" 
                : "text-gray-400 hover:text-red-500 dark:text-gray-500"
            )}
          >
            <FiHeart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </Button>
        </div>

        {/* Main controls */}
        <div className="flex items-center space-x-4 px-8">
          {/* Shuffle */}
          <Button
            onPress={onToggleShuffle}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110",
              isShuffled 
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            )}
          >
            <FiShuffle className="w-4 h-4" />
          </Button>

          {/* Previous */}
          <Button
            onPress={onSkipPrevious}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:scale-110"
          >
            <FiSkipBack className="w-5 h-5" />
          </Button>

          {/* Play/Pause */}
          <Button
            onPress={onTogglePlay}
            className="flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          >
            {isPlaying ? (
              <FiPause className="w-6 h-6" />
            ) : (
              <FiPlay className="w-6 h-6 ml-0.5" />
            )}
          </Button>

          {/* Next */}
          <Button
            onPress={onSkipNext}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:scale-110"
          >
            <FiSkipForward className="w-5 h-5" />
          </Button>

          {/* Repeat */}
          <Button
            onPress={onToggleRepeat}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 relative",
              repeatMode !== 'off' 
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            )}
          >
            <FiRepeat className="w-4 h-4" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
            )}
          </Button>
        </div>

        {/* Time and volume */}
        <div className="flex items-center space-x-4 min-w-0 flex-1 justify-end">
          {/* Time display */}
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {formatTime(currentTime)} / {formatTime(totalTime)}
          </div>

          {/* Volume control */}
          <div 
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <Button
              onPress={handleVolumeClick}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
            >
              {isMuted || volume === 0 ? (
                <FiVolumeX className="w-4 h-4" />
              ) : (
                <FiVolume2 className="w-4 h-4" />
              )}
            </Button>
            
            {/* Volume slider */}
            {showVolumeSlider && (
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
                <div className="w-20 h-24 flex flex-col items-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{volume}%</div>
                  <div className="flex-1 w-1 bg-gray-200 dark:bg-gray-600 rounded-full relative">
                    <div 
                      className="w-full bg-blue-600 rounded-full absolute bottom-0"
                      style={{ height: `${volume}%` }}
                    />
                    <div 
                      className="absolute w-3 h-3 bg-blue-600 rounded-full -ml-1 cursor-pointer"
                      style={{ bottom: `${volume}%`, marginBottom: '-6px' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* More options */}
          <Button className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200">
            <FiMoreHorizontal className="w-4 h-4" />
          </Button>

          {/* Minimize */}
          <Button
            onPress={onToggleMinimize}
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <FiMinimize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};