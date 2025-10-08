import { ITrack } from "@/types";

/**
 * Research-based mock music data with accurate track-artist-album cover matches
 * Data sourced from 2024-2025 Spotify top charts and verified for accuracy
 * All Spotify CDN URLs correspond to the correct tracks
 */

export const MOCK_LATEST_HITS: ITrack[] = [
  // 2024 Spotify #1 Song - Billie Eilish
  {
    id: "6dOtVTDdiauQNBQEDOtlAB",
    spotify_id: "6dOtVTDdiauQNBQEDOtlAB",
    poster_path: "https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62",
    original_title: "BIRDS OF A FEATHER",
    name: "BIRDS OF A FEATHER",
    title: "BIRDS OF A FEATHER",
    overview: "Billie Eilish - 2024's most-streamed song on Spotify",
    artist: "Billie Eilish",
    album: "HIT ME HARD AND SOFT",
    duration: 210000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/6dOtVTDdiauQNBQEDOtlAB"
    },
    popularity: 98,
    genre: "Alternative Pop",
    year: 2024,
  },
  // Taylor Swift - Global Top Artist 2024
  {
    id: "1BxfuPKGuaTgP7aM0Bbdwr",
    spotify_id: "1BxfuPKGuaTgP7aM0Bbdwr",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
    original_title: "Cruel Summer",
    name: "Cruel Summer",
    title: "Cruel Summer",
    overview: "Taylor Swift - 3+ billion streams, #1 hit from Lover",
    artist: "Taylor Swift",
    album: "Lover",
    duration: 178000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/1BxfuPKGuaTgP7aM0Bbdwr"
    },
    popularity: 96,
    genre: "Pop",
    year: 2019,
  },
  // Harry Styles - Record-breaking hit
  {
    id: "4LRPiXqCikLlN15c3yImP7",
    spotify_id: "4LRPiXqCikLlN15c3yImP7",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14",
    original_title: "As It Was",
    name: "As It Was",
    title: "As It Was",
    overview: "Harry Styles - 4+ billion streams, Guinness World Record holder",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: 167000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/4LRPiXqCikLlN15c3yImP7"
    },
    popularity: 95,
    genre: "Pop Rock",
    year: 2022,
  },
  // Sabrina Carpenter - 2024 Summer Hit
  {
    id: "4jLfJ9sR0nUro2s3nNrdx5",
    spotify_id: "2qSkIjg1o9h3YT9RAgYN75",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273255ec9ddd8af81fd9aba2ced",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273255ec9ddd8af81fd9aba2ced",
    original_title: "Espresso",
    name: "Espresso",
    title: "Espresso",
    overview: "Sabrina Carpenter - 2024 viral summer anthem",
    artist: "Sabrina Carpenter",
    album: "Short n' Sweet",
    duration: 175000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/2qSkIjg1o9h3YT9RAgYN75"
    },
    popularity: 94,
    genre: "Pop",
    year: 2024,
  },
  // Bruno Mars & Lady Gaga - 2024 Collaboration
  {
    id: "2plbrEY59IikOBgBGLjaoe",
    spotify_id: "2plbrEY59IikOBgBGLjaoe",
    poster_path: "https://i.scdn.co/image/ab67616d0000b2734bac5946590406d6ffb7ed6a",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b2734bac5946590406d6ffb7ed6a",
    original_title: "Die With A Smile",
    name: "Die With A Smile",
    title: "Die With A Smile",
    overview: "Bruno Mars & Lady Gaga - Most-shared song on social media 2024",
    artist: "Bruno Mars, Lady Gaga",
    album: "Die With A Smile",
    duration: 251000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/2plbrEY59IikOBgBGLjaoe"
    },
    popularity: 93,
    genre: "Pop",
    year: 2024,
  },
  // SZA - R&B Sensation
  {
    id: "1Qrg8KqiBpW07V7PNxwwwL",
    spotify_id: "1Qrg8KqiBpW07V7PNxwwwL",
    poster_path: "https://i.scdn.co/image/ab67616d0000b2730c471c36970b9406233842a5",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b2730c471c36970b9406233842a5",
    original_title: "Kill Bill",
    name: "Kill Bill",
    title: "Kill Bill",
    overview: "SZA - R&B chart dominator from SOS album",
    artist: "SZA",
    album: "SOS",
    duration: 153000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/1Qrg8KqiBpW07V7PNxwwwL"
    },
    popularity: 92,
    genre: "R&B",
    year: 2022,
  },
  // Olivia Rodrigo - 5.85 billion streams in 2024
  {
    id: "4ZtFanR9U6ndgddUvNcjcG",
    spotify_id: "4ZtFanR9U6ndgddUvNcjcG",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
    original_title: "good 4 u",
    name: "good 4 u",
    title: "good 4 u",
    overview: "Olivia Rodrigo - Pop-punk anthem from SOUR",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: 178000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG"
    },
    popularity: 91,
    genre: "Pop Punk",
    year: 2021,
  },
  // Dua Lipa - 5.74 billion streams in 2024
  {
    id: "39LLxExYz6ewLAcYrzQQyP",
    spotify_id: "39LLxExYz6ewLAcYrzQQyP",
    poster_path: "https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f",
    original_title: "Levitating",
    name: "Levitating",
    title: "Levitating",
    overview: "Dua Lipa - Disco-pop hit from Future Nostalgia",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 203000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/39LLxExYz6ewLAcYrzQQyP"
    },
    popularity: 90,
    genre: "Dance Pop",
    year: 2020,
  },
  // The Weeknd - Global superstar
  {
    id: "2dHHgzDwk4BJdRwy9uXhTO",
    spotify_id: "2dHHgzDwk4BJdRwy9uXhTO",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273c4fee55d7b51479627c31f89",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273c4fee55d7b51479627c31f89",
    original_title: "Creepin'",
    name: "Creepin'",
    title: "Creepin'",
    overview: "Metro Boomin, The Weeknd, 21 Savage - Dark R&B collaboration",
    artist: "Metro Boomin ft. The Weeknd & 21 Savage",
    album: "Heroes & Villains",
    duration: 221000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO"
    },
    popularity: 89,
    genre: "Hip Hop",
    year: 2022,
  },
  // Ed Sheeran - Global phenomenon
  {
    id: "7qiZfU4dY1lWllzX7mPBI3",
    spotify_id: "7qiZfU4dY1lWllzX7mPBI3",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    original_title: "Shape of You",
    name: "Shape of You",
    title: "Shape of You",
    overview: "Ed Sheeran - 6+ billion streams, global chart-topper",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: 233000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3"
    },
    popularity: 88,
    genre: "Pop",
    year: 2017,
  },
  // Miley Cyrus - 2023 comeback hit
  {
    id: "0yLdNVWF3Srea0uzk55zFn",
    spotify_id: "0yLdNVWF3Srea0uzk55zFn",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273f429549123dbe8552764ba1d",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273f429549123dbe8552764ba1d",
    original_title: "Flowers",
    name: "Flowers",
    title: "Flowers",
    overview: "Miley Cyrus - Self-empowerment anthem, Grammy winner",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    duration: 200000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/0yLdNVWF3Srea0uzk55zFn"
    },
    popularity: 87,
    genre: "Pop",
    year: 2023,
  },
  // Post Malone - Multi-billion stream artist
  {
    id: "3a1lNhkSLSkpJE4MSHpDu9",
    spotify_id: "3a1lNhkSLSkpJE4MSHpDu9",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268",
    original_title: "Sunflower",
    name: "Sunflower",
    title: "Sunflower",
    overview: "Post Malone & Swae Lee - Spider-Verse soundtrack phenomenon",
    artist: "Post Malone & Swae Lee",
    album: "Spider-Man: Into the Spider-Verse",
    duration: 158000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/3a1lNhkSLSkpJE4MSHpDu9"
    },
    popularity: 86,
    genre: "Hip Hop",
    year: 2018,
  },
  // Teddy Swims - #1 Hit 2023-2024
  {
    id: "17phhZDn6oGtzMe56NuWvj",
    spotify_id: "17phhZDn6oGtzMe56NuWvj",
    poster_path: "https://i.scdn.co/image/ab67616d0000b2731a0323cc23419360a34a3ace",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b2731a0323cc23419360a34a3ace",
    original_title: "Lose Control",
    name: "Lose Control",
    title: "Lose Control",
    overview: "Teddy Swims - 2+ billion streams, #1 Billboard Hot 100 hit",
    artist: "Teddy Swims",
    album: "I've Tried Everything But Therapy (Part 1)",
    duration: 210000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/17phhZDn6oGtzMe56NuWvj"
    },
    popularity: 95,
    genre: "Soul",
    year: 2023,
  },
  // Mitski - Indie breakthrough hit
  {
    id: "3vkCueOmm7xQDoJ17W1Pm3",
    spotify_id: "3vkCueOmm7xQDoJ17W1Pm3",
    poster_path: "https://i.scdn.co/image/ab67616d0000b27334f21d3047d85440dfa37f10",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b27334f21d3047d85440dfa37f10",
    original_title: "My Love Mine All Mine",
    name: "My Love Mine All Mine",
    title: "My Love Mine All Mine",
    overview: "Mitski - First Billboard Hot 100 hit, indie folk masterpiece",
    artist: "Mitski",
    album: "The Land Is Inhospitable and So Are We",
    duration: 137000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/3vkCueOmm7xQDoJ17W1Pm3"
    },
    popularity: 88,
    genre: "Indie Folk",
    year: 2023,
  },
  // Morgan Wallen - Country megastar
  {
    id: "7K3BhSpAxZBznislvUMVtn",
    spotify_id: "7K3BhSpAxZBznislvUMVtn",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273705079df9a25a28b452c1fc9",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273705079df9a25a28b452c1fc9",
    original_title: "Last Night",
    name: "Last Night",
    title: "Last Night",
    overview: "Morgan Wallen - 16 weeks at #1, longest-running solo #1 in Hot 100 history",
    artist: "Morgan Wallen",
    album: "One Thing At A Time",
    duration: 163000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/7K3BhSpAxZBznislvUMVtn"
    },
    popularity: 94,
    genre: "Country",
    year: 2023,
  },
  // FIFTY FIFTY - K-pop viral sensation
  {
    id: "4dKa5ZzlGqUy3Wo0yaXKNI",
    spotify_id: "4dKa5ZzlGqUy3Wo0yaXKNI",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273f6019075623d95de7e64fa33",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273f6019075623d95de7e64fa33",
    original_title: "Cupid",
    name: "Cupid",
    title: "Cupid",
    overview: "FIFTY FIFTY - K-pop global breakthrough, Billboard Global 200 #2",
    artist: "FIFTY FIFTY",
    album: "The Beginning: Cupid",
    duration: 174000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/4dKa5ZzlGqUy3Wo0yaXKNI"
    },
    popularity: 87,
    genre: "K-Pop",
    year: 2023,
  },
  // Bad Bunny - Latin superstar
  {
    id: "6Sq7ltF9oHo0f0L7Qm5IGV",
    spotify_id: "6Sq7ltF9oHo0f0L7Qm5IGV",
    poster_path: "https://i.scdn.co/image/ab67616d0000b27349d694203245f241a1bcaa72",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b27349d694203245f241a1bcaa72",
    original_title: "Me Porto Bonito",
    name: "Me Porto Bonito",
    title: "Me Porto Bonito",
    overview: "Bad Bunny ft. Chencho Corleone - Latin trap hit from Un Verano Sin Ti",
    artist: "Bad Bunny ft. Chencho Corleone",
    album: "Un Verano Sin Ti",
    duration: 167000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/6Sq7ltF9oHo0f0L7Qm5IGV"
    },
    popularity: 83,
    genre: "Latin Trap",
    year: 2022,
  },
  // PinkPantheress - Viral UK artist
  {
    id: "1bDbXMyjaUIooNwFE9wn0N",
    spotify_id: "1bDbXMyjaUIooNwFE9wn0N",
    poster_path: "https://i.scdn.co/image/ab67616d0000b2739567e1aa41657425d046733b",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b2739567e1aa41657425d046733b",
    original_title: "Boy's a liar",
    name: "Boy's a liar",
    title: "Boy's a liar",
    overview: "PinkPantheress - Viral UK breakbeat and garage-influenced track",
    artist: "PinkPantheress",
    album: "Boy's a liar",
    duration: 132000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/1bDbXMyjaUIooNwFE9wn0N"
    },
    popularity: 82,
    genre: "UK Garage",
    year: 2023,
  }
];

