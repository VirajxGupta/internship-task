import PostCard from './PostCard';

export default function PostList({ posts, loading, searchQuery }) {
  if (loading) {
    return (
      <div className="post-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div className="skeleton-line tag" />
              <div className="skeleton-line tag" />
            </div>
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          {searchQuery ? '🔍' : '📭'}
        </div>
        <h3>
          {searchQuery
            ? `No posts found for "${searchQuery}"`
            : 'No posts yet'}
        </h3>
        <p>
          {searchQuery
            ? 'Try a different search term'
            : 'Click "Fetch Posts" to load data from JSONPlaceholder'}
        </p>
      </div>
    );
  }

  return (
    <div className="post-grid">
      {posts.map((post, index) => (
        <PostCard key={post.id || post._id} post={post} index={index} />
      ))}
    </div>
  );
}
