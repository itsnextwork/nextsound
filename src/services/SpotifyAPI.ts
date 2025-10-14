import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  SPOTIFY_API_BASE_URL,
  SPOTIFY_CLIENT_ID,
  USE_BACKEND_PROXY
} from "@/utils/config";
import { cacheHelpers, networkHelpers } from "@/utils/offlineCache";
import { 
  SpotifyTrack, 
  SpotifyAlbum, 
  SpotifyArtist, 
  SpotifyPlaylist,
  ITrack,
  IAlbum,
  IArtist 
} from "@/types";

// Spotify API response interfaces
interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrack[];
    total: number;
    offset: number;
    limit: number;
  };
  albums?: {
    items: SpotifyAlbum[];
    total: number;
    offset: number;
    limit: number;
  };
  artists?: {
    items: SpotifyArtist[];
    total: number;
    offset: number;
    limit: number;
  };
  playlists?: {
    items: SpotifyPlaylist[];
    total: number;
    offset: number;
    limit: number;
  };
}


// Enhanced error types based on PRD specifications
enum ErrorType {
  NETWORK_ERROR = 'network_error',
  CORS_ERROR = 'cors_error', 
  AUTH_ERROR = 'auth_error',
  RATE_LIMIT = 'rate_limit',
  DATA_ERROR = 'data_error',
  TIMEOUT = 'timeout',
  SERVER_ERROR = 'server_error',
  CLIENT_ERROR = 'client_error'
}

interface APIError {
  type: ErrorType;
  status: number;
  message: string;
  userMessage: string; // User-friendly message
  code: string;
  retryable: boolean;
  retryAfter?: number; // For rate limiting
  context?: any; // Additional debugging context
}

// Token cache
interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

// Retry configuration based on PRD specifications
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryableErrors: [
    ErrorType.NETWORK_ERROR,
    ErrorType.TIMEOUT,
    ErrorType.RATE_LIMIT,
    ErrorType.SERVER_ERROR
  ]
};

// Cache durations by content type (in seconds)
const CACHE_DURATIONS = {
  search_results: 5 * 60,         // 5 minutes
  track_details: 24 * 60 * 60,    // 24 hours
  album_details: 24 * 60 * 60,    // 24 hours
  artist_details: 24 * 60 * 60    // 24 hours
};

// Helper function to get Spotify access token (Client Credentials Flow)
const getSpotifyToken = async (): Promise<string> => {
  // Check if we have a valid cached token
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  if (!SPOTIFY_CLIENT_ID) {
    throw new APIError({
      type: ErrorType.AUTH_ERROR,
      status: 500,
      message: 'Spotify client ID not configured',
      code: 'MISSING_CREDENTIALS',
      retryable: false,
      context: { SPOTIFY_CLIENT_ID: !!SPOTIFY_CLIENT_ID }
    });
  }

  // Direct token access should not be used - use backend proxy instead
  throw new APIError({
    type: ErrorType.AUTH_ERROR,
    status: 500,
    message: 'Direct Spotify authentication disabled - use backend proxy',
    code: 'DIRECT_AUTH_DISABLED',
    retryable: false,
    context: { USE_BACKEND_PROXY }
  });
};

// Enhanced APIError class with user-friendly messages
class APIError extends Error {
  public type: ErrorType;
  public status: number;
  public userMessage: string;
  public code: string;
  public retryable: boolean;
  public retryAfter?: number;
  public context?: any;

  constructor(options: { 
    type: ErrorType; 
    status: number; 
    message: string; 
    userMessage?: string;
    code: string; 
    retryable: boolean;
    retryAfter?: number;
    context?: any;
  }) {
    super(options.message);
    this.name = 'APIError';
    this.type = options.type;
    this.status = options.status;
    this.userMessage = options.userMessage || this.getDefaultUserMessage(options.type);
    this.code = options.code;
    this.retryable = options.retryable;
    this.retryAfter = options.retryAfter;
    this.context = options.context;
  }

  private getDefaultUserMessage(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
        return "Check your internet connection and try again";
      case ErrorType.CORS_ERROR:
        return "Unable to access music service. Please try again";
      case ErrorType.AUTH_ERROR:
        return "Music service temporarily unavailable";
      case ErrorType.RATE_LIMIT:
        return "Too many requests. Please wait a moment and try again";
      case ErrorType.TIMEOUT:
        return "Request timed out. Please try again";
      case ErrorType.SERVER_ERROR:
        return "Music service is temporarily down. Please try again later";
      case ErrorType.CLIENT_ERROR:
        return "Invalid request. Please refresh the page";
      case ErrorType.DATA_ERROR:
        return "Unable to load music. Showing cached content";
      default:
        return "Something went wrong. Please try again";
    }
  }
}


