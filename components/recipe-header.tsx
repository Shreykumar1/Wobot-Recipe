import { Clock, Users } from "lucide-react"

interface RecipeHeaderProps {
  title: string
  image: string
  readyInMinutes: number
  servings: number
}

export function RecipeHeader({ title, image, readyInMinutes, servings }: RecipeHeaderProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <img src={image || "/placeholder.svg"} alt={title || "Recipe Image"} width={556} height={370} className="rounded-lg" />
      <div className="flex gap-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {readyInMinutes} minutes
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {servings} servings
        </div>
      </div>
    </div>
  )
}

