"use client";
import { useState } from "react";
import { useIsMounted } from "./(hooks)/useIsMounted";
import { AddTweetSection } from "./(components)/AddTweetSection";
import { Feed } from "./(components)/Feed";
import SimpleBar from "simplebar-react";
import { useAuth } from "./(contexts)/AuthContext";


export default function Home() {
  const isMounted = useIsMounted();
  const { isAuthenticated } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh the feed when a new post is created
  const handlePostCreated = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (!isMounted) return null;
  
  return (
    <SimpleBar className="w-[calc(100vw-156px)]">
      <div className="p-4">
        {isAuthenticated && (
          <div className="mb-6 border border-[#2f3336] rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Create a new post</h2>
            <AddTweetSection onPostCreated={handlePostCreated} />
          </div>
        )}
        
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Latest Posts</h2>
          {/* Pass the refreshKey to trigger re-fetching when a new post is created */}
          <Feed key={refreshKey} />
        </div>
      </div>
    </SimpleBar>
  );
}
