import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div
        className="text-8xl font-bold text-blue-500/20 leading-none mb-4"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        404
      </div>
      <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
        Page Not Found
      </h2>
      <p className="text-white/40 text-sm mb-6 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500/20 text-blue-300 text-sm font-semibold border border-blue-500/30 hover:bg-blue-500/30 transition-all cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </div>
      </Link>
    </div>
  );
}
