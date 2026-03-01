import { useState } from 'react';
import { Search, Calendar, Eye, ArrowRight, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { blogPosts, blogCategories } from '@/data/products';
import type { BlogPost } from '@/types';

interface BlogViewProps {
  onPostClick: (post: BlogPost) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function BlogView({ onPostClick }: BlogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="bg-[#FFF8E7] py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
            Blog & Artikel
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-center">
            Temukan tips, resep, dan cerita menarik seputar dunia baking dan kue
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Post */}
        {!selectedCategory && !searchQuery && (
          <div className="mb-16">
            <div 
              onClick={() => onPostClick(featuredPost)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 cursor-pointer group"
            >
              <div className="relative h-80 lg:h-auto rounded-2xl overflow-hidden">
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#FF6B9D] text-white">Unggulan</Badge>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Badge variant="outline" className="w-fit mb-4">
                  {featuredPost.categoryName}
                </Badge>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#FF6B9D] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {featuredPost.views} views
                  </div>
                </div>
                <span className="text-[#FF6B9D] font-medium inline-flex items-center gap-2">
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-lg mb-4">Kategori</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-[#FF6B9D] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Semua Kategori
                </button>
                {blogCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${
                      selectedCategory === cat.id ? 'bg-[#FF6B9D] text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`float-right text-sm ${
                      selectedCategory === cat.id ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      {cat.postCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
              <h3 className="font-bold text-lg mb-4">Tag Populer</h3>
              <div className="flex flex-wrap gap-2">
                {['brownies', 'resep', 'tips', 'cake', 'kue kering', 'promo'].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-[#FF6B9D] hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Posts Grid */}
          <div className="flex-1">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Artikel tidak ditemukan</h3>
                <p className="text-gray-600">Coba ubah kata kunci pencarian Anda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => onPostClick(post)}
                    className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-gray-900">{post.categoryName}</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </div>
                      </div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FF6B9D] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FF6B9D] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{post.author.charAt(0)}</span>
                        </div>
                        <span className="text-sm text-gray-600">{post.author}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
