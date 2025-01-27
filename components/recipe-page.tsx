import { Badge } from "@/components/ui/badge";
import { RecipeHeader } from "./recipe-header";
import { IngredientList } from "./ingredient-list";
import { Instructions } from "./instructions";
import { NutritionFacts } from "./nutrition-facts";
import { ArrowLeft, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function RecipePage({recipeData, bookmarkClick, isBookmarked}: {recipeData: any, bookmarkClick: any, isBookmarked: any}) {
  const recipe = recipeData;
  return (
    <div className="max-w-4xl mx-auto p-2 md:p-4 space-y-8">
      <div className="flex justify-between items-center">
        <Button asChild variant="ghost">
          <Link href="/recipes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Link>
        </Button>
        <Button variant="outline" onClick={bookmarkClick} className={`flex items-center ${isBookmarked ? "text-red-500" : ""}`}>
          <Bookmark className={`mr-2 h-4 w-4 `} />
          {isBookmarked ? "Remove Bookmark" : "Bookmark"}
        </Button>
      </div>
      <RecipeHeader
        title={recipe.title}
        image={recipe.image}
        readyInMinutes={recipe.readyInMinutes}
        servings={recipe.servings}
      />
      <div className="flex flex-wrap gap-2">
        {recipe.vegetarian && <Badge variant="secondary">Vegetarian</Badge>}
        {recipe.glutenFree && <Badge variant="secondary">Gluten-free</Badge>}
        {recipe.dairyFree && <Badge variant="secondary">Dairy-free</Badge>}
      </div>
      <div
        className="text-lg"
        dangerouslySetInnerHTML={{ __html: recipe.summary }}
      />
      <div className="grid md:grid-cols-2 gap-8">
        <IngredientList ingredients={recipe.extendedIngredients} />
        <Instructions instructions={recipe.analyzedInstructions[0].steps} />
      </div>
      <NutritionFacts recipe={recipe} />
      <div className="flex justify-center">
        <Button asChild variant="outline">
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
            Source
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
