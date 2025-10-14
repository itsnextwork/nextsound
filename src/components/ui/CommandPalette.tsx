import React, { useEffect, useRef } from 'react';
import { Button } from 'react-aria-components';
import {
  FiSearch,
  FiMusic,
  FiDisc,
  FiUser,
  FiClock,
  FiX,
  FiPlay,
  FiSettings,
  FiHelpCircle,
  FiNavigation,
  FiTrash2
} from 'react-icons/fi';
import { cn } from '@/utils/helper';
import { useCommandPalette, SearchResult } from '@/hooks/useCommandPalette';

interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  onItemSelect?: (item: SearchResult) => void;
  audioPlayer?: any;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen = false,
  onClose,
  onItemSelect,
  audioPlayer,
  className
}) => {
  const {
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    allResults,
    exactMatches,
    recommendations,
    recentItems,
    isLoading,
    error,
    handleItemSelect,
    clearHistory
  } = useCommandPalette({ audioPlayer, onItemSelect, onClose });

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Note: Using real Spotify API data via useCommandPalette hook

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [allResults, setSelectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (allResults[selectedIndex]) {
            handleItemSelect(allResults[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allResults, selectedIndex, handleItemSelect, onClose, setSelectedIndex]);

  // Item selection is now handled by the useCommandPalette hook

  const getItemIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'track': return FiMusic;
      case 'album': return FiDisc;
      case 'artist': return FiUser;
      case 'playlist': return FiMusic;
      case 'command': return FiSearch;
      default: return FiMusic;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return FiNavigation;
      case 'player': return FiPlay;
      case 'settings': return FiSettings;
      case 'help': return FiHelpCircle;
      default: return FiSearch;
    }
  };

  const getItemTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'track': return 'Track';
      case 'album': return 'Album';
      case 'artist': return 'Artist';
      case 'playlist': return 'Playlist';
      case 'command': return 'Command';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20",
      className
    )}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-4 max-h-96 flex flex-col overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <FiSearch className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search music and artists..."
            className="flex-1 text-gray-900 dark:text-white placeholder-gray-500 bg-transparent outline-none text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <Button
              onPress={() => setQuery('')}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <FiX className="w-4 h-4" />
            </Button>
          )}
          <Button
            onPress={onClose}
            className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded border">
              ESC
            </kbd>
          </Button>
        </div>

        {/* Search Results */}
        <div ref={resultsRef} className="flex-1 overflow-y-auto">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-red-600 dark:text-red-400 text-center">
                Search failed. Please try again.
              </p>
            </div>
          )}

          {/* No query state - show recent items or quick access */}
          {!query && (
            <div className="p-4">
              {recentItems.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Recent
                    </h3>
                    <Button
                      onPress={clearHistory}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <FiTrash2 className="w-3 h-3" />
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentItems.map((item, _index) => {
                      const Icon = getItemIcon(item.type);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                          onClick={() => handleItemSelect(item)}
                        >
                          <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 mr-3 shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate text-sm">
                              {item.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                        <FiClock className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Search Music</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Find tracks, albums, artists</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Quick Access
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                      <FiClock className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Search Music</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Find tracks, albums, artists</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Search results */}
          {query && !isLoading && allResults.length > 0 && (
            <div className="py-2">
              {/* Exact matches section */}
              {exactMatches.length > 0 && (
                <div>
                  {/* Section header for exact matches */}
                  <div className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Top Results
                    </span>
                  </div>
                  {exactMatches.map((item, index) => {
                    const Icon = getItemIcon(item.type);
                    const CategoryIcon = item.type === 'command' ? getCategoryIcon(item.data?.category) : Icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center px-4 py-3 cursor-pointer transition-all duration-200",
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                        onClick={() => handleItemSelect(item)}
                      >
                        {/* Item image or icon */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 mr-3 shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <CategoryIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Item info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {item.subtitle}
                          </div>
                        </div>

                        {/* Item type badge */}
                        <div className="ml-3 shrink-0">
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                            item.type === 'track' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                            item.type === 'album' && "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                            item.type === 'artist' && "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
                            item.type === 'playlist' && "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
                            item.type === 'command' && "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                          )}>
                            {getItemTypeLabel(item.type)}
                          </span>
                        </div>

                        {/* Shortcut display for commands */}
                        {item.type === 'command' && item.data?.shortcut && isSelected && (
                          <div className="ml-2 shrink-0">
                            <kbd className="px-2 py-1 text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                              {item.data.shortcut}
                            </kbd>
                          </div>
                        )}

                        {/* Play button for tracks */}
                        {item.type === 'track' && isSelected && (
                          <div className="ml-2 shrink-0">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
                              <FiMusic className="w-3 h-3" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              )}

              {/* Recommendations section */}
              {recommendations.length > 0 && (
                <div>
                  {/* Section header for recommendations */}
                  <div className="px-4 py-2">
                    {exactMatches.length > 0 ? (
                      /* Show divider if there are exact matches above */
                      <div className="flex items-center">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                        <span className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Recommendations
                        </span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    ) : (
                      /* Show just a header if no exact matches */
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Search Results
                      </span>
                    )}
                  </div>
                  {recommendations.map((item, index) => {
                    const Icon = getItemIcon(item.type);
                    const CategoryIcon = item.type === 'command' ? getCategoryIcon(item.data?.category) : Icon;
                    const globalIndex = exactMatches.length + index;
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center px-4 py-3 cursor-pointer transition-all duration-200",
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                        onClick={() => handleItemSelect(item)}
                      >
                        {/* Item image or icon */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 mr-3 shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <CategoryIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Item info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {item.subtitle}
                          </div>
                        </div>

                        {/* Item type badge */}
                        <div className="ml-3 shrink-0">
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                            item.type === 'track' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                            item.type === 'album' && "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                            item.type === 'artist' && "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
                            item.type === 'playlist' && "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
                            item.type === 'command' && "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                          )}>
                            {getItemTypeLabel(item.type)}
                          </span>
                        </div>

                        {/* Shortcut display for commands */}
                        {item.type === 'command' && item.data?.shortcut && isSelected && (
                          <div className="ml-2 shrink-0">
                            <kbd className="px-2 py-1 text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                              {item.data.shortcut}
                            </kbd>
                          </div>
                        )}

                        {/* Play button for tracks */}
                        {item.type === 'track' && isSelected && (
                          <div className="ml-2 shrink-0">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
                              <FiMusic className="w-3 h-3" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {query && !isLoading && allResults.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-12">
              <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No results found for "<span className="font-medium">{query}</span>"
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Try different keywords or phrases
              </p>
            </div>
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>
                <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 rounded border text-xs">↑↓</kbd> to navigate
              </span>
              <span>
                <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 rounded border text-xs">↵</kbd> to select
              </span>
            </div>
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 rounded border text-xs">ESC</kbd> to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};