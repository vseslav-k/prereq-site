import { Node, Edge, MarkerType } from 'reactflow';

import ReactFlow from 'reactflow';

import 'reactflow/dist/style.css';






export function DAGGraph(classMap: Record<string, string[]>) {
  const { nodes, edges } = buildGraphFromMap(classMap);

  return (

    

    <div style={{ width: '100%', height: '1000px' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
}



export function buildMapFromString(allClassesMap: Record<string, string>, classesStr: string){

    const courseArr:string[] = classesStr.split(", ")

    const resultMap: Record<string, string> = {};

    for (const course of courseArr) {

      if(!(course in allClassesMap)){
        console.error("user inputted course not found in database or session storage: "+course);

      }

      resultMap[course] = allClassesMap[course];


    }
    
    return includeUnmentionedPrereqs(parseMap(allClassesMap), parseMap(resultMap));

}

function getJumpVal(
  course: string,
  dag: Record<string, string[]>,
  depths: Record<string, number>,
  max = true
): number {
  const parentDepth = depths[course] ?? 0;
  const children: string[] = [];

  for (const [target, prereqs] of Object.entries(dag)) {
    if (prereqs.includes(course)) {
      children.push(target);
    }
  }

  if (children.length === 0) return 110;

  const jumps = children.map(child => (depths[child] ?? 0) - parentDepth);
  return max ? Math.max(...jumps) : Math.min(...jumps);
}


function parseMap(map: Record<string, string>){

  const parsedMap: Record<string, string[]> = {};


  for (const [course, prereqString] of Object.entries(map)) {


    if(prereqString=="" ||prereqString==null){
      parsedMap[course] =[];
      continue;
    }

    parsedMap[course] = prereqString.split(", ");

    

  }

  return parsedMap;


}

function includeUnmentionedPrereqs(completeCourseMap: Record<string, string[]>, map: Record<string, string[]>) {

  let result:Record<string, string[]>  = structuredClone(map) ;
  let totalPrereqList: string[] = [];
  
  

  console.log("result" )
  console.log(result )
  console.log("completeCourseMap" )
  console.log(completeCourseMap )


  for (let i = 0; i < 20; i++) {
    totalPrereqList = [];


    console.log("Inner loop 1 start" )
    for (const [key, value] of Object.entries(result)) {


      totalPrereqList = totalPrereqList.concat(value);
    }

    console.log("totalPrereqList" )
    console.log(totalPrereqList )
  
    const keysList: string[] = Object.keys(result);
    totalPrereqList = totalPrereqList.filter(item => !keysList.includes(item));
    
    totalPrereqList = Array.from(new Set(totalPrereqList));

    console.log("totalPrereqList after filter" )
    console.log(totalPrereqList )

    console.log("Key list" )
    console.log(keysList )
  
    if(totalPrereqList.length==0){
      console.log("Function returned on its own will "+i)
      return result;
    }
  
    for (const course of totalPrereqList) {
      result[course] = completeCourseMap[course];
    }

    console.log("result after appending" )
    console.log(result )

  }


  console.log("Function returned due to timeout")
  return result;
  

}


function buildGraphFromMap(dag: Record<string, string[]>) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const components = findConnectedComponents(dag);
  const colorMap = generateColorMap(dag);

  const xSpacing = 200;
  const ySpacing = 150;
  const chunkSpacing = 0;

  let chunkOffsetX = 0;

  for (const component of components) {
    const subgraph: Record<string, string[]> = {};
    for (const course of component) {
      subgraph[course] = dag[course];
    }

    const depths = getDepths(subgraph);

    const depthGroups: Record<number, string[]> = {};
    for (const [course, depth] of Object.entries(depths)) {
      if (!depthGroups[depth]) depthGroups[depth] = [];
      depthGroups[depth].push(course);
    }

    for (const [depthStr, courses] of Object.entries(depthGroups)) {
      const depth = parseInt(depthStr);

      const sorted = courses.slice().sort((a, b) => {
        const jumpA = getJumpVal(a, dag, depths, true);
        const jumpB = getJumpVal(b, dag, depths, true);
        return jumpA - jumpB;
      });

      sorted.forEach((course, i) => {
        const x = chunkOffsetX + i * xSpacing;
        const y = depth * ySpacing;

        nodes.push({
          id: course,
          data: { label: course },
          position: { x, y },
          style: {
            backgroundColor: hsvToHex(
              colorMap[course][0],
              colorMap[course][1],
              colorMap[course][2]
            ),
          },
        });
      });
    }

    for (const [course, prereqs] of Object.entries(subgraph)) {
      for (const prereq of prereqs) {
        edges.push({
          id: `${prereq}->${course}`,
          source: prereq,
          target: course,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        });
      }
    }

    const widestRow = Math.max(
      1,
      ...Object.values(depthGroups).map((group) => group.length)
    );
    chunkOffsetX += widestRow * xSpacing + chunkSpacing;
  }

  return { nodes, edges };
}






function findConnectedComponents(dag: Record<string, string[]>): string[][] {
  const visited = new Set<string>();
  const components: string[][] = [];

  const neighbors: Record<string, Set<string>> = {};

  // Build undirected adjacency list
  for (const [course, prereqs] of Object.entries(dag)) {
    if (!neighbors[course]) neighbors[course] = new Set();
    for (const prereq of prereqs) {
      if (!neighbors[prereq]) neighbors[prereq] = new Set();
      neighbors[course].add(prereq);
      neighbors[prereq].add(course);
    }
  }

  for (const node of Object.keys(dag)) {
    if (visited.has(node)) continue;

    const queue = [node];
    const component: string[] = [];
    visited.add(node);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      component.push(curr);

      for (const neighbor of neighbors[curr] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    components.push(component);
  }

  return components;
}


function findIsolatedNodes(dag: Record<string, string[]>): string[] {
  const allCourses = Object.keys(dag);
  const dependents = new Set(
    Object.values(dag).flat()
  );

  return allCourses.filter(course =>
    (dag[course].length === 0) && !dependents.has(course)
  );
}

function topoSort(dag: Record<string, string[]>): string[] {
  const inDegree: Record<string, number> = {};
  const order: string[] = [];
  const queue: string[] = [];

  // Initialize in-degrees
  for (const [course, prereqs] of Object.entries(dag)) {
    if (!(course in inDegree)) inDegree[course] = 0;

    for (const prereq of prereqs) {
      inDegree[prereq] = (inDegree[prereq] ?? 0) + 1;
    }
  }

  // Start with nodes that have no prerequisites
  for (const course in inDegree) {
    if (inDegree[course] === 0) {
      queue.push(course);
    }
  }

  // Process the graph
  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    for (const [target, prereqs] of Object.entries(dag)) {
      if (prereqs.includes(current)) {
        inDegree[target]--;
        if (inDegree[target] === 0) {
          queue.push(target);
        }
      }
    }
  }

  return order;
}


function getDepths(graph: Record<string, string[]>): Record<string, number> {
  const depths: Record<string, number> = {};

  function dfs(course: string): number {
    if (depths[course] !== undefined) return depths[course];

    const prereqs = graph[course] || [];
    if (prereqs.length === 0) {
      depths[course] = 0;
      return 0;
    }

    const depth = Math.max(...prereqs.map(dfs)) + 1;
    depths[course] = depth;
    return depth;
  }

  for (const course of Object.keys(graph)) {
    dfs(course);
  }

  return depths;
}



function getPrereqCounts(graph: Record<string, string[]>): Record<string, number>{
  const prereqCounts: Record<string, number> = {};
  

  for (const [course, prereqs] of Object.entries(graph)) {
    prereqCounts[course] = prereqs.length;
  }

  return prereqCounts;

}

function getDependencies(graph: Record<string, string[]>): Record<string, string[]>{
  let dependencies: Record<string, string[]> = {};



  for (const [course1, prereqs1] of Object.entries(graph)) {
    const dependenciesList: string[] = [];

    for (const [course2, prereqs2] of Object.entries(graph)) {

      if(course1===course2){
        continue;
      }

      if(prereqs2.includes(course1)){
        dependenciesList.push(course1);
      }
   
    }

    dependencies[course1]=dependenciesList;

 
  }

  return dependencies;
}

function isUpperDiv(course: string):boolean{

  let courseId =course.split(" ")[1];

  if(courseId.length <3){
    return false
  }

  function isNumeric(str: string): boolean {
    return !isNaN(Number(str)) && str.trim() !== '';
  }



  if(isNumeric(courseId)){
    return true
  }





  return false
}


function generateColorMap(coursesMap: Record<string, string[]>){

  let divisions: string[] = [];

  for (const [course, prereqs] of Object.entries(coursesMap)) {

    let division = course.split(" ")[0];

    if(!(divisions.includes(division))){
      divisions.push(division);
    }


  }


  const hueOffset = 330/divisions.length

  let huesArrs:number[] = []


  for(let i=0; i<divisions.length ; i++){
    huesArrs[i] = i*hueOffset;

  }


  const hueMap: Record<string, number> = {};

  for (let i = 0; i < huesArrs.length; i++) {
    hueMap[divisions[i]] = huesArrs[i];
  }






  let depths = getDepths(coursesMap);

  const satDelta = (80-35)/Math.max(...Object.values(depths))


  const colorMap: Record<string, number[]> = {};

  for (const [course, prereqs] of Object.entries(coursesMap)) {
    let division = course.split(" ")[0];

    colorMap[course] = [hueMap[division],35+ satDelta*depths[course], 100]


  }


  return colorMap;

}



function hsvToHex(h: number, s: number, v: number): string {

  h = h / 60;
  s = s / 100;
  v = v / 100;


  let r = 0, g = 0, b = 0;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}