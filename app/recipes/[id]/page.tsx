"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import RecipePage from "@/components/recipe-page";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Loading from "@/app/utils/Loading";
import getToken from "@/app/utils/getToken";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Notification from "@/app/utils/notification";

const fetchRecipeById = async (id: number) => {
  const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
    },
  });
  return response.data;
};

export default function page() {
  const params = useParams();
  const { id } = params;
  const [notification, setNotification] = useState<React.ReactNode | undefined>(
    undefined
  );
  const user = useSelector((state: RootState) => state.user.user);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);

  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(Number(id)),
    enabled: !!id,
  });
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

  useEffect(() => {
    if (user && recipe) {
      console.log(user.user);
      const isRecipeBookmarked = user.user.bookmarks.find((bookmark: any) => bookmark.id === recipe.id);
      setIsBookmarked(isRecipeBookmarked);
    }
  }, [user, recipe]);

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
        // fetchUser();
        // setIsButtonClicked(true);
        setIsBookmarked(true);
      } catch (error) {
        console.error("Error during adding bookmark:", error);
        setNotification(
          <Notification status="error" message="Error during adding bookmark." />
        );
      }
    }
  };
  const bookmarkClick = () => {
    // handleBookmark(recipe);
    handleBookmark(recipe);
    setIsBookmarked(!isBookmarked);
    setIsButtonClicked(!isButtonClicked);
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching recipe</div>;

  return (
    <>
    {notification}
    <RecipePage 
      recipeData={recipe} 
      bookmarkClick={bookmarkClick} 
      isBookmarked={isBookmarked} 
    />
    </>

  );
} 