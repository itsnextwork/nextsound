import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchMusicQuery } from '@/services/SpotifyAPI';
import { ITrack } from '@/types';
import { useTheme } from '@/context/themeContext';
import { useGlobalContext } from '@/context/globalContext';
import { getMockData, shouldUseMockData } from '@/data/mockMusicData';
import { performEnhancedSearch } from '@/utils/searchAlgorithm';

export interface SearchResult {
  id: string;
  type: 'track' | 'album' | 'artist' | 'playlist' | 'command';
  title: string;
  subtitle: string;
  image?: string;
  data: any;
  action?: () => void;
  isExactMatch?: boolean;
}

export interface Command {
  id: string;
  title: string;
  subtitle: string;
  category: 'navigation' | 'player' | 'search' | 'settings' | 'help';
  action: () => void;
  keywords: string[];
  shortcut?: string;
  icon?: string;
}

interface UseCommandPaletteProps {
  audioPlayer?: any;
  onItemSelect?: (item: SearchResult) => void;
  onClose?: () => void;
}

export const useCommandPalette = ({
  onItemSelect,
  onClose
}: UseCommandPaletteProps) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { showSidebar, setShowSidebar } = useGlobalContext();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchResult[]>([]);
  const [mockSearchResults, setMockSearchResults] = useState<Array<{ track: ITrack; isExactMatch: boolean }>>([]);
  const [isMockSearchLoading, setIsMockSearchLoading] = useState(false);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nextsound_search_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentSearches(parsed.queries || []);
        setSearchHistory(parsed.items || []);
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Handle mock search when in demo mode
  useEffect(() => {
    const useMockData = shouldUseMockData();
    const searchQuery = query.trim();

    if (useMockData && searchQuery) {
      setIsMockSearchLoading(true);

      // Simulate search delay for better UX
      const searchTimeout = setTimeout(() => {
        try {
          // Get comprehensive mock data from all sources
          const latestHits = getMockData('tracks', 'latest');
          const popularTracks = getMockData('tracks', 'popular');
          const allTracks = [...latestHits.results, ...popularTracks.results];

          // Perform enhanced search using shared utility (limit to 8 results for Command Palette)
          const results = performEnhancedSearch(allTracks, searchQuery, 8);
          // Map SearchResult[] to { track, isExactMatch }
          setMockSearchResults(results.map(result => ({ track: result.track, isExactMatch: result.isExactMatch })));
        } catch (error) {
          console.error('Mock search error:', error);
          setMockSearchResults([]);
        } finally {
          setIsMockSearchLoading(false);
        }
      }, 100);

      return () => clearTimeout(searchTimeout);
    } else if (!searchQuery) {
      // Clear results when query is empty
      setMockSearchResults([]);
      setIsMockSearchLoading(false);
    }
  }, [query]);

  // Search for music when query changes (only when not using mock data)
  const useMockData = shouldUseMockData();
  const {
    data: musicSearchData,
    isLoading: isMusicSearchLoading,
    error: musicSearchError
  } = useSearchMusicQuery(
    {
      query: query.trim(),
      type: 'track',
      limit: 8
    },
    {
      skip: !query.trim() || useMockData // Skip Spotify API when using mock data
    }
  );

  // Define app commands
  const commands: Command[] = useMemo(() => [
    // Navigation Commands
    {
      id: 'nav-home',
      title: 'Go to Home',
      subtitle: 'Navigate to the homepage',
      category: 'navigation',
      action: () => navigate('/'),
      keywords: ['home', 'homepage', 'main', 'start'],
      icon: '🏠'
    },


    // Settings Commands
    {
      id: 'settings-theme',
      title: 'Toggle Dark Mode',
      subtitle: `Switch to ${theme === 'Dark' ? 'light' : 'dark'} theme`,
      category: 'settings',
      action: () => setTheme(theme === 'Dark' ? 'Light' : 'Dark'),
      keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
      shortcut: '⌘+D',
      icon: theme === 'Dark' ? '☀️' : '🌙'
    },
    {
      id: 'settings-sidebar',
      title: showSidebar ? 'Hide Sidebar' : 'Show Sidebar',
      subtitle: 'Toggle navigation sidebar',
      category: 'settings',
      action: () => setShowSidebar(!showSidebar),
      keywords: ['sidebar', 'navigation', 'menu', 'toggle'],
      icon: showSidebar ? '◀️' : '▶️'
    },

    // Help Commands
    {
      id: 'help-shortcuts',
      title: 'Keyboard Shortcuts',
      subtitle: 'View all available keyboard shortcuts',
      category: 'help',
      action: () => {
        // TODO: Implement shortcuts modal
      },
      keywords: ['help', 'shortcuts', 'keys', 'commands'],
      shortcut: '⌘+?',
      icon: '⌨️'
    }
  ], [navigate, theme, showSidebar, setTheme, setShowSidebar]);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();

    return commands
      .filter(command =>
        command.title.toLowerCase().includes(searchTerm) ||
        command.subtitle.toLowerCase().includes(searchTerm) ||
        command.keywords.some(keyword => keyword.includes(searchTerm))
      )
      .map(command => {
        // Check if it's an exact match for commands
        const isExactMatch = command.title.toLowerCase() === searchTerm ||
          command.keywords.some(keyword => keyword === searchTerm);

        return {
          id: command.id,
          type: 'command' as const,
          title: command.title,
          subtitle: command.subtitle,
          image: undefined,
          data: command,
          action: command.action,
          isExactMatch
        };
      });
  }, [query, commands]);

  // Transform music search results (from either Spotify API or mock search)
  const musicResults: SearchResult[] = useMemo(() => {
    if (useMockData) {
      // Use mock search results with exact match information
      if (!mockSearchResults.length) return [];

      return mockSearchResults.map(({ track, isExactMatch }) => ({
        id: track.spotify_id || track.id,
        type: 'track' as const,
        title: track.title || track.name || 'Unknown Track',
        subtitle: `${track.artist || 'Unknown Artist'} • ${track.album || 'Unknown Album'}`,
        image: track.poster_path,
        data: track,
        isExactMatch
      }));
    } else if (musicSearchData?.results) {
      // Use Spotify API results (no exact match detection for now)
      return musicSearchData.results.map((track: ITrack) => ({
        id: track.spotify_id || track.id,
        type: 'track' as const,
        title: track.title || track.name || 'Unknown Track',
        subtitle: `${track.artist || 'Unknown Artist'} • ${track.album || 'Unknown Album'}`,
        image: track.poster_path,
        data: track,
        isExactMatch: false
      }));
    }

    return [];
  }, [useMockData, mockSearchResults, musicSearchData]);

  // Separate exact matches from recommendations
  const { exactMatches, recommendations } = useMemo(() => {
    if (!query.trim()) return { exactMatches: [], recommendations: [] };

    const allCombined = [...musicResults, ...filteredCommands];
    const exact = allCombined.filter(item => item.isExactMatch);
    const recs = allCombined.filter(item => !item.isExactMatch);

    return { exactMatches: exact, recommendations: recs };
  }, [query, musicResults, filteredCommands]);

  // Combine all results (maintaining separation for UI)
  const allResults = useMemo(() => {
    if (!query.trim()) return [];

    // Show exact matches first, then recommendations
    return [...exactMatches, ...recommendations];
  }, [query, exactMatches, recommendations]);

  // Handle item selection
  const handleItemSelect = (item: SearchResult) => {
    // Add to search history
    if (query.trim()) {
      const newSearches = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 10);
      setRecentSearches(newSearches);

      const newHistory = [item, ...searchHistory.filter(h => h.id !== item.id)].slice(0, 20);
      setSearchHistory(newHistory);

      // Save to localStorage
      localStorage.setItem('nextsound_search_history', JSON.stringify({
        queries: newSearches,
        items: newHistory
      }));
    }

    // Execute action based on item type
    if (item.type === 'command' && item.action) {
      item.action();
    }
    // Note: Detail page navigation removed - tracks/albums/artists only display on home page

    // Call optional callback
    onItemSelect?.(item);

    // Close palette and reset
    onClose?.();
    setQuery('');
    setSelectedIndex(0);
  };

  // Get recent items for empty state
  const recentItems = useMemo(() => {
    if (query.trim()) return [];
    return searchHistory.slice(0, 5);
  }, [query, searchHistory]);

  // Loading state (handles both mock search and Spotify API)
  const isLoading = useMockData
    ? isMockSearchLoading && query.trim()
    : isMusicSearchLoading && query.trim();

  // Error state (only show errors for Spotify API, mock search shouldn't fail)
  const searchError = useMockData ? null : musicSearchError;

  return {
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    allResults,
    exactMatches,
    recommendations,
    recentItems,
    recentSearches,
    isLoading,
    error: searchError,
    handleItemSelect,
    clearHistory: () => {
      setRecentSearches([]);
      setSearchHistory([]);
      localStorage.removeItem('nextsound_search_history');
    }
  };
};