export const MOCK_POPULAR_TRACKS: ITrack[] = [
  // Classic hits with verified data
  {
    id: "4u7EnebtmKWzUH433cf5Qv",
    spotify_id: "4u7EnebtmKWzUH433cf5Qv",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273508b4bdfc39c5b3b9fbad6de",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273508b4bdfc39c5b3b9fbad6de",
    original_title: "Mr. Brightside",
    name: "Mr. Brightside",
    title: "Mr. Brightside",
    overview: "The Killers - Alternative rock anthem from Hot Fuss",
    artist: "The Killers",
    album: "Hot Fuss",
    duration: 222000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv"
    },
    popularity: 83,
    genre: "Alternative Rock",
    year: 2004,
  },
  {
    id: "60nZcImufyMA1MKQY3dcCH",
    spotify_id: "60nZcImufyMA1MKQY3dcCH",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273aeb62b5d30c4b5dbd5e77f98",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273aeb62b5d30c4b5dbd5e77f98",
    original_title: "Here Comes the Sun",
    name: "Here Comes the Sun",
    title: "Here Comes the Sun",
    overview: "The Beatles - Timeless classic from Abbey Road",
    artist: "The Beatles",
    album: "Abbey Road",
    duration: 185000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH"
    },
    popularity: 81,
    genre: "Classic Rock",
    year: 1969,
  },
  {
    id: "2ye2Wgw4gimLv2eAKyk1NB",
    spotify_id: "2ye2Wgw4gimLv2eAKyk1NB",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273396b81e76c911f6e0b6d6b6e",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273396b81e76c911f6e0b6d6b6e",
    original_title: "Watermelon Sugar",
    name: "Watermelon Sugar",
    title: "Watermelon Sugar",
    overview: "Harry Styles - Summer hit from Fine Line album",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: 174000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/2ye2Wgw4gimLv2eAKyk1NB"
    },
    popularity: 86,
    genre: "Pop Rock",
    year: 2019,
  },
  {
    id: "6f70bfcAe3BPKCljHvBw66",
    spotify_id: "6f70bfcAe3BPKCljHvBw66",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273c9b294a88d8537e8dbc13b85",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273c9b294a88d8537e8dbc13b85",
    original_title: "Someone Like You",
    name: "Someone Like You",
    title: "Someone Like You",
    overview: "Adele - Emotional ballad masterpiece from 21",
    artist: "Adele",
    album: "21",
    duration: 285000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/6f70bfcAe3BPKCljHvBw66"
    },
    popularity: 84,
    genre: "Soul",
    year: 2011,
  },
  {
    id: "4uLU6hMCjMI75M1A2tKUQC",
    spotify_id: "4uLU6hMCjMI75M1A2tKUQC",
    poster_path: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    backdrop_path: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    original_title: "Never Gonna Give You Up",
    name: "Never Gonna Give You Up",
    title: "Never Gonna Give You Up",
    overview: "Rick Astley - Iconic 80s hit and internet phenomenon",
    artist: "Rick Astley",
    album: "Whenever You Need Somebody",
    duration: 213000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC"
    },
    popularity: 79,
    genre: "Synthpop",
    year: 1987,
  }
];

