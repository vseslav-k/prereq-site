'use client';

export default function HomePage(){
    

  
    function selectUC(uc: string) {
      sessionStorage.setItem('myUC', uc);
      console.log(`Selected UC: ${uc}`);
      
      if(uc=="Other"){
        window.location.href = "/otherUC";
        return
      }

      window.location.href = "/generateSchedule";

    }


    return (
      <div>
        <h1>Select your UC</h1>
        <br />
        <div><button id="UCSC"  onClick={() => selectUC("UCSC")}>UC Santa Cruz</button></div>
        <div><button id="UCB"   onClick={() => selectUC("UCB")}>UC Berkeley</button></div>
        <div><button id="Other" onClick={() => selectUC("Other")}>Other UC</button></div>

      </div>

    )
  
  }

