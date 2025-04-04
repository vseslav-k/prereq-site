'use client';
import { getKeyCourses } from '@/utils/graphDrawer';
import { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import { cleanUserInp, toStdInput, toUrlInput } from '@/utils/inputManager';
import { getClassMap, meregeMaps } from '@/utils/databaseWrangler';

export default function DisplayAllClasses() {
  const [classMap, setClassMap] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClasses, setFilteredClasses] = useState<Record<string, string>>({});
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  useEffect(() => {
    meregeMaps().then(setClassMap);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClasses(classMap);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered: Record<string, string> = {};
      
      Object.entries(classMap).forEach(([className, prerequisites]) => {
        if (
          className.toLowerCase().includes(query) || 
          (prerequisites && prerequisites.toLowerCase().includes(query))
        ) {
          filtered[className] = prerequisites;
        }
      });
      
      setFilteredClasses(filtered);
    }
  }, [searchQuery, classMap]);

  const handleCheckboxChange = (className: string, checked: boolean) => {
    if (checked) {
      setSelectedClasses(prev => [...prev, className]);
    } else {
      setSelectedClasses(prev => prev.filter(c => c !== className));
    }
  };

  const removeFromCart = (className: string) => {
    setSelectedClasses(prev => prev.filter(c => c !== className));
    // Also uncheck the checkbox
    const checkbox = document.getElementById(className) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent page reload

    function getRedirUrl(){
      const form = e.currentTarget;
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      let selectedClasses = '';

      checkboxes.forEach((checkbox) => {
        const input = checkbox as HTMLInputElement;
        if (input.checked) {
          selectedClasses += input.id + ', ';
        }
      });

      selectedClasses = cleanUserInp(selectedClasses);
      const keyCourses = toUrlInput(getKeyCourses(classMap, selectedClasses));
      const redirUrl = "/generateSchedule?classes="+keyCourses;

      console.log(selectedClasses);
      console.log(redirUrl);

      return redirUrl;
    }

    getRedirUrl();
    window.location.href = getRedirUrl();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-8 text-white flex flex-col items-center">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">UCSC Classes</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Class list */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-navy rounded-xl shadow-lg p-6 mb-8 border-2 border-accent-yellow">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search classes or prerequisites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-4 rounded-lg border-2 border-navy dark:border-accent-yellow bg-white dark:bg-navy-light text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow text-lg"
                />
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                  {Object.keys(filteredClasses).length > 0 ? (
                    <ul className="space-y-2">
                      {Object.entries(filteredClasses).map(([className, prerequisites]) => (
                        <li key={className} className="flex items-start space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-navy-light rounded-lg">
                          <input 
                            type="checkbox" 
                            id={className} 
                            name={className}
                            onChange={(e) => handleCheckboxChange(className, e.target.checked)}
                            className="mt-1 h-5 w-5 text-accent-yellow border-navy rounded focus:ring-accent-yellow"
                          />
                          <div>
                            <span className="font-bold text-navy dark:text-white">{className}</span>
                            <span className="text-gray-600 dark:text-gray-300">: {prerequisites || 'None'}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No classes match your search. Try a different search term.
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <input 
                    type="reset" 
                    value="Clear Selection"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                    onClick={() => setSelectedClasses([])}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Shopping Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-navy rounded-xl shadow-lg p-6 mb-8 border-2 border-accent-yellow sticky top-8">
              <h2 className="text-xl font-bold mb-4 text-navy dark:text-white text-center">Selected Classes</h2>
              
              {selectedClasses.length > 0 ? (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {selectedClasses.map(className => (
                    <div key={className} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-navy-light rounded-lg">
                      <span className="font-medium text-navy dark:text-white">{className}</span>
                      <button 
                        onClick={() => removeFromCart(className)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-navy"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No classes selected yet
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-navy dark:text-white font-medium">Total Classes:</span>
                  <span className="text-navy dark:text-white font-bold">{selectedClasses.length}</span>
                </div>
                
                <button 
                  onClick={() => {
                    if (selectedClasses.length > 0) {
                      const keyCourses = toUrlInput(getKeyCourses(classMap, selectedClasses.join(', ')));
                      window.location.href = "/generateSchedule?classes=" + keyCourses;
                    }
                  }}
                  className={`w-full py-2 px-4 rounded-lg transition-colors font-medium ${
                    selectedClasses.length > 0 
                      ? "bg-accent-yellow hover:bg-accent-yellow-light text-navy" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={selectedClasses.length === 0}
                >
                  Generate Graph
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a href="/generateSchedule" className="no-underline">
            <button className="bg-accent-yellow hover:bg-accent-yellow-light text-navy py-2 px-4 rounded-lg transition-colors font-medium">
              Input Classes Manually
            </button>
          </a>
          <a href="/" className="no-underline">
            <button className="bg-navy hover:bg-navy-light text-white py-2 px-4 rounded-lg transition-colors border-2 border-accent-yellow">
              UC Selection
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
