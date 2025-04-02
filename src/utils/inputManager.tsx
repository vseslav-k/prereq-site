export function cleanUserInp(inp: string):string{
    
    inp = inp.replace(/ +/g, ' ');
    inp = inp.replace(/,+/g, ',');
    inp = inp.replace(/ ,/g, ',');
    inp = inp.toUpperCase()

    
    while (inp.endsWith(' ') || inp.endsWith(',')) {
      inp = inp.slice(0, -1);
    }


    return inp;
}


export function toStdInput(inp:string){
    inp = inp.replace(/_/g, ', ');
    return inp

}

export function toUrlInput(inp:string){
    inp=cleanUserInp(inp);

    inp = inp.replace(/, /g, '_');
    inp = inp.replace(/ /g, '+');

    return inp;

}