import { Loader, Error, Section } from "@/common";
import { Hero } from "./components";

import { useGetTracksQuery } from "@/services/MusicAPI";
import { maxWidth } from "@/styles";
import { sections } from "@/constants";
import { cn } from "@/utils/helper";


const Home = () => {
  
  // Use different data source for Hero vs sections to avoid duplicates
  const { data: heroData, isLoading: heroLoading, isError: heroError } = useGetTracksQuery({
    category: "tracks",
    type: "latest", // Use latest tracks for Hero to show current trending content
    page: 1,
    cacheKey: "hero" // Use different cache key to avoid conflicts with main sections
  });

  const { data, isLoading, isError, error } = useGetTracksQuery({
    category: "tracks",
    type: "popular",
    page: 1,
  });

  if (isLoading || heroLoading) {
    return <Loader />;
  }

  if (isError || heroError) {
    return <Error error="Unable to fetch the music tracks! " />;
  }

  const popularTracks = heroData?.results || data?.results || [];

  return (
    <>
      <Hero tracks={popularTracks} />
      <div className={cn(maxWidth, "lg:mt-12 md:mt-8 sm:mt-6 xs:mt-4 mt-2")}>
        {sections.map(({ title, category, type }) => (
          <Section title={title} category={category} type={type} key={title} />
        ))}
      </div>
    </>
  );
};

export default Home;
