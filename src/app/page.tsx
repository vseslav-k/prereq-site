'use client';

export default function HomePage() {
  function selectUC(uc: string) {
    sessionStorage.setItem('myUC', uc);
    console.log(`Selected UC: ${uc}`);
    
    if(uc=="Other") {
      window.location.href = "/otherUC";
      return;
    }
    window.location.href = "/generateSchedule";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-navy rounded-2xl shadow-xl p-8 border-2 border-accent-yellow">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy dark:text-white mb-3">
            Select your UC
          </h1>
          <p className="text-navy-light dark:text-gray-300">
            Choose your university to get started
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => selectUC("UCSC")}
            className="w-full py-4 px-6 bg-accent-yellow text-navy text-lg font-semibold rounded-xl 
                     transition duration-200 ease-in-out transform hover:scale-[1.02] 
                     hover:bg-accent-yellow-light hover:shadow-lg focus:outline-none focus:ring-2 
                     focus:ring-navy focus:ring-opacity-50"
          >
            UC Santa Cruz
          </button>
          
          <button
            onClick={() => selectUC("UCB")}
            className="w-full py-4 px-6 bg-accent-yellow text-navy text-lg font-semibold rounded-xl 
                     transition duration-200 ease-in-out transform hover:scale-[1.02] 
                     hover:bg-accent-yellow-light hover:shadow-lg focus:outline-none focus:ring-2 
                     focus:ring-navy focus:ring-opacity-50"
          >
            UC Berkeley
          </button>
          
          <button
            onClick={() => selectUC("Other")}
            className="w-full py-4 px-6 bg-navy text-white text-lg font-semibold rounded-xl 
                     transition duration-200 ease-in-out transform hover:scale-[1.02] 
                     hover:bg-navy-light hover:shadow-lg focus:outline-none focus:ring-2 
                     focus:ring-accent-yellow focus:ring-opacity-50 border-2 border-accent-yellow"
          >
            Other UC
          </button>
        </div>
      </div>
    </main>
  );
}

