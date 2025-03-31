import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

export async function getClassMap(): Promise<Record<string, string>> {
    const records = await pb.collection('ucscClasses').getFullList({
      sort: '+Prereqs',
    });
  
    const classMap: Record<string, string> = {};
    records.forEach((record) => {

      classMap[record.ClassName] = record.Prereqs;
    });
  
    
    return classMap;
  
  }


  export async function meregeMaps(): Promise<Record<string, string>> {
    const classMap = await getClassMap();
    
    const storedMap = sessionStorage.getItem('userAddedCourses');
    const userCourseMap: Record<string, string> = storedMap ? JSON.parse(storedMap) : {};
  
    const mergedMap: Record<string, string> = { ...userCourseMap, ...classMap, };
  
    return mergedMap;
  }