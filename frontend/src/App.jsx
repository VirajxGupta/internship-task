import { useState, useEffect } from 'react';
import { usePosts } from './hooks/usePosts';
import { useWebSocket } from './hooks/useWebSocket';
import { deletePost } from './services/api';
import PostCard from './components/PostCard';
import SearchBar from './components/SearchBar';
import PostDetail from './components/PostDetail';
import CreatePostModal from './components/CreatePostModal';

function App() {
  const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'trending'
  const { posts, loading, error, seedPosts, loadPosts } = usePosts(sortBy);
  
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { status, results, lastQuery, sendSearch } = useWebSocket();
  const isConnected = status === 'connected';

  // Listen to search changes from SearchBar Component
  useEffect(() => {
    const handleSearch = (e) => {
      setSearchQuery(e.detail);
    };
    window.addEventListener('searchQueryChange', handleSearch);
    return () => window.removeEventListener('searchQueryChange', handleSearch);
  }, []);

  // Send search over websocket debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        sendSearch(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, sendSearch]);

  const isSearching = searchQuery.trim() !== '';
  let displayPosts = isSearching ? (results || []) : posts;

  if (selectedPostId) {
    const post = displayPosts.find(p => p.id === selectedPostId) || posts.find(p => p.id === selectedPostId);
    return (
      <div className="bg-surface-container-lowest min-h-screen text-on-surface flex flex-col">
        <PostDetail 
          post={post} 
          onBack={() => setSelectedPostId(null)}
          onDelete={async (id) => {
            if (window.confirm('Are you sure you want to terminate this stream node?')) {
              try {
                await deletePost(id);
                loadPosts(sortBy);
                setSelectedPostId(null);
              } catch (err) {
                alert('Failed to terminate node: ' + err.message);
              }
            }
          }}
        />
        {/* Footer */}
        <footer className="bg-[#0E0E0E] w-full py-12 border-t border-[#4C4354]/20 flex flex-col md:flex-row justify-between items-center px-12 gap-6 mt-auto">
          <div className="text-lg font-bold text-[#8A2BE2] font-headline tracking-tighter">PostStream</div>
          <div className="text-[#CFC2D7]/60 font-['Inter'] text-xs uppercase tracking-widest">
              © 2026 PostStream Celestial Systems
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest min-h-screen text-on-surface transition-colors flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-[#131313]/80 backdrop-blur-xl docked full-width top-0 z-50 bg-gradient-to-b from-[#1C1B1B] to-transparent shadow-[0_8px_32px_rgba(138,43,226,0.08)] sticky">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto">
          <div className="text-2xl font-black tracking-tighter text-[#DCB8FF] font-['Manrope']">PostStream</div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-[#00FBFB] border-b-2 border-[#00FBFB] pb-1 font-['Manrope'] font-bold tracking-tight transition-all cursor-pointer">Dashboard</a>
            <a className="text-[#CFC2D7] hover:text-[#DCB8FF] transition-colors font-['Manrope'] font-bold tracking-tight cursor-not-allowed">Analytics</a>
            <a className="text-[#CFC2D7] hover:text-[#DCB8FF] transition-colors font-['Manrope'] font-bold tracking-tight cursor-not-allowed">Streams</a>
            <a className="text-[#CFC2D7] hover:text-[#DCB8FF] transition-colors font-['Manrope'] font-bold tracking-tight cursor-not-allowed">Settings</a>
          </nav>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4">
              <button 
                onClick={() => seedPosts()}
                disabled={loading}
                className="hover:bg-[#353534] bg-surface-container text-on-surface border border-outline-variant/30 px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50"
                title="Fetch latest from network"
              >
                {loading ? 'Syncing...' : 'Sync Data'}
              </button>
            </div>
            <button 
              className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-bold active:scale-95 transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              New Post
            </button>
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        {/* Abstract Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-secondary-container/5 rounded-full blur-[100px] -z-10"></div>
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 pt-24 pb-16 text-center">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-secondary mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Explore Posts in Real-Time
          </h1>
          <p className="font-body text-on-surface-variant text-lg max-w-2xl mx-auto mb-12 opacity-80">
            A premium command center for high-velocity data streams. Monitor global narratives with precision and depth powered by MongoDB Atlas.
          </p>
          
          <SearchBar isConnected={isConnected} />
        </section>

        {/* Main Content Grid */}
        <section className="max-w-7xl mx-auto px-8 pb-32">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-primary-fixed-dim font-headline text-2xl font-bold tracking-tight">
                {isSearching ? 'Live Filtered Streams' : 'Active Streams'}
              </h2>
              <p className="text-on-surface-variant text-sm opacity-60">
                Displaying {displayPosts.length} streams
              </p>
            </div>
            <div className="hidden sm:flex gap-2">
              <span 
                onClick={() => setSortBy('recent')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border border-outline-variant/10 ${sortBy === 'recent' ? 'bg-surface-bright text-on-surface border-primary/40' : 'bg-surface-variant/30 text-on-surface-variant hover:bg-surface-variant'}`}
              >
                All Posts
              </span>
              <span 
                onClick={() => setSortBy('trending')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border border-outline-variant/10 ${sortBy === 'trending' ? 'bg-surface-bright text-on-surface border-tertiary/40' : 'bg-surface-variant/30 text-on-surface-variant hover:bg-surface-variant'}`}
              >
                Trending
              </span>
            </div>
          </div>

          {error && <div className="text-error bg-error-container p-4 rounded-lg font-bold w-full text-center mb-8 border border-error/50">Error: {error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={() => setSelectedPostId(post.id)}
              />
            ))}
          </div>

          {!loading && displayPosts.length === 0 && (
             <div className="text-center p-16 col-span-full font-body text-surface-bright opacity-50 text-xl font-bold">
               No streams found.
             </div>
          )}
        </section>
      </main>

      {/* Footer */}
       <footer className="bg-[#0E0E0E] w-full py-12 border-t border-[#4C4354]/20 flex flex-col md:flex-row justify-between items-center px-12 gap-6 mt-auto">
        <div className="text-lg font-bold text-[#8A2BE2] font-headline tracking-tighter">PostStream</div>
        <div className="text-[#CFC2D7]/60 font-['Inter'] text-xs uppercase tracking-widest">
            © 2026 PostStream Celestial Systems
        </div>
      </footer>

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onPostCreated={() => loadPosts(sortBy)} 
      />
    </div>
  );
}

export default App;
