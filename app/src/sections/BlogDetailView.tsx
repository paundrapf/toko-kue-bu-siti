import { ArrowLeft, Calendar, Eye, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getRelatedBlogPosts } from '@/data/products';
import type { BlogPost } from '@/types';

interface BlogDetailViewProps {
  post: BlogPost;
  onBack: () => void;
  onPostClick: (post: BlogPost) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function BlogDetailView({ post, onBack, onPostClick }: BlogDetailViewProps) {
  const relatedPosts = getRelatedBlogPosts(post.id, 3);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link disalin ke clipboard');
        break;
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Hero Image */}
      <div className="relative h-80 md:h-96">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Blog
            </button>
            <Badge className="mb-4 bg-[#FF6B9D]">{post.categoryName}</Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#FF6B9D] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{post.author.charAt(0)}</span>
                </div>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt || post.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.views} views
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Share Buttons */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-gray-500">Bagikan:</span>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Article Content */}
              <article 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-8">
                <h4 className="font-semibold mb-3">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-[#FF6B9D] hover:text-white transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Box */}
              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#FF6B9D] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl font-bold">{post.author.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{post.author}</h4>
                    <p className="text-gray-600 mt-1">
                      Penulis di Toko Kue Bu Siti. Berbagi tips, resep, dan cerita seputar dunia baking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-bold text-lg mb-4">Artikel Terkait</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <div
                        key={relatedPost.id}
                        onClick={() => onPostClick(relatedPost)}
                        className="flex gap-4 cursor-pointer group"
                      >
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-[#FF6B9D] transition-colors">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-[#FF6B9D] rounded-xl p-6 mt-6 text-white">
                <h3 className="font-bold text-lg mb-2">Newsletter</h3>
                <p className="text-white/80 text-sm mb-4">
                  Dapatkan tips dan promo terbaru langsung di inbox Anda
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
                  />
                  <Button className="w-full bg-white text-[#FF6B9D] hover:bg-gray-100">
                    Berlangganan
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
