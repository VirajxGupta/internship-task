function PostDetail({ post, onBack, onDelete }) {
  if (!post) return null;

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <div className="bg-surface-container-lowest min-h-screen">
      {/* Header */}
      <header className="bg-[#131313]/80 backdrop-blur-xl docked full-width top-0 z-50 border-b border-outline-variant/20 sticky px-8 py-4 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-outline hover:text-primary transition-colors focus:outline-none"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-['Manrope'] font-bold">Back to Stream</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-24 relative">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-container/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <article className="animate-[fadeUp_0.4s_ease-out]">
          <div className="flex items-center gap-4 mb-8">
            <span className="px-3 py-1 rounded-full bg-surface-bright text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              Stream Node #{post.id}
            </span>
          </div>

          <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-secondary tracking-tight mb-12 capitalize leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mb-16 pb-8 border-b border-outline-variant/20">
             <img 
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 bg-surface-container-high" 
                alt={`User ${post.userId}`} 
                src={avatarUrl}
              />
              <div>
                <h4 className="text-secondary font-bold text-[15px]">User {post.userId}</h4>
                <p className="text-outline text-xs mt-0.5">Verified Contributor</p>
              </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="font-body text-xl leading-relaxed text-on-surface-variant whitespace-pre-wrap">
              {post.body}
            </p>
          </div>

          <div className="mt-24 pt-8 border-t border-outline-variant/20 flex gap-4">
             <button 
                onClick={() => onDelete(post.id)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-error-container/10 text-error font-bold text-sm tracking-wide hover:bg-error-container/30 transition-all border border-error/20"
             >
                <span className="material-symbols-outlined text-lg">delete</span>
                Terminative Node
             </button>
          </div>
        </article>
      </main>
    </div>
  );
}

export default PostDetail;
