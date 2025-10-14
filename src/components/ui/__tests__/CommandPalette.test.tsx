import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

import { CommandPalette } from '../CommandPalette';
import { spotifyApi, useSearchMusicQuery } from '../../../services/SpotifyAPI';
import ThemeProvider from '../../../context/themeContext';
import GlobalProvider from '../../../context/globalContext';

// Mock the APIs
vi.mock('../../../services/SpotifyAPI', () => ({
  spotifyApi: {
    reducer: () => ({}), // Return empty object as initial state
    middleware: [],
    reducerPath: 'spotifyApi',
  },
  useSearchMusicQuery: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

// Mock audio player
const mockAudioPlayer = {
  isPlaying: false,
  currentTrack: null,
  togglePlay: vi.fn(),
  skipNext: vi.fn(),
  skipPrevious: vi.fn(),
  toggleShuffle: vi.fn(),
  isShuffled: false,
  playTrack: vi.fn(),
};

// Create test store
const createTestStore = () => configureStore({
  reducer: {
    spotifyApi: spotifyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spotifyApi.middleware),
});

// Create wrapper with all providers
const createWrapper = () => {
  const store = createTestStore();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <Provider store={store}>
        <ThemeProvider>
          <GlobalProvider>
            {children}
          </GlobalProvider>
        </ThemeProvider>
      </Provider>
    </MemoryRouter>
  );

  return Wrapper;
};

describe('CommandPalette', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Basic Rendering', () => {
    it('should render when open', () => {
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Type a command or search/)).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={false}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('should show search input with correct placeholder', () => {
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByPlaceholderText(/Type a command or search/);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveFocus();
    });
  });

  describe('Search Functionality', () => {
    it('should update search input when user types', async () => {
      const user = userEvent.setup();
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');

      await user.type(searchInput, 'test search');

      expect(searchInput).toHaveValue('test search');
    });

    it('should show music search results when typing', async () => {
      const user = userEvent.setup();
      const mockSearchResponse = {
        data: {
          results: [
            {
              id: 'track-1',
              spotify_id: 'spotify-1',
              name: 'Test Song',
              title: 'Test Song',
              artist: 'Test Artist',
              album: 'Test Album',
              poster_path: 'http://example.com/image.jpg',
            }
          ]
        },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'test song');

      await waitFor(() => {
        expect(screen.getByText('Test Song')).toBeInTheDocument();
        expect(screen.getByText('Test Artist • Test Album')).toBeInTheDocument();
      });
    });

    it('should show loading state during search', async () => {
      const user = userEvent.setup();
      const mockSearchResponse = {
        data: undefined,
        isLoading: true,
        isFetching: true,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'loading test');

      await waitFor(() => {
        expect(screen.getByText('Searching...')).toBeInTheDocument();
      });
    });

    it('should show no results message when search returns empty', async () => {
      const user = userEvent.setup();
      const mockSearchResponse = {
        data: { results: [] },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'no results');

      await waitFor(() => {
        expect(screen.getByText(/No results found/)).toBeInTheDocument();
      });
    });
  });

  describe('Command Mode', () => {
    it('should enter command mode when query starts with >', async () => {
      const user = userEvent.setup();
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, '>');

      // Should show command help text
      await waitFor(() => {
        expect(screen.getByText(/Commands/)).toBeInTheDocument();
      });
    });

    it('should show navigation commands in command mode', async () => {
      const user = userEvent.setup();
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, '>home');

      await waitFor(() => {
        expect(screen.getByText('Go to Home')).toBeInTheDocument();
        expect(screen.getByText('Navigate to the homepage')).toBeInTheDocument();
      });
    });

    it('should show player commands when audio player is available', async () => {
      const user = userEvent.setup();
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, '>play');

      await waitFor(() => {
        expect(screen.getByText('Play')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle escape key to close palette', async () => {
      const onClose = vi.fn();
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={onClose}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' });

      expect(onClose).toHaveBeenCalled();
    });

    it('should handle arrow keys for navigation', async () => {
      const user = userEvent.setup();
      const mockSearchResponse = {
        data: {
          results: [
            {
              id: 'track-1',
              name: 'Song 1',
              title: 'Song 1',
              artist: 'Artist 1',
              album: 'Album 1',
            },
            {
              id: 'track-2',
              name: 'Song 2',
              title: 'Song 2',
              artist: 'Artist 2',
              album: 'Album 2',
            }
          ]
        },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'test');

      await waitFor(() => {
        expect(screen.getByText('Song 1')).toBeInTheDocument();
      });

      // Test arrow key navigation
      fireEvent.keyDown(searchInput, { key: 'ArrowDown', code: 'ArrowDown' });
      fireEvent.keyDown(searchInput, { key: 'ArrowUp', code: 'ArrowUp' });
    });

    it('should handle enter key to select item', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const mockSearchResponse = {
        data: {
          results: [
            {
              id: 'track-1',
              spotify_id: 'track-1',
              name: 'Song 1',
              title: 'Song 1',
              artist: 'Artist 1',
              album: 'Album 1',
            }
          ]
        },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={onClose}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'song');

      await waitFor(() => {
        expect(screen.getByText('Song 1')).toBeInTheDocument();
      });

      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        // Now navigates to detail page instead of playing track
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Item Selection', () => {
    it('should navigate to detail page when track item is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const mockSearchResponse = {
        data: {
          results: [
            {
              id: 'track-1',
              spotify_id: 'track-1',
              name: 'Clickable Song',
              title: 'Clickable Song',
              artist: 'Test Artist',
              album: 'Test Album',
            }
          ]
        },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={onClose}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'clickable');

      await waitFor(() => {
        expect(screen.getByText('Clickable Song')).toBeInTheDocument();
      });

      const trackItem = screen.getByText('Clickable Song');
      await user.click(trackItem);

      // Now navigates to detail page instead of playing track
      expect(onClose).toHaveBeenCalled();
    });

    it('should execute command when command item is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={onClose}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, '>play');

      await waitFor(() => {
        expect(screen.getByText('Play')).toBeInTheDocument();
      });

      const playCommand = screen.getByText('Play');
      await user.click(playCommand);

      expect(mockAudioPlayer.togglePlay).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Recent Items', () => {
    it('should show recent items when query is empty', () => {
      const mockSearchHistory = {
        queries: ['previous search'],
        items: [
          {
            id: 'recent-1',
            type: 'track',
            title: 'Recent Song',
            subtitle: 'Recent Artist • Recent Album',
            data: { name: 'Recent Song' }
          }
        ]
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSearchHistory));

      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      expect(screen.getByText('Recent Song')).toBeInTheDocument();
      expect(screen.getByText('Recent Artist • Recent Album')).toBeInTheDocument();
    });

    it('should show help message when no recent items exist', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      expect(screen.getByText(/Start typing to search/)).toBeInTheDocument();
      expect(screen.getByText(/Type > to see commands/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should show error message when search fails', async () => {
      const user = userEvent.setup();
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: true,
        error: { status: 500, message: 'Search failed' },
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'error test');

      await waitFor(() => {
        expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('aria-expanded', 'true');
      expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('should focus search input when opened', () => {
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={vi.fn()}
          audioPlayer={mockAudioPlayer}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      expect(searchInput).toHaveFocus();
    });
  });

  describe('Props and Callbacks', () => {
    it('should call onItemSelect callback when provided', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      const onClose = vi.fn();

      const mockSearchResponse = {
        data: {
          results: [
            {
              id: 'callback-track',
              name: 'Callback Song',
              title: 'Callback Song',
              artist: 'Test Artist',
              album: 'Test Album',
            }
          ]
        },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      const Wrapper = createWrapper();
      render(
        <CommandPalette
          isOpen={true}
          onClose={onClose}
          audioPlayer={mockAudioPlayer}
          onItemSelect={onItemSelect}
        />,
        { wrapper: Wrapper }
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'callback');

      await waitFor(() => {
        expect(screen.getByText('Callback Song')).toBeInTheDocument();
      });

      const trackItem = screen.getByText('Callback Song');
      await user.click(trackItem);

      expect(onItemSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          type: 'track',
          title: 'Callback Song',
        })
      );
    });

    it('should handle missing audio player gracefully', () => {
      const mockSearchResponse = {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
      };

      vi.mocked(useSearchMusicQuery).mockReturnValue(mockSearchResponse as any);

      expect(() => {
        const Wrapper = createWrapper();
        render(
          <CommandPalette
            isOpen={true}
            onClose={vi.fn()}
            // No audioPlayer prop
          />,
          { wrapper: Wrapper }
        );
      }).not.toThrow();
    });
  });
});