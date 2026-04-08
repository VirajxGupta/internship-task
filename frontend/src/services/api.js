const envUrl = import.meta.env.VITE_API_URL || '';
const API_URL = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;

/**
 * Fetch and save posts from JSONPlaceholder to MongoDB
 */
export async function fetchAndSavePosts() {
  const res = await fetch(`${API_URL}/api/posts/fetch`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to fetch and save posts');
  return res.json();
}

/**
 * Get all posts from the database
 */
export async function getAllPosts(page = 1, limit = 100, sort = 'recent') {
  const res = await fetch(`${API_URL}/api/posts?page=${page}&limit=${limit}&sort=${sort}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

/**
 * Get a single post by ID
 */
export async function getPostById(id) {
  const res = await fetch(`${API_URL}/api/posts/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch post ${id}`);
  return res.json();
}

/**
 * Delete a post by ID
 */
export async function deletePost(id) {
  const res = await fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete post ${id}`);
  return res.json();
}

/**
 * Create a new post
 */
export async function createPost(postData) {
  const res = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}
