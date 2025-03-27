'use client';

import { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function getClassMap(): Promise<Record<string, string>> {
  const records = await pb.collection('ucscClasses').getFullList({
    sort: '+Prereqs',
  });

  console.log("Fetched records:", records);

  const classMap: Record<string, string> = {};
  records.forEach((record) => {

    console.log("Record:", record);
    classMap[record.ClassName] = record.Prereqs;
  });


  console.log(classMap);

  const storedMap = sessionStorage.getItem('userAddedCourses');
  const userCourseMap: Record<string, string> = storedMap ? JSON.parse(storedMap) : {};

  const mergedMap: Record<string, string> = { ...userCourseMap, ...classMap, };

  return mergedMap;
}

export default function DisplayAllClasses() {
  const [classMap, setClassMap] = useState<Record<string, string>>({});

  useEffect(() => {
    getClassMap().then(setClassMap);
  }, []);

  return (
    <div>
      <h1>UCSC Classes</h1>
      <ul>
        {Object.entries(classMap).map(([className, prerequisites]) => (
          <li key={className}>
            <strong>{className}</strong>: {prerequisites || 'None'}
          </li>
        ))}
      </ul>
    </div>
  );
}
