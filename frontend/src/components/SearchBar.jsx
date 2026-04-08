import { useState } from 'react';

function SearchBar({ isConnected }) {
  const [query, setQuery] = useState('');

  // The actual search filtering is handled via the useWebSocket hook, 
  // which listens to changes matching this input if integrated, 
  // but to match the previous implementation, the hook reads from window or context.
  // Wait, in previous implementation, we had a window event dispatcher or handled it in context.
  // Actually, useWebSocket was reading from a debounced query. 
  // Let's fire a custom event or let the App handle it. 
  // Wait, we need to make sure the hook knows the search string!
  // Let's check how the previous search bar worked.

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    // Dispatch event for WebSocket hook
    window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: e.target.value }));
  };

  const handleClear = () => {
    setQuery('');
    window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: '' }));
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="group relative flex items-center p-[2px] rounded-full bg-gradient-to-r from-primary via-secondary-container/50 to-primary celestial-glow transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,251,251,0.2)]">
        <div className="flex items-center w-full bg-surface-container-lowest rounded-full px-6 py-4">
          <span className="material-symbols-outlined text-outline mr-4">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-on-surface w-full placeholder:text-outline/50 font-body outline-none" 
            placeholder="Search streams, hashtags, or users..." 
            type="text"
            value={query}
            onChange={handleSearchChange}
          />
          
          {query && (
            <button onClick={handleClear} className="mx-2 text-outline-variant hover:text-secondary focus:outline-none">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-variant/30 border border-outline-variant/20 ml-4 whitespace-nowrap">
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#00E475] animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-tertiary">Live search connected</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-error">Disconnected</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
