'use client';
import { getKeyCourses } from '@/utils/graphDrawer';
import { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import { cleanUserInp, toStdInput, toUrlInput } from '@/utils/inputManager';

import {getClassMap, meregeMaps} from '@/utils/databaseWrangler'



export default function DisplayAllClasses() {
  const [classMap, setClassMap] = useState<Record<string, string>>({});

  useEffect(() => {
    meregeMaps().then(setClassMap);
  }, []);



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

    getRedirUrl()

    window.location.href = getRedirUrl();
    
  }

  return (
    <div>
      <h1>UCSC Classes</h1>

      <form onSubmit={handleSubmit} >
        <ul>
            {Object.entries(classMap).map(([className, prerequisites]) => (
            <li key={className}>
                <input type="checkbox" id={className} name={className}></input>
                <strong>{className}</strong>: {prerequisites || 'None'}
            </li>
            ))}
        </ul>


        <div>
            <input type="reset"/>
            <input type="submit" value="Generate Graph!" />
        </div>

      </form>

    
      

      <div>
        <a href="/generateSchedule" style={{ textDecoration: 'none' }}>
                <button>Input Your Classes</button>
            </a>
     </div>
      
    </div>
  );
}
