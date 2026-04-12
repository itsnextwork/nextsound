import { configureStore } from '@reduxjs/toolkit';
import { spotifyApi } from '@/services/SpotifyAPI';
import { musicApi } from '@/services/MusicAPI';
import queueReducer from './queueSlice';

export const store = configureStore({
  reducer: {
    // New Spotify API
    [spotifyApi.reducerPath]: spotifyApi.reducer,
    // Unified Music API
    [musicApi.reducerPath]: musicApi.reducer,
    // Queue management
    queue: queueReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      spotifyApi.middleware,
      musicApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;