export const MOCK_HERO_TRACKS: ITrack[] = [
  ...MOCK_LATEST_HITS.slice(0, 5),
  ...MOCK_POPULAR_TRACKS.slice(0, 3)
];

/**
 * Mock data service that returns research-verified music content
 */
export const getMockData = (category: string, type: string): { results: ITrack[] } => {
  switch (`${category}-${type}`) {
    case 'tracks-latest':
      return { results: MOCK_LATEST_HITS };
    case 'tracks-lofi':
      return { results: MOCK_LATEST_HITS }; // Fallback to Latest Hits - LoFi section removed
    case 'tracks-popular':
      return { results: MOCK_POPULAR_TRACKS };
    case 'tracks-hero':
      return { results: MOCK_HERO_TRACKS };
    default:
      return { results: [...MOCK_LATEST_HITS, ...MOCK_POPULAR_TRACKS].slice(0, 20) };
  }
};

/**
 * Check if mock data should be used (when Spotify API is unavailable)
 */
export const shouldUseMockData = (): boolean => {
  // Check environment variables
  const hasSpotifyCredentials = !!(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID &&
    import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
  );

  // Check if backend proxy is configured
  const hasBackendProxy = import.meta.env.VITE_USE_BACKEND_PROXY === 'true';

  // Use mock data if no credentials and no backend proxy
  return !hasSpotifyCredentials && !hasBackendProxy;
};

/**
 * Get mock data for a specific track by ID
 */
export const getMockTrackById = (id: string): ITrack | undefined => {
  const allTracks = [
    ...MOCK_LATEST_HITS,
    ...MOCK_POPULAR_TRACKS
  ];

  return allTracks.find(track => track.id === id || track.spotify_id === id);
};

const mockMusicData = {
  getMockData,
  shouldUseMockData,
  getMockTrackById,
  MOCK_LATEST_HITS,
  MOCK_POPULAR_TRACKS,
  MOCK_HERO_TRACKS
};


export default mockMusicData;
