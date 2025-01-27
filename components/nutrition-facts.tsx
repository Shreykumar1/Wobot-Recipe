"use client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function NutritionFacts({ recipe }: { recipe: any }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['nutrition', recipe.id],
    queryFn: () =>
      axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json`, {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
        },
      })
        .then(res => res.data)
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching nutrition data</div>;


  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Nutrition Facts</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Per serving:</p>
          <ul className="list-disc list-inside">
            {data.nutrients.slice(0, 5).map((nutrient: any) => (
              <li key={nutrient.name}>{nutrient.name}: {nutrient.amount} {nutrient.unit}</li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="list-disc list-inside">
            {data.nutrients.slice(5,11).map((nutrient: any) => (
              <li key={nutrient.name}>{nutrient.name}: {nutrient.amount} {nutrient.unit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}














  // export function NutritionFacts({ recipe }: { recipe: any }) {
  //   console.log("Nutrition Facts", recipe.nutrition);
  //     return (
  // <div className="bg-gray-100 p-4 rounded-lg">
  //       <h2 className="text-2xl font-semibold mb-4">Nutrition Facts</h2>
  //       <div className="grid grid-cols-2 gap-4">
  //         <div>
  //           <p className="font-medium">Per serving:</p>
  //           <ul className="list-disc list-inside">
  //             <li>Calories: {recipe.nutrition.calories}</li>
  //             <li>Fat: {recipe.nutrition.fat}</li>
  //             <li>Protein: {recipe.nutrition.protein}</li>
  //           </ul>
  //         </div>
  //         <div>
  //           <p className="font-medium">Other facts:</p>
  //           <ul className="list-disc list-inside">
  //             <li>Health Score: {recipe.nutrition.healthScore}</li>
  //             <li>Weight Watcher Points: {recipe.nutrition.weightPerServing.amount}</li>
  //           </ul>
  //         </div>
  //       </div>
  //     </div>
  //     )
  //   }
    
    