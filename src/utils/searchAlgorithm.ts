import { ITrack } from '@/types';

/**
 * Genre aliases for flexible genre-based search
 * Maps common genre search terms to their variations
 */
export const GENRE_ALIASES: Record<string, string[]> = {
  'pop': ['pop', 'alternative pop', 'dance pop', 'synthpop'],
  'rock': ['rock', 'pop rock', 'alternative rock', 'classic rock'],
  'hip hop': ['hip hop', 'hip-hop', 'rap', 'latin trap'],
  'r&b': ['r&b', 'rnb', 'soul'],
  'electronic': ['electronic', 'dance', 'edm', 'synthpop'],
  'country': ['country'],
  'indie': ['indie', 'indie folk', 'indie rock'],
  'folk': ['folk', 'indie folk'],
  'punk': ['punk', 'pop punk'],
  'garage': ['garage', 'uk garage'],
  'k-pop': ['k-pop', 'kpop'],
  'latin': ['latin', 'latin trap']
};

/**
 * Scoring weights for search algorithm
 * Higher values = more important in search ranking
 */
const SCORING_WEIGHTS = {
  EXACT_MATCH_NAME: 100,
  EXACT_MATCH_ARTIST: 90,
  EXACT_MATCH_ALBUM: 80,
  EXACT_MATCH_GENRE: 70,
  YEAR_MATCH: 85,
  GENRE_ALIAS_MATCH: 75,
  PARTIAL_NAME: 50,
  PARTIAL_ORIGINAL_TITLE: 45,
  PARTIAL_ARTIST: 40,
  PARTIAL_GENRE: 35,
  PARTIAL_ALBUM: 30,
  PARTIAL_YEAR: 25,
  PARTIAL_WORD_BONUS: 20,
  PARTIAL_OVERVIEW: 15,
  POPULARITY_HIGH: 10,  // >85 popularity
  POPULARITY_VERY_HIGH: 5   // >90 popularity
};

export interface SearchResult {
  track: ITrack;
  score: number;
  isExactMatch: boolean;
}

/**
 * Enhanced search algorithm for music tracks
 *
 * Features:
 * - Exact match detection (highest priority)
 * - Year-based search (e.g., "2024", "2025")
 * - Genre-based search with aliases
 * - Multi-term scoring with weighted fields
 * - Popularity boosting for better UX
 *
 * @param tracks - Array of tracks to search through
 * @param searchQuery - User's search query
 * @param limit - Maximum number of results to return (default: no limit)
 * @returns Array of tracks sorted by relevance with exact matches first
 */
export function performEnhancedSearch(
  tracks: ITrack[],
  searchQuery: string,
  limit?: number
): SearchResult[] {
  if (!searchQuery || !tracks.length) return [];

  const query = searchQuery.toLowerCase().trim();
  const searchTerms = query.split(/\s+/).filter(term => term.length > 0);

  // Check if search is year-based
  const yearMatch = query.match(/\b(19|20)\d{2}\b/);
  const searchYear = yearMatch ? parseInt(yearMatch[0]) : null;

  const scoredResults: SearchResult[] = [];

  tracks.forEach(track => {
    let score = 0;
    let isExactMatch = false;

    const trackText = {
      name: track.name?.toLowerCase() || '',
      title: track.title?.toLowerCase() || '',
      original_title: track.original_title?.toLowerCase() || '',
      artist: track.artist?.toLowerCase() || '',
      album: track.album?.toLowerCase() || '',
      overview: track.overview?.toLowerCase() || '',
      genre: track.genre?.toLowerCase() || '',
      year: track.year?.toString() || ''
    };

    // === EXACT MATCH DETECTION (Highest Priority) ===
    if (trackText.name === query || trackText.title === query || trackText.original_title === query) {
      isExactMatch = true;
      score += SCORING_WEIGHTS.EXACT_MATCH_NAME;
    } else if (trackText.artist === query) {
      isExactMatch = true;
      score += SCORING_WEIGHTS.EXACT_MATCH_ARTIST;
    } else if (trackText.album === query) {
      isExactMatch = true;
      score += SCORING_WEIGHTS.EXACT_MATCH_ALBUM;
    } else if (trackText.genre === query) {
      isExactMatch = true;
      score += SCORING_WEIGHTS.EXACT_MATCH_GENRE;
    }

    // === YEAR-BASED SEARCH ===
    if (searchYear && track.year === searchYear) {
      score += SCORING_WEIGHTS.YEAR_MATCH;
    }

    // === GENRE-BASED SEARCH with aliases ===
    for (const [searchGenre, aliases] of Object.entries(GENRE_ALIASES)) {
      if (query.includes(searchGenre)) {
        if (aliases.some(alias => trackText.genre.includes(alias))) {
          score += SCORING_WEIGHTS.GENRE_ALIAS_MATCH;
          break;
        }
      }
    }

    // === MULTI-TERM SEARCH SCORING (only for non-exact matches) ===
    if (!isExactMatch) {
      searchTerms.forEach(term => {
        // Title/Name matches
        if (trackText.name.includes(term) || trackText.title.includes(term)) {
          score += SCORING_WEIGHTS.PARTIAL_NAME;
        }
        if (trackText.original_title.includes(term)) {
          score += SCORING_WEIGHTS.PARTIAL_ORIGINAL_TITLE;
        }

        // Artist matches
        if (trackText.artist.includes(term)) {
          score += SCORING_WEIGHTS.PARTIAL_ARTIST;
        }

        // Album matches
        if (trackText.album.includes(term)) {
          score += SCORING_WEIGHTS.PARTIAL_ALBUM;
        }

        // Genre matches
        if (trackText.genre.includes(term)) {
          score += SCORING_WEIGHTS.PARTIAL_GENRE;
        }

        // Overview matches
        if (trackText.overview.includes(term)) {
          score += SCORING_WEIGHTS.PARTIAL_OVERVIEW;
        }

        // Year matches
        if (trackText.year.includes(term)) {
          score += SCORING_WEIGHTS.PARTIAL_YEAR;
        }
      });

      // === PARTIAL WORD MATCHING BONUS ===
      searchTerms.forEach(term => {
        if (term.length >= 3) {
          if (trackText.name.includes(term) || trackText.artist.includes(term)) {
            score += SCORING_WEIGHTS.PARTIAL_WORD_BONUS;
          }
        }
      });

      // === POPULARITY BOOST for better UX ===
      if (track.popularity && track.popularity > 85) {
        score += SCORING_WEIGHTS.POPULARITY_HIGH;
      }
      if (track.popularity && track.popularity > 90) {
        score += SCORING_WEIGHTS.POPULARITY_VERY_HIGH;
      }
    }

    if (score > 0) {
      scoredResults.push({ track, score, isExactMatch });
    }
  });

  // Sort by exact match first, then by score (descending)
  const sortedResults = scoredResults.sort((a, b) => {
    // Exact matches first
    if (a.isExactMatch && !b.isExactMatch) return -1;
    if (!a.isExactMatch && b.isExactMatch) return 1;
    // Then by score
    return b.score - a.score;
  });

  // Apply limit if specified
  return limit ? sortedResults.slice(0, limit) : sortedResults;
}
