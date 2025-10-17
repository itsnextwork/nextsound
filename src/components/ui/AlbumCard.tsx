import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import {
  FaPlay,
  FaPause,
  FaClock,
  FaMusic,
  FaCalendarAlt,
  FaUser,
  FaShare,
  FaCheck
} from 'react-icons/fa';
import { ITrack, IAlbum } from '@/types';
import { getImageUrl, cn, copyToClipboard } from '@/utils';
import { addToast } from './use-toast';

interface AlbumCardProps {
  album: IAlbum; // Using IAlbum for proper album properties
  isPlaying?: boolean;
  onPlay?: (album: IAlbum) => void;
  onTrackPlay?: (track: ITrack) => void;
  variant?: 'compact' | 'detailed' | 'featured';
  className?: string;
  tracks?: ITrack[]; // Optional track listings for expanded view
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  isPlaying = false,
  onPlay,
  onTrackPlay: _onTrackPlay,
  variant = 'detailed',
  className,
  tracks = []
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const { poster_path, original_title: title, name, artists } = album;
  const displayTitle = title || name || 'Unknown Album';
  const artistName = artists && artists.length > 0 ? artists.join(', ') : 'Unknown Artist';

  // Album-specific metadata
  const releaseYear = album.release_date ? new Date(album.release_date).getFullYear() : null;
  const trackCount = album.total_tracks || tracks.length || 0;
  const totalDuration = tracks.reduce((sum, track) => sum + (track.duration || 0), 0);


  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay?.(album);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const spotifyUrl = album.external_urls?.spotify;
    const albumName = album.name || album.original_title || 'Unknown Album';

    // Check if URL is available
    if (!spotifyUrl) {
      addToast({
        title: 'No link available',
        description: 'This album does not have a Spotify link',
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
          description: `${albumName} by ${artistName}`,
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



  const formatTotalDuration = (totalMs: number) => {
    if (!totalMs) return '';
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const cardHeight = variant === 'compact' ? 'h-64' : variant === 'featured' ? 'h-96' : 'h-80';
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
        "w-[200px]", // Slightly wider for album metadata
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Content */}
      <div className="block relative">
        {/* Album Art Container */}
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
                "w-16 h-16 rounded-full shadow-xl transition-all duration-200",
                "bg-accent-orange hover:bg-accent-orange/90",
                "hover:scale-110 text-white"
              )}
            >
              {isPlaying ? (
                <FaPause className="w-7 h-7 ml-0.5" />
              ) : (
                <FaPlay className="w-7 h-7 ml-1" />
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

        {/* Album information */}
        <CardContent className="p-0 space-y-2">
          {/* Album title */}
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
            <FaUser className="w-3 h-3 inline mr-1 opacity-60" />
            {artistName}
          </p>

          {/* Album metadata */}
          {variant === 'detailed' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-text-muted dark:text-text-secondary/70">
                {releaseYear && (
                  <span className="flex items-center">
                    <FaCalendarAlt className="w-3 h-3 mr-1 opacity-60" />
                    {releaseYear}
                  </span>
                )}
                {trackCount > 0 && (
                  <span className="flex items-center">
                    <FaMusic className="w-3 h-3 mr-1 opacity-60" />
                    {trackCount} tracks
                  </span>
                )}
              </div>
              {totalDuration > 0 && (
                <div className="flex items-center text-xs text-text-muted dark:text-text-secondary/70">
                  <FaClock className="w-3 h-3 mr-1 opacity-60" />
                  {formatTotalDuration(totalDuration)}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>


      {/* Hover glow effect */}
      <div className={cn(
        "absolute -inset-1 bg-gradient-to-r from-spotify-green via-accent-orange to-warning-amber rounded-2xl opacity-0 transition-opacity duration-500 -z-10 blur-md",
        isHovered && "opacity-10"
      )} />
    </Card>
  );
};