// creating, fetching, and deleting posts

const BASE_URL = ''; // Replace with actual backend IP or domain

// Types
export interface Post {
  id: string;
  authorId: string; //replace
  content: string; //replace
  authorName: string; //replace
  createdAt: string; //replace
  updatedAt: string; //replace
}

// Get all posts
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return await res.json();
  } catch (error) {
    console.error('getAllPosts error:', error);
    throw error;
  }
};

// Get a single post by ID
export const getPostById = async (postId: string): Promise<Post> => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/${postId}`);
    if (!res.ok) throw new Error('Failed to fetch post');
    return await res.json();
  } catch (error) {
    console.error('getPostById error:', error);
    throw error;
  }
};

// Create a new post
export const createPost = async (
  authorId: string,
  content: string
): Promise<Post> => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authorId, content }),
    });

    if (!res.ok) throw new Error('Failed to create post');
    return await res.json();
  } catch (error) {
    console.error('createPost error:', error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId: string): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete post');
    return await res.json();
  } catch (error) {
    console.error('deletePost error:', error);
    throw error;
  }
};
