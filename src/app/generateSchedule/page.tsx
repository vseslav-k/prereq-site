'use client';
import { JSX, useState } from 'react';
import { DAGGraph, buildMapFromString } from '@/utils/graphDrawer';
import { meregeMaps } from '@/utils/databaseWrangler';

export default function GenerateSchedulePage() {
  const [graph, setGraph] = useState<JSX.Element | null>(null);

  async function generateGraph(userInput: string) {
    const allClasses = await meregeMaps();
    const map = buildMapFromString(allClasses, userInput);
    const generatedGraph = DAGGraph(map);
    setGraph(generatedGraph); // ⬅️ updates React state, re-renders
  }

  function cleanUserInp(inp: string):string{
    
    inp = inp.replace(/ +/g, ' ');
    inp = inp.replace(/ ,/g, ',');

    
    while (inp.endsWith(' ') || inp.endsWith(',')) {
      inp = inp.slice(0, -1);
    }

    return inp;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const userInput = formData.get('classes') as string;

    generateGraph(cleanUserInp(userInput));
  }
    


    return (
      <div>
        <h1>Input the classes you want to take</h1>
        <form onSubmit={handleSubmit}>
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

        <div>
            {graph}
        </div>

        

      </div>

    )
  
  }

