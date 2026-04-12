import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITrack } from '@/types';
import type { RootState } from './index';

interface QueueState {
  tracks: ITrack[];
  currentIndex: number;
  history: ITrack[];
  showQueuePanel: boolean;
}

const initialState: QueueState = {
  tracks: [],
  currentIndex: -1,
  history: [],
  showQueuePanel: false,
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    addToQueue: (state, action: PayloadAction<ITrack>) => {
      state.tracks.push(action.payload);
    },

    removeFromQueue: (state, action: PayloadAction<number>) => {
      const removedIndex = action.payload;

      // Remove the track
      state.tracks.splice(removedIndex, 1);

      // Adjust currentIndex
      if (state.currentIndex === removedIndex) {
        // If removing current track, move to next (or previous if was last)
        state.currentIndex = Math.min(removedIndex, state.tracks.length - 1);
      } else if (state.currentIndex > removedIndex) {
        // If removing track before current, shift index down
        state.currentIndex -= 1;
      }

      // If queue is now empty, reset index
      if (state.tracks.length === 0) {
        state.currentIndex = -1;
      }
    },

    reorderQueue: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;

      if (from === to || from < 0 || to < 0 || from >= state.tracks.length || to >= state.tracks.length) {
        return;
      }

      // Remove track from 'from' position
      const [movedTrack] = state.tracks.splice(from, 1);

      // Insert track at 'to' position
      state.tracks.splice(to, 0, movedTrack);

      // Adjust currentIndex if affected
      if (state.currentIndex === from) {
        state.currentIndex = to;
      } else if (from < state.currentIndex && to >= state.currentIndex) {
        state.currentIndex -= 1;
      } else if (from > state.currentIndex && to <= state.currentIndex) {
        state.currentIndex += 1;
      }
    },

    clearQueue: (state) => {
      state.tracks = [];
      state.currentIndex = -1;
    },

    setCurrentIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= -1 && index < state.tracks.length) {
        state.currentIndex = index;
      }
    },

    toggleQueuePanel: (state) => {
      state.showQueuePanel = !state.showQueuePanel;
    },

    setQueuePanelOpen: (state, action: PayloadAction<boolean>) => {
      state.showQueuePanel = action.payload;
    },

    addToHistory: (state, action: PayloadAction<ITrack>) => {
      state.history.push(action.payload);

      // Limit history to 50 tracks
      if (state.history.length > 50) {
        state.history.shift();
      }
    },

    clearHistory: (state) => {
      state.history = [];
    },
  },
});

// Export actions
export const {
  addToQueue,
  removeFromQueue,
  reorderQueue,
  clearQueue,
  setCurrentIndex,
  toggleQueuePanel,
  setQueuePanelOpen,
  addToHistory,
  clearHistory,
} = queueSlice.actions;

// Selectors
export const selectQueue = (state: RootState) => state.queue.tracks;
export const selectCurrentIndex = (state: RootState) => state.queue.currentIndex;
export const selectQueueHistory = (state: RootState) => state.queue.history;
export const selectShowQueuePanel = (state: RootState) => state.queue.showQueuePanel;
export const selectQueueLength = (state: RootState) => state.queue.tracks.length;

export const selectCurrentTrack = (state: RootState): ITrack | null => {
  const index = state.queue.currentIndex;
  if (index >= 0 && index < state.queue.tracks.length) {
    return state.queue.tracks[index];
  }
  return null;
};

export const selectNextTrack = (state: RootState): ITrack | null => {
  const nextIndex = state.queue.currentIndex + 1;
  if (nextIndex < state.queue.tracks.length) {
    return state.queue.tracks[nextIndex];
  }
  return null;
};

export const selectPreviousTrack = (state: RootState): ITrack | null => {
  const prevIndex = state.queue.currentIndex - 1;
  if (prevIndex >= 0 && prevIndex < state.queue.tracks.length) {
    return state.queue.tracks[prevIndex];
  }
  // Fallback to last item in history
  if (state.queue.history.length > 0) {
    return state.queue.history[state.queue.history.length - 1];
  }
  return null;
};

export default queueSlice.reducer;
