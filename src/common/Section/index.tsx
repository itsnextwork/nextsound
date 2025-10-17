import { memo, FC, useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

import MusicSlides from "./MusicSlides";
import MusicGrid from "./MusicGrid";
import { SkelatonLoader } from "../Loader";
import Error from "../Error";
import ErrorBoundary, { APIErrorBoundary } from "../ErrorBoundary";

import { useGetTracksQuery } from "@/services/MusicAPI";
import { cn, getErrorMessage } from "@/utils/helper";
import { ITrack } from "@/types";

interface SectionProps {
  title: string;
  category: string;
  className?: string;
  type?: string;
  id?: number;
  showSimilarTracks?: boolean;
}

const Section: FC<SectionProps> = ({
  title,
  category,
  className,
  type,
  id,
  showSimilarTracks,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [allTracks, setAllTracks] = useState<ITrack[]>([]);

  const inView = useInView(ref, {
    margin: "420px",
    once: true,
  });

  const {
    data = { results: [] },
    isLoading,
    isError,
    error,
  } = useGetTracksQuery(
    {
      category,
      type,
      page: 1,
      showSimilarTracks,
      id,
      cacheKey: `${title}-1`,
    },
    {
      skip: !inView,
    }
  );

  // Handle data when it arrives
  useEffect(() => {
    if (data?.results && data.results.length > 0) {
      setAllTracks(data.results);
    }
  }, [data]);


  const errorMessage = isError ? getErrorMessage(error) : "";

  const sectionStyle = cn(
    `sm:py-[20px] xs:py-[18.75px] py-[16.75px] font-nunito`,
    className
  );

  return (
    <ErrorBoundary>
      <section className={sectionStyle} ref={ref}>
        <div className="flex flex-row justify-between items-center mb-[22.75px]">
          <div className=" relative">
            <h3 className="sm:text-[22.25px] xs:text-[20px] text-[18.75px] dark:text-gray-50 sm:font-bold font-semibold">{title}</h3>
            <div className="line" />
          </div>
        </div>
        <div className={title === "Latest Hits" ? "min-h-[400px]" : "sm:h-[312px] xs:h-[309px] h-[266px]"}>
          {isLoading ? (
            <SkelatonLoader />
          ) : isError ? (
            <Error error={String(errorMessage)} className="h-full text-[18px]" />
          ) : (
            <APIErrorBoundary>
              {title === "Latest Hits" ? (
                <MusicGrid
                  tracks={allTracks}
                  category={category}
                  initialDisplayCount={18}
                  loadMoreCount={6}
                  enableMultiShare={true}
                />
              ) : (
                <MusicSlides
                  tracks={data.results}
                  category={category}
                />
              )}
            </APIErrorBoundary>
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default memo(Section);
