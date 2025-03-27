'use client';


export default function otherUC(){

    return(
        <div>
            <h1>Sorry, we did not add support for your UC yet :(</h1>
            <h2>You can still use our website but you will have to enter your classes manually</h2>
            <a href="/addClasses" style={{ textDecoration: 'none' }}>
                <button>Procceed</button>
            </a>

            <a href="/" style={{ textDecoration: 'none' }}>
                <button>Select a supported UC</button>
            </a>

        </div>

    )

}