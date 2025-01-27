"use client";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import RecipePage from "@/components/recipe-page";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Loading from "@/app/utils/Loading";
import getToken from "@/app/utils/getToken";

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

  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(Number(id)),
    enabled: !!id,
  });
  const router = useRouter();
  useEffect(() => {
    const token = getToken();
    console.log(token);
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
  if (isError) return <div>Error fetching recipe</div>;

  return (
    <>
    <RecipePage recipe={recipe}/>
    </>

  );
} 