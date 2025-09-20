import { Utensils } from "lucide-react";

const PageLoader = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-300 via-white to-slate-500 z-[9999]">
            {/* Outer Ring Loader */}
            <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-slate-300 border-t-orange-500 animate-spin"></div>

                {/* Inner Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Utensils className="w-10 h-10 text-orange-600 animate-pulse" />
                </div>
            </div>

            {/* Elegant Text */}
            <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800 tracking-wide">
                    Loading
                </h2>
                <p className="mt-2 text-slate-500 text-sm animate-pulse">
                    Please wait while we prepare your experience...
                </p>
            </div>
        </div>
    );
};

export default PageLoader;