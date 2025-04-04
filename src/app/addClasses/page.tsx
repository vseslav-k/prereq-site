'use client';

export default function AddClassesPage() {
    function addNewCourse(course: string, prereqs:string) {
        const storedMap = sessionStorage.getItem('userAddedCourses');
        const courseMap: Record<string, string> = storedMap ? JSON.parse(storedMap) : {};
        courseMap[course] = prereqs;
        sessionStorage.setItem('userAddedCourses', JSON.stringify(courseMap));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    
        const formData = new FormData(e.currentTarget);
        const course = formData.get('course') as string;
        const prereqs = formData.get('prereqs') as string;
    
        addNewCourse(course, prereqs);
        alert(`Added course: ${course} with prereqs: ${prereqs}`);
    
        // Optional: Reset the form after submission
        e.currentTarget.reset();
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-8 text-white flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">Add Your Class</h1>
          
          <div className="bg-white dark:bg-navy rounded-xl shadow-lg p-6 mb-8 border-2 border-accent-yellow">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-navy dark:text-white font-medium">Class Name:</label>
                <input 
                  type="text" 
                  name="course" 
                  id="course" 
                  placeholder="CSE 14S" 
                  required 
                  className="w-full p-4 rounded-lg border-2 border-navy dark:border-accent-yellow bg-white dark:bg-navy-light text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-navy dark:text-white font-medium">Prerequisites:</label>
                <input 
                  type="text" 
                  name="prereqs" 
                  id="prereqs" 
                  placeholder="CSE 16, MATH 21, CMPM 120..." 
                  className="w-full p-4 rounded-lg border-2 border-navy dark:border-accent-yellow bg-white dark:bg-navy-light text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow text-lg"
                />
              </div>

              <div className="flex justify-center space-x-4">
                <input 
                  type="reset" 
                  value="Clear"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                />
                <input 
                  type="submit" 
                  value="Add Class"
                  className="bg-accent-yellow hover:bg-accent-yellow-light text-navy py-2 px-4 rounded-lg transition-colors font-medium"
                />
              </div>
            </form>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a href="/allClasses" className="no-underline">
              <button className="bg-accent-yellow hover:bg-accent-yellow-light text-navy py-2 px-4 rounded-lg transition-colors font-medium">
                View all available classes
              </button>
            </a>
            <a href="/generateSchedule" className="no-underline">
              <button className="bg-accent-yellow hover:bg-accent-yellow-light text-navy py-2 px-4 rounded-lg transition-colors font-medium">
                Input Available Classes
              </button>
            </a>
            <a href="/" className="no-underline">
              <button className="bg-navy hover:bg-navy-light text-white py-2 px-4 rounded-lg transition-colors border-2 border-accent-yellow">
                Back
              </button>
            </a>
          </div>
        </div>
      </div>
    );
}

