import { useState, useEffect, useCallback } from 'react';
import { getAllPosts, fetchAndSavePosts } from '../services/api';

/**
 * Custom hook for managing posts data.
 * Fetches posts on mount and provides refresh/seed functionality.
 */
export function usePosts(sort = 'recent') {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const loadPosts = useCallback(async (currentSort = sort) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllPosts(1, 100, currentSort);
      setPosts(response.data || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  const seedPosts = useCallback(async () => {
    try {
      setSeeding(true);
      setError(null);
      await fetchAndSavePosts();
      await loadPosts(sort);
    } catch (err) {
      console.error('Failed to seed posts:', err);
      setError(err.message);
    } finally {
      setSeeding(false);
    }
  }, [loadPosts, sort]);

  useEffect(() => {
    loadPosts(sort);
  }, [loadPosts, sort]);

  return { posts, loading, error, seeding, loadPosts, seedPosts, setPosts };
}