// Data transformation helpers
const transformSpotifyTrack = (track: SpotifyTrack): ITrack => {
  return {
    id: track.id,
    spotify_id: track.id,
    poster_path: track.album.images[0]?.url || '',
    backdrop_path: track.album.images[0]?.url || '',
    original_title: track.name,
    name: track.name,
    title: track.name, // Add for compatibility
    overview: track.artists.map(artist => artist.name).join(', '),
    artist: track.artists[0]?.name,
    album: track.album.name,
    duration: track.duration_ms,
    preview_url: track.preview_url,
    external_urls: track.external_urls,
    popularity: track.popularity,
    // Add empty legacy properties for compatibility
  };
};

const transformSpotifyAlbum = (album: SpotifyAlbum): IAlbum => ({
  id: album.id,
  spotify_id: album.id,
  poster_path: album.images[0]?.url || '',
  backdrop_path: album.images[0]?.url || '',
  original_title: album.name,
  name: album.name,
  overview: `${album.album_type.charAt(0).toUpperCase() + album.album_type.slice(1)} by ${album.artists.map(artist => artist.name).join(', ')}`,
  artists: album.artists.map(artist => artist.name),
  release_date: album.release_date,
  total_tracks: album.total_tracks,
  external_urls: album.external_urls
});

const transformSpotifyArtist = (artist: SpotifyArtist): IArtist => ({
  id: artist.id,
  spotify_id: artist.id,
  poster_path: '', // Will be filled from detailed artist info
  backdrop_path: '',
  original_title: artist.name,
  name: artist.name,
  overview: `Artist`,
  external_urls: artist.external_urls
});

// Create base query with retry logic
const baseQuery = fetchBaseQuery({ 
  baseUrl: SPOTIFY_API_BASE_URL,
  prepareHeaders: async (headers) => {
    // Only handle authentication if not using backend proxy
    // The proxy server handles authentication server-side
    if (!USE_BACKEND_PROXY) {
      try {
        const token = await getSpotifyToken();
        headers.set('Authorization', `Bearer ${token}`);
        return headers;
      } catch (error) {
        console.error('Failed to get Spotify token:', error);
        // Don't throw here, let the API call fail naturally
        return headers;
      }
    }
    return headers;
  },
  // Add response error handling
  responseHandler: async (response) => {
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData;
      
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }
      
      const retryAfter = response.headers.get('retry-after');
      throw new APIError({
        type: response.status === 429 ? ErrorType.RATE_LIMIT :
              response.status >= 500 ? ErrorType.SERVER_ERROR :
              response.status >= 400 ? ErrorType.CLIENT_ERROR : ErrorType.NETWORK_ERROR,
        status: response.status,
        message: typeof errorData === 'string' ? errorData : errorData?.error?.message || 'API request failed',
        code: (typeof errorData === 'object' && errorData?.error?.status) || `HTTP_${response.status}`,
        retryable: response.status >= 500 || response.status === 429,
        retryAfter: retryAfter ? parseInt(retryAfter) * 1000 : undefined,
        context: { errorData, url: response.url }
      });
    }
    
    return response.json();
  },
});

// Create base query with retry logic
// Note: RTK Query's retry is complex, so we'll implement retry at the custom base query level
const baseQueryWithRetry = async (args: any, api: any, extraOptions: any) => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries + 1; attempt++) {
    try {
      const result = await baseQuery(args, api, extraOptions);
      return result;
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      const apiError = error as APIError;
      const isRetryable = apiError instanceof APIError 
        ? RETRY_CONFIG.retryableErrors.includes(apiError.type) && apiError.retryable
        : false;
      
      // Don't retry on last attempt or if error is not retryable
      if (attempt > RETRY_CONFIG.maxRetries || !isRetryable) {
        throw error;
      }
      
      // Calculate delay for exponential backoff
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, attempt - 1),
        RETRY_CONFIG.maxDelay
      );
      
      // Add small random jitter to prevent thundering herd
      const jitter = delay * 0.1 * Math.random();
      const totalDelay = Math.floor(delay + jitter);
      
      // For rate limit errors, respect retry-after header
      const retryDelay = apiError?.type === ErrorType.RATE_LIMIT && apiError.retryAfter 
        ? apiError.retryAfter 
        : totalDelay;
      
      console.log(`Retrying request (attempt ${attempt}/${RETRY_CONFIG.maxRetries}) after ${retryDelay}ms delay`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  // This should never be reached, but just in case
  throw lastError;
};

