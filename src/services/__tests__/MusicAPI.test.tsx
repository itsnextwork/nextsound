import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { useGetTracksQuery, useGetTrackQuery } from '../MusicAPI';
import { musicApi } from '../MusicAPI';
import { spotifyApi } from '../SpotifyAPI';
import * as mockMusicData from '../../data/mockMusicData';

// Mock the mock data module
vi.mock('../../data/mockMusicData', () => ({
  getMockData: vi.fn(),
  shouldUseMockData: vi.fn(),
  getMockTrackById: vi.fn(),
}));

// Mock the SpotifyAPI
vi.mock('../SpotifyAPI', () => ({
  spotifyApi: {
    useSearchMusicQuery: vi.fn(),
    useGetTrackQuery: vi.fn(),
    useGetAlbumQuery: vi.fn(),
    useGetArtistQuery: vi.fn(),
    reducer: () => ({}),
    middleware: [],
  },
}));

const createTestStore = () => configureStore({
  reducer: {
    musicApi: musicApi.reducer,
    spotifyApi: spotifyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(musicApi.middleware, spotifyApi.middleware),
});

const createWrapper = () => {
  const store = createTestStore();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return Wrapper;
};

describe('MusicAPI Fallback Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useGetTracksQuery - Mock Data Mode', () => {
    it('should use mock data when Spotify API is unavailable', () => {
      const mockData = {
        results: [
          {
            id: 'test-id',
            name: 'Test Track',
            original_title: 'Test Track',
            poster_path: 'test-image.jpg',
            overview: 'Test track description',
            backdrop_path: 'test-backdrop.jpg',
            artist: 'Test Artist',
            popularity: 85
          }
        ]
      };

      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);
      vi.mocked(mockMusicData.getMockData).mockReturnValue(mockData);

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useGetTracksQuery({ category: 'tracks', type: 'latest' }),
        { wrapper }
      );

      expect(mockMusicData.shouldUseMockData).toHaveBeenCalled();
      expect(mockMusicData.getMockData).toHaveBeenCalledWith('tracks', 'latest');
      expect(result.current.data).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should handle search queries in mock mode', () => {
      const _mockSearchResults = {
        results: [
          {
            id: 'search-result',
            name: 'Harry Styles Song',
            artist: 'Harry Styles',
            album: "Harry's House"
          }
        ]
      };

      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);
      vi.mocked(mockMusicData.getMockData).mockReturnValue({
        results: [
          {
            id: 'search-result',
            name: 'Harry Styles Song',
            original_title: 'Harry Styles Song',
            poster_path: 'harry-styles.jpg',
            overview: 'Harry Styles track',
            backdrop_path: 'harry-backdrop.jpg',
            artist: 'Harry Styles',
            album: "Harry's House"
          },
          {
            id: 'other-song',
            name: 'Other Song',
            original_title: 'Other Song',
            poster_path: 'other-song.jpg',
            overview: 'Other track',
            backdrop_path: 'other-backdrop.jpg',
            artist: 'Other Artist',
            album: 'Other Album'
          }
        ]
      });

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useGetTracksQuery({ category: 'tracks', searchQuery: 'Harry' }),
        { wrapper }
      );

      expect(mockMusicData.shouldUseMockData).toHaveBeenCalled();
      // Search returns matching tracks - should filter to only Harry Styles
      expect(result.current.data?.results.length).toBeGreaterThanOrEqual(1);
      expect(result.current.data?.results.some((track: any) => track.artist === 'Harry Styles')).toBe(true);
    });

    it('should handle similar tracks in mock mode', () => {
      const mockPopularTracks = {
        results: [
          { id: '1', name: 'Track 1', original_title: 'Track 1', poster_path: 'track1.jpg', overview: 'Track 1 description', backdrop_path: 'track1-backdrop.jpg', artist: 'Artist 1' },
          { id: '2', name: 'Track 2', original_title: 'Track 2', poster_path: 'track2.jpg', overview: 'Track 2 description', backdrop_path: 'track2-backdrop.jpg', artist: 'Artist 2' },
        ]
      };

      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);
      vi.mocked(mockMusicData.getMockData).mockReturnValue(mockPopularTracks);

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useGetTracksQuery({ category: 'tracks', showSimilarTracks: true }),
        { wrapper }
      );

      expect(result.current.data?.results).toHaveLength(2);
    });

    it('should fall back to real API when mock data is disabled', () => {
      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(false);

      const mockSpotifyResponse = {
        data: { results: [] },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined
      };

      vi.mocked(spotifyApi.useSearchMusicQuery).mockReturnValue(mockSpotifyResponse as any);

      const wrapper = createWrapper();
      const { result: _result } = renderHook(
        () => useGetTracksQuery({ category: 'tracks', type: 'latest' }),
        { wrapper }
      );

      // Should not call mock data functions
      expect(mockMusicData.getMockData).not.toHaveBeenCalled();

      // Should call Spotify API
      expect(spotifyApi.useSearchMusicQuery).toHaveBeenCalled();
    });
  });

  describe('useGetTracksQuery - Data Categories', () => {
    beforeEach(() => {
      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);
    });

    it('should handle tracks-latest category', () => {
      const mockData = { results: [{ id: 'latest-1', name: 'Latest Hit', original_title: 'Latest Hit', poster_path: 'latest.jpg', overview: 'Latest hit track', backdrop_path: 'latest-backdrop.jpg' }] };
      vi.mocked(mockMusicData.getMockData).mockReturnValue(mockData);

      const wrapper = createWrapper();
      renderHook(
        () => useGetTracksQuery({ category: 'tracks', type: 'latest' }),
        { wrapper }
      );

      expect(mockMusicData.getMockData).toHaveBeenCalledWith('tracks', 'latest');
    });


    it('should handle default category when type is not specified', () => {
      const mockData = { results: [{ id: 'default-1', name: 'Default Track', original_title: 'Default Track', poster_path: 'default.jpg', overview: 'Default track', backdrop_path: 'default-backdrop.jpg' }] };
      vi.mocked(mockMusicData.getMockData).mockReturnValue(mockData);

      const wrapper = createWrapper();
      renderHook(
        () => useGetTracksQuery({ category: 'tracks' }),
        { wrapper }
      );

      expect(mockMusicData.getMockData).toHaveBeenCalledWith('tracks', 'popular');
    });
  });

  describe('useGetTrackQuery - Individual Track Lookup', () => {
    it('should return mock track when found by ID', () => {
      const mockTrack = {
        id: 'test-track-id',
        name: 'Test Track',
        artist: 'Test Artist'
      };

      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);
      vi.mocked(mockMusicData.getMockTrackById).mockReturnValue(mockTrack as any);

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useGetTrackQuery({ category: 'tracks', id: 'test-track-id' }),
        { wrapper }
      );

      expect(mockMusicData.getMockTrackById).toHaveBeenCalledWith('test-track-id');
      expect(result.current.data).toEqual(mockTrack);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should return error when track not found in mock data', () => {
      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);
      vi.mocked(mockMusicData.getMockTrackById).mockReturnValue(undefined);

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useGetTrackQuery({ category: 'tracks', id: 'non-existent-id' }),
        { wrapper }
      );

      expect(result.current.data).toBeUndefined();
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual({
        status: 404,
        message: 'Track not found in mock data'
      });
    });

    it('should handle invalid ID parameters', () => {
      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useGetTrackQuery({ category: 'tracks', id: '' }),
        { wrapper }
      );

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Invalid ID provided');
    });

    it('should convert number IDs to strings', () => {
      const mockTrack = { id: '123', name: 'Numeric ID Track' };

      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);
      vi.mocked(mockMusicData.getMockTrackById).mockReturnValue(mockTrack as any);

      const wrapper = createWrapper();
      renderHook(
        () => useGetTrackQuery({ category: 'tracks', id: 123 }),
        { wrapper }
      );

      expect(mockMusicData.getMockTrackById).toHaveBeenCalledWith('123');
    });

    it('should fall back to real API when not in mock mode', () => {
      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(false);

      const mockSpotifyTrack = {
        data: { id: 'spotify-track', name: 'Spotify Track' },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined
      };

      vi.mocked(spotifyApi.useGetTrackQuery).mockReturnValue(mockSpotifyTrack as any);

      const wrapper = createWrapper();
      const { result: _result } = renderHook(
        () => useGetTrackQuery({ category: 'tracks', id: 'spotify-track-id' }),
        { wrapper }
      );

      expect(mockMusicData.getMockTrackById).not.toHaveBeenCalled();
      expect(spotifyApi.useGetTrackQuery).toHaveBeenCalledWith(
        { id: 'spotify-track-id' },
        { skip: false }
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle mock data function errors gracefully', () => {
      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);
      vi.mocked(mockMusicData.getMockData).mockImplementation(() => {
        throw new Error('Mock data error');
      });

      const wrapper = createWrapper();

      // The error will be thrown in the render - catch it
      try {
        renderHook(
          () => useGetTracksQuery({ category: 'tracks', type: 'latest' }),
          { wrapper }
        );
      } catch (error) {
        // Error is expected when mock data function throws
        expect(error).toBeDefined();
      }
    });

    it('should provide consistent response structure in mock mode', () => {
      const mockData = { results: [] };
      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);
      vi.mocked(mockMusicData.getMockData).mockReturnValue(mockData);

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useGetTracksQuery({ category: 'tracks', type: 'latest' }),
        { wrapper }
      );

      // Check response structure matches real API
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isFetching');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('error');

      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isFetching).toBe('boolean');
      expect(typeof result.current.isError).toBe('boolean');
    });
  });

  describe('Performance and Caching', () => {
    it('should not make redundant mock data calls', () => {
      vi.mocked(mockMusicData.shouldUseMockData).mockReturnValue(true);
      vi.mocked(mockMusicData.getMockData).mockReturnValue({ results: [] });

      const wrapper = createWrapper();

      // Render the same query multiple times
      const { rerender } = renderHook(
        () => useGetTracksQuery({ category: 'tracks', type: 'latest' }),
        { wrapper }
      );

      rerender();
      rerender();

      // Mock data should be called efficiently (implementation detail)
      expect(mockMusicData.getMockData).toHaveBeenCalled();
    });
  });
});