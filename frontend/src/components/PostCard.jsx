function PostCard({ post, onClick }) {
    // Generate a consistent pseudo-random avatar number based on userId
    const avatarNum = (post.userId % 10) + 1;
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  
    return (
      <div 
        onClick={onClick}
        className="glass-card p-6 md:p-8 rounded-lg border border-outline-variant/20 group hover:border-primary/40 transition-all duration-300 flex flex-col justify-between celestial-glow cursor-pointer min-h-[250px]"
      >
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <img 
                className="w-10 h-10 rounded-full object-cover border border-primary/20 bg-surface-container-high" 
                alt={`User ${post.userId}`} 
                src={avatarUrl}
              />
              <div>
                <h4 className="text-secondary font-semibold text-sm leading-tight">User {post.userId}</h4>
                <span className="text-on-surface-variant text-[10px] uppercase tracking-tighter opacity-60">Poster</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-outline-variant tracking-wider">#PS-{post.id}</span>
          </div>
          
          <h3 className="text-primary-fixed block font-headline font-bold text-lg mb-2 capitalize leading-tight">
             {post.title}
          </h3>
          
          <p className="text-on-surface/90 font-body text-sm leading-relaxed mb-8 line-clamp-3">
            {post.body}
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t border-outline-variant/10">
          <div className="flex items-center gap-4 text-outline">
            <button className="flex items-center gap-1.5 hover:text-tertiary transition-colors" title="Likes">
              <span className="material-symbols-outlined text-lg">thumb_up</span>
              <span className="text-xs font-bold">{post.likes || 0}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-primary transition-colors" title="Views">
              <span className="material-symbols-outlined text-lg">visibility</span>
              <span className="text-xs font-bold">{post.views || 0}</span>
            </button>
          </div>
          <button className="flex items-center gap-1.5 hover:text-secondary-container transition-colors">
             <span className="text-[10px] uppercase font-bold tracking-widest text-[#cfc2d7]/50 group-hover:text-primary transition-colors">View details</span>
          </button>
        </div>
      </div>
    );
  }
  
  export default PostCard;
  
