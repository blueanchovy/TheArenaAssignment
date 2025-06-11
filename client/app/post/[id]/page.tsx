"use client";

import { useState, useEffect } from "react";
import { AddTweetSection } from "../../(components)/AddTweetSection";
import { TweetPreview } from "../../(components)/TweetPreview";
import SimpleBar from "simplebar-react";
import { useAuth } from "../../(contexts)/AuthContext";
import { useParams } from "next/navigation";
import { fetchPost, fetchPostComments, Post, Comment } from "../../(utils)/api";

export default function PostPage() {
    const { isAuthenticated } = useAuth();
    const params = useParams();
    const id = params?.id as string;
    
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Fetch post and its comments
    useEffect(() => {
        const loadPostData = async () => {
            if (!id) return;
            
            setLoading(true);
            try {
                // Fetch post details
                const postData = await fetchPost(parseInt(id));
                if (postData) {
                    setPost(postData);
                    
                    // Fetch comments for this post
                    const commentsData = await fetchPostComments(parseInt(id));
                    setComments(commentsData);
                } else {
                    setError("Post not found");
                }
            } catch (err) {
                console.error("Error loading post:", err);
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };
        
        loadPostData();
    }, [id]);
    
    // Refresh comments after a new comment is added
    const refreshComments = async () => {
        if (!id) return;
        try {
            const commentsData = await fetchPostComments(parseInt(id));
            setComments(commentsData);
        } catch (err) {
            console.error("Error refreshing comments:", err);
        }
    };

    if (loading) {
        return (
            <SimpleBar className="w-[calc(100vw-156px)]">
                <div className="p-4 text-center">Loading post...</div>
            </SimpleBar>
        );
    }
    
    if (error || !post) {
        return (
            <SimpleBar className="w-[calc(100vw-156px)]">
                <div className="p-4 text-center text-red-500">{error || "Post not found"}</div>
            </SimpleBar>
        );
    }
    
    // Add comments to the post object for display in TweetPreview
    const postWithComments = { ...post, comments };
    
    return (
        <SimpleBar className="w-[calc(100vw-156px)]">
            <div className="flex flex-col gap-4 p-4">
                <div className="border border-[#2f3336] rounded-lg overflow-hidden">
                    <TweetPreview post={postWithComments} />
                </div>
                
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Add a comment</h2>
                    {isAuthenticated ? (
                        <AddTweetSection onPostCreated={refreshComments} />
                    ) : (
                        <div className="p-4 text-center bg-gray-50 rounded-md">
                            Please sign in to comment on this post
                        </div>
                    )}
                </div>
                
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Comments ({comments.length})</h2>
                    {comments.length > 0 ? (
                        <div className="space-y-4">
                            {comments.map(comment => (
                                <div key={comment.id} className="border border-[#2f3336] p-4 rounded-md">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>{comment.user?.username || comment.walletAddress.substring(0, 8) + '...'}</span>
                                        <span>{comment.timestamp ? new Date(comment.timestamp).toLocaleString() : ''}</span>
                                    </div>
                                    <p className="mt-2">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center bg-gray-50 rounded-md">
                            No comments yet
                        </div>
                    )}
                </div>
            </div>
        </SimpleBar>
    )
}
