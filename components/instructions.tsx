export function Instructions({ instructions }: { instructions: any }) {
  
  
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <ol className="list-decimal pl-5 space-y-2">
          {instructions.map((step: any, index: any) => (
            <li key={index}>{step.step}</li>
          ))}
        </ol>
      </div>
    )
  }
  
  