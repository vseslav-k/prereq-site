'use client';
import { JSX, useState, useRef, useEffect } from 'react';
import { DAGGraph, buildMapFromString } from '@/utils/graphDrawer';
import { cleanUserInp, toStdInput } from '@/utils/inputManager';
import { meregeMaps } from '@/utils/databaseWrangler';
import { useSearchParams } from 'next/navigation';






export default function GenerateSchedulePage() {
  let urlParametersRecieved = false;
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();


  function checkUrlParams(params: URLSearchParams) {

    if (urlParametersRecieved) return;

    const urlClasses = params.get('classes');
    console.log(urlClasses);

    if (!urlClasses) return;
    
    urlParametersRecieved = true;
    const urlInp = cleanUserInp(urlClasses);
    const parsed = toStdInput(urlInp);
    
    autofillInput(parsed);
    generateGraph(parsed);
  }

useEffect(() => {
  checkUrlParams(searchParams);
}, [searchParams]);

  
  function autofillInput(value: string) {
    if (inputRef.current) {
      inputRef.current.value = value;
    }
  }

  async function generateGraph(userInput: string) {
    const allClasses = await meregeMaps();
    const map = buildMapFromString(allClasses, userInput);
    const generatedGraph = DAGGraph(map);
    setGraph(generatedGraph); 
  }


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const userInput = formData.get('classes') as string;

    generateGraph(cleanUserInp(userInput));
  }
    



  const [graph, setGraph] = useState<JSX.Element | null>(null);
  useEffect(() => {
    checkUrlParams(searchParams);
  }, [searchParams]);


    return (
      <div>
        <h1>Input the classes you want to take</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label >Classes:</label>
                <input type="text" name="classes" id="classes" placeholder="CSE 16, MATH 21, CMPM 120..." required ref={inputRef}/>
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

        <div>
            {graph}
        </div>

        

      </div>

    )
  
  }

