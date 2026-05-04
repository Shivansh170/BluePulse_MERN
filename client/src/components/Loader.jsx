import { Loader2 } from "lucide-react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-cyan-400/20 rounded-full"></div>
      </div>
      <p className="text-lg font-medium text-cyan-200/80 tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
}
