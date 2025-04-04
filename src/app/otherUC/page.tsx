'use client';

export default function otherUC(){
    return(
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-8 text-white flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-4xl font-bold mb-6">Sorry, we did not add support for your UC yet :(</h1>
                <h2 className="text-2xl mb-8">You can still use our website but you will have to enter your classes manually</h2>
                
                <div className="flex flex-col items-center space-y-4">
                    <a href="/addClasses" className="no-underline">
                        <button className="bg-accent-yellow hover:bg-accent-yellow-light text-navy py-3 px-6 rounded-lg transition-colors font-medium text-lg">
                            Proceed
                        </button>
                    </a>

                    <a href="/" className="no-underline">
                        <button className="bg-navy hover:bg-navy-light text-white py-3 px-6 rounded-lg transition-colors border-2 border-accent-yellow text-lg">
                            Select a supported UC
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}