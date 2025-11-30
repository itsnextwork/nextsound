import { BiError } from "react-icons/bi";
import { cn } from "@/utils/helper";

interface ErrorProps {
  className?: string | undefined;
  error: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const Error = ({ className = "h-screen", error, onRetry, showRetry = false }: ErrorProps) => {
  return (
    <div
      className={cn(
        `relative dark:bg-black bg-main-color top-0 left-0 w-screen flex justify-center items-center`,
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-row gap-2 items-end">
          <BiError className="text-[#d94040] text-[32px]" />
          <p className="font-roboto dark:text-gray-300 text-gray-900">{error}</p>
        </div>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;
