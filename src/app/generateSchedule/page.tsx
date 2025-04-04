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
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Input the classes you want to take</h1>
        
        <div className="bg-white dark:bg-navy rounded-xl shadow-lg p-6 mb-8 border-2 border-accent-yellow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-navy dark:text-white font-medium">Classes:</label>
              <input 
                type="text" 
                name="classes" 
                id="classes" 
                placeholder="CSE 16, MATH 21, CMPM 120..." 
                required 
                ref={inputRef}
                className="w-full p-3 rounded-lg border-2 border-navy dark:border-accent-yellow bg-white dark:bg-navy-light text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow"
              />
            </div>

            <div className="flex space-x-4">
              <input 
                type="reset" 
                value = "Clear"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              />
              <input 
                type="submit" 
                value = "Generate!"
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
          <a href="/addClasses" className="no-underline">
            <button className="bg-accent-yellow hover:bg-accent-yellow-light text-navy py-2 px-4 rounded-lg transition-colors font-medium">
              Add classes not on list
            </button>
          </a>
          <a href="/" className="no-underline">
            <button className="bg-navy hover:bg-navy-light text-white py-2 px-4 rounded-lg transition-colors border-2 border-accent-yellow">
              Back
            </button>
          </a>
        </div>
      </div>
      
      <div className="bg-[#c9c9c9] rounded-xl shadow-lg p-6 min-h-[400px] border-2 border-accent-yellow w-[95%] mx-auto flex items-center justify-center">
        {graph || <p className="text-center text-white text-2xl font-medium">Your graph will appear here</p>}
      </div>
    </div>
  );
}

