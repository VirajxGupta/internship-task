import { useState } from 'react';
import { createPost } from '../services/api';

function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createPost({ title, body });
      setTitle('');
      setBody('');
      onPostCreated();
      onClose();
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fade_0.2s_ease-out]">
      <div 
        className="glass-card w-full max-w-lg rounded-2xl border border-outline-variant/30 shadow-[0_0_50px_-12px_rgba(138,43,226,0.3)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/20">
          <h2 className="text-2xl font-bold font-headline tracking-tighter text-secondary">Spark a Node</h2>
          <button 
            onClick={onClose}
            className="text-outline-variant hover:text-error transition-colors p-2 -mr-2 rounded-full hover:bg-surface-variant/50"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {error && (
             <div className="text-sm bg-error-container/20 text-error p-3 rounded border border-error/30 font-bold">
               {error}
             </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-outline-variant tracking-wider uppercase text-xs">Title Override</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-surface-container border border-outline-variant/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-on-surface rounded-lg px-4 py-3 outline-none font-headline font-bold transition-all w-full placeholder:text-outline-variant/30"
              placeholder="e.g. Navigating the Cyberspace..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-outline-variant tracking-wider uppercase text-xs">Transmission Data</label>
            <textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="bg-surface-container border border-outline-variant/20 focus:border-tertiary/50 focus:ring-1 focus:ring-tertiary/50 text-on-surface rounded-lg px-4 py-3 outline-none font-body transition-all w-full resize-none placeholder:text-outline-variant/30"
              placeholder="Inject your payload here..."
              disabled={isSubmitting}
            />
          </div>

          <div className="pt-4 flex gap-4 justify-end">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-outline hover:text-on-surface transition-colors disabled:opacity-50"
            >
              Abort
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-full bg-primary-container hover:bg-[#b08dee] text-on-primary-container text-sm font-bold transition-all shadow-[0_0_15px_-3px_rgba(138,43,226,0.5)] active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Transmitting...' : 'Initiate Broadcast'}
              {!isSubmitting && <span className="material-symbols-outlined text-sm">send</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
