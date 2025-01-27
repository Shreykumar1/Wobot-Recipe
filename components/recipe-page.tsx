import { Badge } from "@/components/ui/badge"
import { RecipeHeader } from "./recipe-header"
import { IngredientList } from "./ingredient-list"
import { Instructions } from "./instructions"
import { NutritionFacts } from "./nutrition-facts"
import { ArrowLeft, Bookmark, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

export default function RecipePage(recipeData: any) {
const recipe = recipeData.recipe;
    console.log("RecipePage",recipe);
  return (
    <div className="max-w-4xl mx-auto p-2 md:p-4 space-y-8">
<div className="flex justify-between items-center">
        <Button asChild variant="ghost">
          <Link href="/recipes">    
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Link>
        </Button>
        <Button variant="outline">
          <Bookmark className="mr-2 h-4 w-4" />
          Bookmark
        </Button>
      </div>
      <RecipeHeader
        title={recipe.title}
        image={recipe.image}
        readyInMinutes={recipe.readyInMinutes}
        servings={recipe.servings}
      />
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{recipe.vegetarian ? "Vegetarian" : ""}</Badge>
        <Badge variant="secondary">{recipe.glutenFree ? "Gluten-free" : ""}</Badge>
        <Badge variant="secondary">{recipe.dairyFree ? "Dairy-free" : ""}</Badge>
      </div>
      <div className="text-lg" dangerouslySetInnerHTML={{ __html: recipe.summary }} />
      <div className="grid md:grid-cols-2 gap-8">
        <IngredientList ingredients={recipe.extendedIngredients} />
        <Instructions instructions={recipe.analyzedInstructions[0].steps} />
      </div>
      <NutritionFacts recipe={recipe}/>
      <div className="flex justify-center">
        <Button asChild variant="outline">
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}

