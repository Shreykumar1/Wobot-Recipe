export function IngredientList({ ingredients }: { ingredients: any[] }) {
  
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
        <ul className="list-disc pl-5 space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient.amount} {ingredient.unit}  {ingredient.name}</li>
          ))}
        </ul>
      </div>
    )
  }
  
  