// Base query with offline cache fallback
const baseQueryWithOfflineSupport = async (args: any, api: any, extraOptions: any) => {
  try {
    // First, try the network request
    const result = await baseQueryWithRetry(args, api, extraOptions);
    
    // If successful, cache the result for offline use
    if (result.data) {
      const endpoint = args.url || args;
      cacheResultByEndpoint(endpoint, result.data, args);
    }
    
    return result;
  } catch (error) {
    // If network request fails and we're offline, try cache
    if (!networkHelpers.isOnline() || (error as any)?.status >= 500) {
      console.log('Network unavailable or server error, checking cache...');
      const endpoint = args.url || args;
      const cachedData = getCachedResultByEndpoint(endpoint, args);
      
      if (cachedData) {
        console.log('Serving cached data for:', endpoint);
        return { data: cachedData };
      }
    }
    
    // If no cache available, throw the original error
    throw error;
  }
};

// Helper functions to cache and retrieve data by endpoint type
const cacheResultByEndpoint = (endpoint: string, data: any, args: any) => {
  try {
    if (endpoint.includes('featured-playlists')) {
      cacheHelpers.setFeaturedPlaylists(data);
    } else if (endpoint.includes('new-releases')) {
      cacheHelpers.setNewReleases(data);
    } else if (endpoint.includes('toplists/playlists')) {
      cacheHelpers.setTopTracks(data);
    } else if (endpoint.includes('search')) {
      const { query, type } = args;
      if (query && type) {
        cacheHelpers.setSearchResults(query, type, data);
      }
    } else if (endpoint.includes('tracks/')) {
      const trackId = endpoint.split('tracks/')[1]?.split('?')[0];
      if (trackId) {
        cacheHelpers.setTrack(trackId, data);
      }
    } else if (endpoint.includes('albums/')) {
      const albumId = endpoint.split('albums/')[1]?.split('?')[0];
      if (albumId) {
        cacheHelpers.setAlbum(albumId, data);
      }
    } else if (endpoint.includes('artists/')) {
      const artistId = endpoint.split('artists/')[1]?.split('?')[0];
      if (artistId) {
        cacheHelpers.setArtist(artistId, data);
      }
    }
  } catch (error) {
    console.warn('Failed to cache result:', error);
  }
};

const getCachedResultByEndpoint = (endpoint: string, args: any): any => {
  try {
    if (endpoint.includes('featured-playlists')) {
      return cacheHelpers.getFeaturedPlaylists();
    } else if (endpoint.includes('new-releases')) {
      return cacheHelpers.getNewReleases();
    } else if (endpoint.includes('toplists/playlists')) {
      return cacheHelpers.getTopTracks();
    } else if (endpoint.includes('search')) {
      const { query, type } = args;
      if (query && type) {
        return cacheHelpers.getSearchResults(query, type);
      }
    } else if (endpoint.includes('tracks/')) {
      const trackId = endpoint.split('tracks/')[1]?.split('?')[0];
      if (trackId) {
        return cacheHelpers.getTrack(trackId);
      }
    } else if (endpoint.includes('albums/')) {
      const albumId = endpoint.split('albums/')[1]?.split('?')[0];
      if (albumId) {
        return cacheHelpers.getAlbum(albumId);
      }
    } else if (endpoint.includes('artists/')) {
      const artistId = endpoint.split('artists/')[1]?.split('?')[0];
      if (artistId) {
        return cacheHelpers.getArtist(artistId);
      }
    }
  } catch (error) {
    console.warn('Failed to get cached result:', error);
  }
  return null;
};

