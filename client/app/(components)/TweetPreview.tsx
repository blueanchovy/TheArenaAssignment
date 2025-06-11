import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Post, likePost, unlikePost, fetchPostLikes, Comment, createComment } from '../(utils)/api';
import { useAuth } from '../(contexts)/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface TweetPreviewProps {
  post: Post;
}

export const TweetPreview = ({ post }: TweetPreviewProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  // Check if the current user has liked this post
  useEffect(() => {
    if (user?.walletAddress && post.id) {
      fetchPostLikes(post.id).then(likes => {
        setLikeCount(likes.length);
        const userLiked = likes.some(like => like.walletAddress === user.walletAddress);
        setLiked(userLiked);
      });
    }
  }, [post.id, user?.walletAddress]);

  // Set initial comment count
  useEffect(() => {
    if (post.comments) {
      setCommentCount(post.comments.length);
      setComments(post.comments);
    }
  }, [post.comments]);

  const handleLike = async () => {
    if (!user?.walletAddress) return;
    
    try {
      if (liked) {
        const success = await unlikePost(post.id, user.walletAddress);
        if (success) {
          setLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
        }
      } else {
        const success = await likePost(post.id, user.walletAddress);
        if (success) {
          setLiked(true);
          setLikeCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.walletAddress || !commentText.trim()) return;
    
    setLoading(true);
    try {
      const newComment = await createComment({
        postId: post.id,
        walletAddress: user.walletAddress,
        content: commentText.trim()
      });
      
      if (newComment) {
        setComments(prev => [...prev, newComment]);
        setCommentCount(prev => prev + 1);
        setCommentText('');
        setShowCommentForm(false);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleCommentForm = () => setShowCommentForm(prev => !prev);

  // Format the timestamp
  const formattedTime = post.timestamp ? formatDistanceToNow(new Date(post.timestamp), { addSuffix: true }) : '';

  return (
    <div className="flex flex-col border-b border-[#2f3336] p-4 w-full">
      <div className="flex flex-col space-y-2">
        {/* Author and timestamp */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <Link href={`/profile/${post.walletAddress}`} className="hover:underline">
            <span>{post.author?.username || post.walletAddress.substring(0, 8) + '...'}</span>
          </Link>
          <span>{formattedTime}</span>
        </div>
        
        {/* Post content */}
        <div className="flex-1">
          <Link href={`/post/${post.id}`}>
            <div className="text-base">{post.content}</div>
          </Link>
        </div>
        
        {/* Like and comment counts */}
        <div className="flex text-xs text-gray-500 space-x-4">
          <span>{likeCount} likes</span>
          <span>{commentCount} comments</span>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center space-x-4 pt-2 border-t border-gray-100">
          <button
            className={`flex items-center space-x-1 ${liked ? 'text-blue-500' : 'hover:text-blue-500'}`}
            onClick={handleLike}
            disabled={!user}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{liked ? 'Unlike' : 'Like'}</span>
          </button>
          
          <button
            className="flex items-center space-x-1 hover:text-blue-500"
            onClick={toggleCommentForm}
            disabled={!user}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comment</span>
          </button>
        </div>
        
        {/* Comment form */}
        {showCommentForm && user && (
          <form onSubmit={handleCommentSubmit} className="mt-2">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              disabled={loading}
            />
            <div className="flex justify-end mt-1">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                disabled={!commentText.trim() || loading}
              >
                {loading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        )}
        
        {/* Recent comments preview - show up to 2 most recent */}
        {comments.length > 0 && (
          <div className="mt-2 space-y-2">
            {comments.slice(0, 2).map(comment => (
              <div key={comment.id} className="bg-gray-50 p-2 rounded-md">
                <div className="flex justify-between text-xs text-gray-500">
                  <Link href={`/profile/${comment.walletAddress}`} className="font-medium hover:underline">
                    {comment.user?.username || comment.walletAddress.substring(0, 8) + '...'}
                  </Link>
                  <span>{comment.timestamp ? formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true }) : ''}</span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            ))}
            {comments.length > 2 && (
              <Link href={`/post/${post.id}`} className="text-sm text-blue-500 hover:underline">
                View all {comments.length} comments
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
