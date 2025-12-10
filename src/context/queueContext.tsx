import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ITrack } from '@/types';

interface QueueContextType {
  queue: ITrack[];
  currentIndex: number;
  isQueuePanelOpen: boolean;
  addToQueue: (track: ITrack) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  getNextTrack: () => ITrack | null;
  getPreviousTrack: () => ITrack | null;
  setCurrentIndex: (index: number) => void;
  openQueuePanel: () => void;
  closeQueuePanel: () => void;
  toggleQueuePanel: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const QUEUE_STORAGE_KEY = 'nextsound_queue';
const CURRENT_INDEX_STORAGE_KEY = 'nextsound_queue_index';

interface QueueProviderProps {
  children: ReactNode;
}

export const QueueProvider: React.FC<QueueProviderProps> = ({ children }) => {
  const [queue, setQueue] = useState<ITrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isQueuePanelOpen, setIsQueuePanelOpen] = useState(false);

  // Load queue from localStorage on mount
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(QUEUE_STORAGE_KEY);
      const savedIndex = localStorage.getItem(CURRENT_INDEX_STORAGE_KEY);
      
      if (savedQueue) {
        const parsedQueue = JSON.parse(savedQueue);
        setQueue(parsedQueue);
      }
      
      if (savedIndex !== null) {
        setCurrentIndex(parseInt(savedIndex, 10));
      }
    } catch (error) {
      console.error('Error loading queue from localStorage:', error);
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
      localStorage.setItem(CURRENT_INDEX_STORAGE_KEY, currentIndex.toString());
    } catch (error) {
      console.error('Error saving queue to localStorage:', error);
    }
  }, [queue, currentIndex]);

  const addToQueue = useCallback((track: ITrack) => {
    setQueue(prev => {
      // Check if track already exists in queue
      const exists = prev.some(t => t.id === track.id);
      if (exists) {
        return prev; // Don't add duplicates
      }
      return [...prev, track];
    });
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => {
      const newQueue = prev.filter((_, i) => i !== index);
      
      // Adjust currentIndex if needed
      if (index < currentIndex) {
        // Track before current was removed - decrement index
        setCurrentIndex(prev => prev - 1);
      } else if (index === currentIndex) {
        // Currently playing track was removed - keep same index (next track moves into position)
        // No change needed to currentIndex
      } else if (index > currentIndex) {
        // Track after current was removed - no change needed
      }
      
      // Clamp currentIndex if it's out of bounds after removal
      if (currentIndex >= newQueue.length && newQueue.length > 0) {
        setCurrentIndex(newQueue.length - 1);
      } else if (newQueue.length === 0) {
        setCurrentIndex(-1);
      }
      
      return newQueue;
    });
  }, [currentIndex]);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    setQueue(prev => {
      const newQueue = [...prev];
      const [removed] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, removed);
      
      // Adjust currentIndex if needed
      if (fromIndex === currentIndex) {
        setCurrentIndex(toIndex);
      } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
        setCurrentIndex(currentIndex - 1);
      } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
        setCurrentIndex(currentIndex + 1);
      }
      
      return newQueue;
    });
  }, [currentIndex]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentIndex(-1);
  }, []);

  const getNextTrack = useCallback((): ITrack | null => {
    if (queue.length === 0 || currentIndex >= queue.length - 1) {
      return null;
    }
    return queue[currentIndex + 1] || null;
  }, [queue, currentIndex]);

  const getPreviousTrack = useCallback((): ITrack | null => {
    if (queue.length === 0 || currentIndex <= 0) {
      return null;
    }
    return queue[currentIndex - 1] || null;
  }, [queue, currentIndex]);

  const openQueuePanel = useCallback(() => {
    setIsQueuePanelOpen(true);
  }, []);

  const closeQueuePanel = useCallback(() => {
    setIsQueuePanelOpen(false);
  }, []);

  const toggleQueuePanel = useCallback(() => {
    setIsQueuePanelOpen(prev => !prev);
  }, []);

  const handleSetCurrentIndex = useCallback((index: number) => {
    if (index >= -1 && index < queue.length) {
      setCurrentIndex(index);
    }
  }, [queue.length]);

  return (
    <QueueContext.Provider
      value={{
        queue,
        currentIndex,
        isQueuePanelOpen,
        addToQueue,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        getNextTrack,
        getPreviousTrack,
        setCurrentIndex: handleSetCurrentIndex,
        openQueuePanel,
        closeQueuePanel,
        toggleQueuePanel,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueueContext = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueueContext must be used within QueueProvider');
  }
  return context;
};
