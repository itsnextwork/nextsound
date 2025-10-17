import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import {
  FaPlay,
  FaPause,
  FaClock,
  FaShare,
  FaCheck
} from 'react-icons/fa';
import { ITrack } from '@/types';
import { getImageUrl, cn, copyToClipboard } from '@/utils';
import { addToast } from './use-toast';

interface TrackCardProps {
  track: ITrack;
  category: string;
  isPlaying?: boolean;
  onPlay?: (track: ITrack) => void;
  variant?: 'compact' | 'detailed' | 'featured';
  className?: string;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (track: ITrack, selected: boolean) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  category: _category,
  isPlaying = false,
  onPlay,
  variant = 'detailed',
  className,
  selectable = false,
  isSelected = false,
  onSelect
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const { poster_path, original_title: title, name, artist, album, duration } = track;
  const displayTitle = title || name || 'Unknown Track';


  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 TrackCard: Play button clicked for track:', track.name || track.original_title);
    console.log('🎯 TrackCard: onPlay function available:', !!onPlay);
    onPlay?.(track);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 TrackCard: Checkbox clicked for track:', track.name || track.original_title, 'New state:', !isSelected);
    onSelect?.(track, !isSelected);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const spotifyUrl = track.external_urls?.spotify;
    const trackName = track.name || track.original_title || 'Unknown Track';
    const artistName = track.artist || 'Unknown Artist';

    // Check if URL is available
    if (!spotifyUrl) {
      addToast({
        title: 'No link available',
        description: 'This track does not have a Spotify link',
        variant: 'error',
      });
      return;
    }

    // Set loading state
    setIsCopying(true);

    try {
      // Copy to clipboard
      const success = await copyToClipboard(spotifyUrl);

      if (success) {
        // Show success state
        setIsCopied(true);

        // Show success toast
        addToast({
          title: 'Link copied!',
          description: `${trackName} by ${artistName}`,
          variant: 'success',
        });

        // Reset after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } else {
        addToast({
          title: 'Failed to copy link',
          description: 'Please try again',
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      addToast({
        title: 'Failed to copy link',
        description: 'Please try again',
        variant: 'error',
      });
    } finally {
      setIsCopying(false);
    }
  };


  const formatDuration = (ms: number) => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  const cardHeight = variant === 'compact' ? 'h-52' : variant === 'featured' ? 'h-84' : 'h-80';
  const imageHeight = variant === 'compact' ? 160 : variant === 'featured' ? 240 : 200;

  return (
    <Card
      className={cn(
        "group relative transition-all duration-300 ease-out overflow-hidden",
        "hover:scale-[1.03] hover:-translate-y-2 cursor-pointer",
        "bg-white dark:bg-card-dark border-0",
        "shadow-sm hover:shadow-card-hover",
        "rounded-xl p-4",
        cardHeight,
        "w-[180px]", // Slightly wider for better proportions
        isSelected && "ring-2 ring-accent-orange ring-offset-2 dark:ring-offset-gray-900",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Content */}
      <div className="block relative h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-lg mb-3">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-hover-gray animate-pulse rounded-lg" 
                 style={{ height: imageHeight }} />
          )}
          
          {/* Album artwork */}
          <img
            src={getImageUrl(poster_path)}
            alt={displayTitle}
            className={cn(
              "w-full object-cover transition-all duration-300 rounded-lg",
              "group-hover:scale-105",
              "dark:brightness-75 dark:contrast-110 dark:saturate-90",
              "dark:group-hover:brightness-90 dark:group-hover:contrast-105 dark:group-hover:saturate-95",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{ height: imageHeight }}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Gradient overlay on hover */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 rounded-lg",
            isHovered ? "opacity-100" : "opacity-0"
          )} />

          {/* Checkbox for multi-select - top left */}
          {selectable && (
            <div className={cn(
              "absolute top-2 left-2 transition-all duration-300 z-10",
              (isHovered || isSelected) ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}>
              <button
                onClick={handleCheckboxClick}
                className={cn(
                  "w-6 h-6 rounded-md border-2 transition-all duration-200 flex items-center justify-center",
                  isSelected
                    ? "bg-accent-orange border-accent-orange"
                    : "bg-white/90 dark:bg-gray-800/90 border-white dark:border-gray-600 hover:border-accent-orange dark:hover:border-accent-orange"
                )}
              >
                {isSelected && <FaCheck className="w-3 h-3 text-white" />}
              </button>
            </div>
          )}

          {/* Share button - top right */}
          <div className={cn(
            "absolute top-2 right-2 transition-all duration-300 z-10",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          )}>
            <Button
              onClick={handleShareClick}
              variant="ghost"
              size="icon"
              disabled={isCopying}
              className={cn(
                "w-9 h-9 rounded-full shadow-lg transition-all duration-200",
                isCopied
                  ? "bg-success-green hover:bg-success-green text-white"
                  : "bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
                "hover:scale-110",
                isCopying && "opacity-50 cursor-not-allowed"
              )}
            >
              {isCopied ? (
                <FaCheck className="w-4 h-4" />
              ) : (
                <FaShare className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Play button overlay */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}>
            <Button
              onClick={handlePlayClick}
              variant="ghost"
              size="icon"
              className={cn(
                "w-14 h-14 rounded-full shadow-xl transition-all duration-200",
                "bg-accent-orange hover:bg-accent-orange/90",
                "hover:scale-110 text-white"
              )}
            >
              {isPlaying ? (
                <FaPause className="w-6 h-6 ml-0.5" />
              ) : (
                <FaPlay className="w-6 h-6 ml-1" />
              )}
            </Button>
          </div>



          {/* Playing indicator */}
          {isPlaying && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-success-green rounded-full shadow-lg backdrop-blur-sm">
                <div className="flex space-x-0.5">
                  <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-xs text-white font-semibold">Playing</span>
              </div>
            </div>
          )}
        </div>

        {/* Track information */}
        <CardContent className="p-0 space-y-2">
          {/* Track title */}
          <h3 className={cn(
            "font-semibold text-gray-900 dark:text-text-primary truncate transition-colors duration-200",
            variant === 'compact' ? "text-sm" : "text-base",
            "group-hover:text-accent-orange dark:group-hover:text-accent-orange"
          )}>
            {displayTitle}
          </h3>
          
          {/* Artist name */}
          <p className={cn(
            "text-gray-600 dark:text-text-secondary truncate font-medium",
            variant === 'compact' ? "text-xs" : "text-sm"
          )}>
            {artist || 'Unknown Artist'}
          </p>

          {/* Additional info for detailed variant */}
          {variant === 'detailed' && (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2 flex-1 mr-2">
                {album && (
                  <span className="text-xs text-text-muted dark:text-text-secondary/70 truncate">
                    {album}
                  </span>
                )}
              </div>
              {duration && (
                <div className="flex items-center text-xs text-text-muted dark:text-text-secondary/70 shrink-0">
                  <FaClock className="w-3 h-3 mr-1 opacity-60" />
                  {formatDuration(duration)}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Hover glow effect */}
      <div className={cn(
        "absolute -inset-1 bg-gradient-to-r from-spotify-green via-accent-orange to-warning-amber rounded-2xl opacity-0 transition-opacity duration-500 -z-10 blur-md",
        "dark:bg-gradient-to-r dark:from-blue-800 dark:via-slate-600 dark:to-blue-800",
        isHovered && "opacity-10"
      )} />
    </Card>
  );
};