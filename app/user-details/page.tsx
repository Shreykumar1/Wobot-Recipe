"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store"; // Adjust the import path as necessary
import { setUser } from "../store/userslice";
import Notification from "../utils/notification";
import Loading from "../utils/Loading";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import getToken from "../utils/getToken";

export default function page() {
  const [notification, setNotification] = useState<React.ReactNode | undefined>(undefined);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

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
    fetchUser();
  }, []);

  async function fetchUser() {
    if (user) {
      try {
        const response = await fetch(`/api/user/${user.user.email}`);
        const data = await response.json();
        const newUser = { ...user, user: data.user };
        dispatch(setUser(newUser));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
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
        console.error("Error during removing bookmark:", error);
        setNotification(
          <Notification status="error" message="Error during removing bookmark." />
        );
      }
    }
  };

  const handleLogout = () => {
    // Remove token from cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //  redirect to the login page or refresh the page
    window.location.href = "/login"; 
  };

  if (loading) return <Loading />;
  if (!user) return <div>No user data available</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold">User Details</h1>
            <p>Email: {user.user.email}</p>
            </div>
            <div>
                <button 
                onClick={handleLogout} 
                className="ml-4 bg-red-500 text-white p-2 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
      <h2 className="mt-4 text-xl">Bookmarked Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.user.bookmarks.map((bookmark: any) => (
          <div key={bookmark.id} className="border p-4 rounded">
            <h3 className="font-bold">{bookmark.title}</h3>
            <img src={bookmark.image} alt={bookmark.title} className="w-full h-48 object-cover" />
            <Button variant="outline" onClick={() => handleBookmark(bookmark)} className="flex items-center gap-2 mt-2 text-red-500 hover:bg-red-500 hover:text-white">
                Remove Bookmark <Trash2Icon className="w-6 h-6 " />
            </Button>
          </div>
        ))}
      </div>
      {notification}
    </div>
  );
} 