
'use client';

export default function generateSchedulePage(){







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
      <div>
        <h1>Add your class</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label >Class Name: </label>
                <input type="text" name="course" id="course" placeholder="CSE 14S" required/>
            </div>

            <div>
                <label >Prerequisites: </label>
                <input type="text" name="prereqs" id="prereqs" placeholder="CSE 16, MATH 21, CMPM 120..." />
            </div>

            <div>
                <input type="reset"/>
                <input type="submit"/>
            </div>
            

        </form>
        
        <br />

        <div>
            <a href="/allClasses" style={{ textDecoration: 'none' }}>
                <button>View all availible classes</button>
            </a>
            <a href="/generateSchedule" style={{ textDecoration: 'none' }}>
                <button>Input Availible Classes</button>
            </a>

        </div>

      </div>

    )
  
  }

