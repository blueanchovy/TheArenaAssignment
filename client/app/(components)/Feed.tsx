import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TweetPreview } from "./TweetPreview";
import { Post, fetchPosts } from "../(utils)/api";

interface FeedProps {
  userPosts?: Post[];
}

export const Feed = ({ userPosts }: FeedProps) => {
  const { address } = useAccount();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts if userPosts is not provided
  useEffect(() => {
    if (!userPosts) {
      setLoading(true);
      fetchPosts()
        .then(fetchedPosts => {
          setPosts(fetchedPosts);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching posts:', err);
          setError('Failed to load posts');
          setLoading(false);
        });
    }
  }, [userPosts]);

  // Use userPosts if provided, otherwise use fetched posts
  const displayPosts = userPosts || posts;

  if (loading) {
    return <div className="p-4 text-center">Loading posts...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (displayPosts.length === 0) {
    return <div className="p-4 text-center">No posts found</div>;
  }

  return (
    <div className="space-y-4">
      {displayPosts.map((post) => (
        <div key={post.id}>
          <TweetPreview post={post} />
        </div>  
      ))}
    </div>
  );
};
