export default function generateSchedulePage(){

    return (
      <div>
        <h1>Input the classes you want to take</h1>
        <form >
            <div>
                <label >Classes:</label>
                <input type="text" name="classes" id="classes" placeholder="CSE 16, MATH 21, CMPM 120..." required/>
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
            <a href="/addClasses" style={{ textDecoration: 'none' }}>
                <button>Add classes not on list</button>
            </a>
            <a href="/" style={{ textDecoration: 'none' }}>
                <button>Back</button>
            </a>
        </div>

      </div>

    )
  
  }

