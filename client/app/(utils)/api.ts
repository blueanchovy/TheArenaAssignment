// API utility functions to interact with the backend based on the Prisma schema

// Types based on Prisma schema
export interface User {
  walletAddress: string;
  username?: string | null;
  bio?: string | null;
  profilePicUrl?: string | null;
}

export interface Post {
  id: number;
  walletAddress: string;
  content: string;
  timestamp: Date;
  author?: User;
  likes?: Like[];
  comments?: Comment[];
}

export interface Like {
  postId: number;
  walletAddress: string;
  post?: Post;
  user?: User;
}

export interface Comment {
  id: number;
  postId: number;
  walletAddress: string;
  content: string;
  timestamp: Date;
  post?: Post;
  user?: User;
}

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// User API functions
export const fetchUser = async (walletAddress: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${walletAddress}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const updateUser = async (user: Partial<User> & { walletAddress: string }): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${user.walletAddress}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

// Post API functions
export const fetchPosts = async (limit = 20, offset = 0): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?limit=${limit}&offset=${offset}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const fetchUserPosts = async (walletAddress: string): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${walletAddress}/posts`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

export const fetchPost = async (postId: number): Promise<Post | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

export const createPost = async (post: { walletAddress: string; content: string }): Promise<Post | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
};

// Like API functions
export const likePost = async (postId: number, walletAddress: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error liking post:', error);
    return false;
  }
};

export const unlikePost = async (postId: number, walletAddress: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes/${walletAddress}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error unliking post:', error);
    return false;
  }
};

export const fetchPostLikes = async (postId: number): Promise<Like[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching post likes:', error);
    return [];
  }
};

// Comment API functions
export const fetchPostComments = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching post comments:', error);
    return [];
  }
};

export const createComment = async (comment: { postId: number; walletAddress: string; content: string }): Promise<Comment | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${comment.postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
};
