import React from 'react';
import { BlogPost } from '../types';
import { Clock, Heart, Share2, BadgeCheck } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="group relative flex flex-col bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-900/10">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-slate-900/80 backdrop-blur-sm text-white rounded-lg border border-slate-700">
          {post.category}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
            <BadgeCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400 uppercase tracking-wide">Expert Verified</span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between text-slate-500 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300">{post.author}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Overlay or Bottom) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
         <button className="p-2 bg-slate-900/60 backdrop-blur-md rounded-full text-slate-300 hover:bg-cyan-500 hover:text-white transition-all">
            <Heart className={`w-4 h-4 ${post.isSaved ? 'fill-current text-red-500' : ''}`} />
         </button>
      </div>
    </div>
  );
};
