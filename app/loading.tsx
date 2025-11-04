export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <div className="glass-dark rounded-3xl p-12 max-w-md mx-auto animate-fadeIn">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white drop-shadow-lg">
            AeroHealth Forecast
          </h2>
          <p className="mt-3 text-white/90 text-base font-medium">
            Loading...
          </p>
        </div>
      </div>
    </main>
  );
}