export const spotifyApi = createApi({
  reducerPath: "spotifyApi",
  baseQuery: baseQueryWithOfflineSupport,
  
  // Intelligent caching with content-aware durations
  tagTypes: ['Track', 'Album', 'Artist', 'Search'],
  keepUnusedDataFor: 30 * 60, // Default 30 minutes (in seconds)

  endpoints: (builder) => ({
    // Search for music content
    searchMusic: builder.query<{results: ITrack[]}, {
      query: string;
      type: 'track' | 'album' | 'artist' | 'playlist';
      limit?: number;
      offset?: number;
    }>({
      query: ({ query, type, limit = 20, offset = 0 }) => 
        `search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}&offset=${offset}&market=US`,
      keepUnusedDataFor: CACHE_DURATIONS.search_results,
      providesTags: (result, error, { query, type, limit }) => [
        { type: 'Search', id: `${type}-${query}-${limit}` }
      ],
      transformResponse: (response: SpotifySearchResponse, _meta, { type }) => {
        let results: ITrack[] = [];

        try {
          if (type === 'track' && response.tracks) {
            results = response.tracks.items.map((track) => transformSpotifyTrack(track));
          } else if (type === 'album' && response.albums) {
            results = response.albums.items.map((album) => {
              return {
                ...transformSpotifyAlbum(album),
                // Convert IAlbum to ITrack format for compatibility
                artist: album.artists[0]?.name,
                duration: 0
              };
            });
          } else if (type === 'artist' && response.artists) {
            results = response.artists.items.map((artist) => {
              return {
                ...transformSpotifyArtist(artist),
                artist: artist.name,
                duration: 0,
                title: artist.name,
              };
            });
          }
        } catch (error) {
          console.error('Spotify API transformation error:', error);
        }

        return { results };
      },
    }),








    // Get track details
    getTrack: builder.query<ITrack, { id: string }>({
      query: ({ id }) => {
        if (!id || id.trim() === '') {
          throw new APIError({
            type: ErrorType.CLIENT_ERROR,
            status: 400,
            message: 'Track ID is required',
            code: 'MISSING_ID',
            retryable: false,
            context: { providedId: id }
          });
        }
        return `tracks/${id}`;
      },
      keepUnusedDataFor: CACHE_DURATIONS.track_details,
      providesTags: (result, error, { id }) => [{ type: 'Track', id }],
      transformResponse: (response: SpotifyTrack) => {
        try {
          return transformSpotifyTrack(response);
        } catch (error) {
          throw new APIError({
            type: ErrorType.DATA_ERROR,
            status: 500,
            message: `Failed to transform track data: ${error instanceof Error ? error.message : 'Unknown error'}`,
            code: 'TRANSFORM_ERROR',
            retryable: false,
            context: { originalData: response, transformError: error }
          });
        }
      }
    }),

    // Get album details
    getAlbum: builder.query<IAlbum, { id: string }>({
      query: ({ id }) => {
        if (!id || id.trim() === '') {
          throw new APIError({
            type: ErrorType.CLIENT_ERROR,
            status: 400,
            message: 'Album ID is required',
            code: 'MISSING_ID',
            retryable: false,
            context: { providedId: id }
          });
        }
        return `albums/${id}`;
      },
      keepUnusedDataFor: CACHE_DURATIONS.album_details,
      providesTags: (result, error, { id }) => [{ type: 'Album', id }],
      transformResponse: (response: SpotifyAlbum) => {
        try {
          return transformSpotifyAlbum(response);
        } catch (error) {
          throw new APIError({
            type: ErrorType.DATA_ERROR,
            status: 500,
            message: `Failed to transform album data: ${error instanceof Error ? error.message : 'Unknown error'}`,
            code: 'TRANSFORM_ERROR',
            retryable: false,
            context: { originalData: response, transformError: error }
          });
        }
      }
    }),

    // Get artist details
    getArtist: builder.query<IArtist, { id: string }>({
      query: ({ id }) => {
        if (!id || id.trim() === '') {
          throw new APIError({
            type: ErrorType.CLIENT_ERROR,
            status: 400,
            message: 'Artist ID is required',
            code: 'MISSING_ID',
            retryable: false,
            context: { providedId: id }
          });
        }
        return `artists/${id}`;
      },
      keepUnusedDataFor: CACHE_DURATIONS.artist_details,
      providesTags: (result, error, { id }) => [{ type: 'Artist', id }],
      transformResponse: (response: SpotifyArtist & { 
        images?: Array<{ height: number; url: string; width: number }>; 
        genres?: string[];
        followers?: { total: number };
        popularity?: number;
      }) => {
        try {
          return {
            ...transformSpotifyArtist(response),
            poster_path: response.images?.[0]?.url || '',
            backdrop_path: response.images?.[0]?.url || '',
            overview: response.genres?.join(', ') || 'Artist',
            genres: response.genres,
            followers: response.followers?.total,
            popularity: response.popularity
          };
        } catch (error) {
          throw new APIError({
            type: ErrorType.DATA_ERROR,
            status: 500,
            message: `Failed to transform artist data: ${error instanceof Error ? error.message : 'Unknown error'}`,
            code: 'TRANSFORM_ERROR',
            retryable: false,
            context: { originalData: response, transformError: error }
          });
        }
      }
    }),
  }),
});

export const {
  useSearchMusicQuery,
  useGetTrackQuery,
  useGetAlbumQuery,
  useGetArtistQuery
} = spotifyApi;

// Export APIError and ErrorType for use in components
export { APIError, ErrorType };