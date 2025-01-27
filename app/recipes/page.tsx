"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Bookmark, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { addBookmark } from "../utils/userBookmark";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store"; // Adjust the import path as necessary
import { setUser } from "../store/userslice";
import Notification from "../utils/notification";
import Loading from "../utils/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";
import getToken from "../utils/getToken";
import { jwtDecode } from "jwt-decode";
import { Input } from "@/components/ui/input"; // Ensure you import the Input component

const cuisines = ["Asian", "American", "Indian", "Italian", "Japanese"];
const diets = [
  "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Ovo-Vegetarian",
  "Vegan",
];

const fetchRecipes = async (
  page: number,
  cuisine: string | undefined,
  diet: string | undefined,
  query: string
) => {
  const response = await axios.get(
    "https://api.spoonacular.com/recipes/complexSearch",
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
      },
      params: {
        number: 20,
        offset: page * 20,
        cuisine: cuisine || undefined,
        diet: diet || undefined,
        query: query || undefined,
      },
    }
  );
  return response.data.results;
};

export default function RecipesPage() {
  const [selectedCuisine, setSelectedCuisine] = useState<string | undefined>(
    undefined
  );
  const [selectedDiet, setSelectedDiet] = useState<string | undefined>(
    undefined
  );
  const [notification, setNotification] = useState<React.ReactNode | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [queryClick, setQueryClick] = useState(false);
  const {
    data: recipes,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["recipes", page, selectedCuisine, selectedDiet, queryClick],
    queryFn: () =>
      fetchRecipes(page, selectedCuisine, selectedDiet, searchQuery),
  });
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, []);

  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        router.push("/login");
      } else {
        // setLoadingPage(false);
      }
    } else router.push("/login");
  }, []);

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching recipes</div>;
  const handleSearchClick = () => {
    setQueryClick(true);
  };

  async function fetchUser() {
    if (user) {
      try {
        const response = await fetch(`/api/user/${user.user.email}`);
        const data = await response.json();
        const newUser = { ...user, user: data.user };
        dispatch(setUser(newUser));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
  }

  const handleBookmark = async (recipe: any) => {
    if (user) {
      try {
        const response = await fetch("/api/bookmarks/addBookmark", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.user.email,
            bookmark: {
              id: recipe.id,
              image: recipe.image,
              imageType: "recipe", // Adjust as necessary
              title: recipe.title,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          // throw new Error(`Error adding bookmark: ${errorText}`);
        }

        const data = await response.json();
        setNotification(
          <Notification status="success" message={data.message} />
        );
        fetchUser();
      } catch (error) {
        console.error("Error during adding bookmark:", error);
        setNotification(
          <Notification status="error" message="Error during adding bookmark." />
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center max-w-7xl mx-auto p-4">
      {notification}
            <div className="relative w-full max-w-3xl">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 bg-white text-gray-800 placeholder-gray-400 text-lg px-6 rounded-full border border-red-200 shadow-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
          onClick={handleSearchClick}
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="w-full">
        <div className="w-full flex items-center justify-between pb-5">
          <div>
            <h2>Cuisine</h2>
            <Select
              onValueChange={(value) => setSelectedCuisine(value || undefined)}
              value={selectedCuisine}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Cuisine" />
              </SelectTrigger>
              <SelectContent>
                {cuisines.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h2>Diet</h2>
            <Select
              onValueChange={(value) => setSelectedDiet(value || undefined)}
              value={selectedDiet}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Diet" />
              </SelectTrigger>
              <SelectContent>
                {diets.map((diet) => (
                  <SelectItem key={diet} value={diet}>
                    {diet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe: any) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white shadow-lg rounded-lg flex flex-col h-full hover:scale-105 transition-all duration-300">
                  <CardContent className="flex flex-col flex-grow px-0">
                    <Link href={`/recipes/${recipe.id}`}>
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 object-cover "
                      />
                    </Link>
                    <Link href={`/recipes/${recipe.id}`}>
                      <CardTitle className="text-lg font-bold text-red-600 px-6 mt-2 flex-grow">
                        {recipe.title}
                      </CardTitle>
                    </Link>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <button
                      onClick={() => handleBookmark(recipe)}
                      className="border-none "
                    >
                      <Bookmark
                        className="h-6 w-6 text-red-600 hover:fill-white"
                        style={{
                          fill: `${
                            user?.user.bookmarks.some(
                              (bookmark: any) => bookmark.id === recipe.id
                            )
                              ? "currentColor"
                              : "none"
                          }`,
                        }}
                      />
                    </button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 w-full ">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <ArrowLeft className="mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={recipes.length < 10}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <ArrowRight className="mr-2" />
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
