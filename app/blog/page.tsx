'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// This would typically come from your database or CMS
const blogPosts = [
  {
    id: 1,
    title: 'Efficient Variational Sequential Information Control',
    description: 'Our recent work on developing efficient variational methods for sequential information control problems in partially observable Markov decision processes.',
    date: '2024-04-15',
    category: 'Research',
    tags: ['POMDP', 'Variational Methods', 'Sequential Control'],
    pdfUrl: '/blog/efficient-variational-sequential-information-control.pdf'
  },
  {
    id: 2,
    title: 'Privacy-preserving training of tree ensembles over continuous data',
    description: 'Overview of our work on secure multi-party computation techniques for training decision trees and random forests while preserving privacy.',
    date: '2022-02-10',
    category: 'Research',
    tags: ['Privacy-Preserving ML', 'Random Forests', 'Secure Computation'],
    pdfUrl: '/blog/privacy-preserving-tree-ensembles.pdf'
  },
  {
    id: 3,
    title: 'High performance logistic regression for privacy-preserving genome analysis',
    description: 'Our highly-cited work on implementing secure logistic regression for analyzing genomic data while maintaining privacy.',
    date: '2021-01-20',
    category: 'Research',
    tags: ['Genomics', 'Privacy-Preserving ML', 'Logistic Regression'],
    pdfUrl: '/blog/high-performance-logistic-regression.pdf'
  },
  {
    id: 4,
    title: 'An interactive map-based system for visually exploring and cleaning GPS traces',
    description: 'Summary of our ACM SIGSPATIAL paper on developing interactive systems for GPS trace analysis and cleaning.',
    date: '2019-11-15',
    category: 'Research',
    tags: ['GPS', 'Map Matching', 'Geospatial Data'],
    pdfUrl: '/blog/interactive-map-gps-traces.pdf'
  },
  {
    id: 5,
    title: 'Which one is correct, the map or the GPS trace',
    description: 'Discussion on methods for resolving discrepancies between GPS traces and map data in geospatial applications.',
    date: '2019-11-05',
    category: 'Research',
    tags: ['GPS', 'Map Matching', 'Data Cleaning'],
    pdfUrl: '/blog/map-vs-gps-trace.pdf'
  }
];

// Get all unique categories
const allCategories = Array.from(
  new Set(
    blogPosts.map(post => post.category)
  )
).sort();

// Extract all unique tags with their frequency
const tagFrequency = blogPosts.flatMap(post => post.tags)
  .reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

// Sort tags by frequency (descending)
const allTags = Object.keys(tagFrequency).sort((a, b) => tagFrequency[b] - tagFrequency[a]);

export default function BlogPage() {
  const [activeFilters, setActiveFilters] = useState<{
    category: string | null;
    tags: string[];
  }>({
    category: null,
    tags: []
  });
  
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Apply filters whenever activeFilters changes
  useEffect(() => {
    let result = blogPosts;
    
    // Filter by category
    if (activeFilters.category) {
      result = result.filter(post => post.category === activeFilters.category);
    }
    
    // Filter by tags (posts must include ALL selected tags)
    if (activeFilters.tags.length > 0) {
      result = result.filter(post => 
        activeFilters.tags.every(tag => post.tags.includes(tag))
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.description.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredPosts(result);
  }, [activeFilters, searchQuery]);
  
  // Group posts by year
  const postsByYear = filteredPosts.reduce((acc, post) => {
    const year = post.date.split('-')[0];
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, typeof blogPosts>);

  // Sort years in descending order
  const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));
  
  // Toggle a tag in the active filters
  const toggleTag = (tag: string) => {
    setActiveFilters(prev => {
      const isActive = prev.tags.includes(tag);
      return {
        ...prev,
        tags: isActive 
          ? prev.tags.filter(t => t !== tag) 
          : [...prev.tags, tag]
      };
    });
  };
  
  // Set the active category
  const setCategory = (category: string | null) => {
    setActiveFilters(prev => ({
      ...prev,
      category
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      category: null,
      tags: []
    });
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Research Blog & Articles</h1>
      
      {/* Search bar */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Filter section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Categories:</span>
          <button 
            className={`px-3 py-1 text-sm rounded-full transition-colors ${!activeFilters.category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setCategory(null)}
          >
            All
          </button>
          {allCategories.map(category => (
            <button 
              key={category}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${activeFilters.category === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Tags:</span>
          {allTags.map(tag => (
            <button 
              key={tag}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${activeFilters.tags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
              onClick={() => toggleTag(tag)}
            >
              {tag} <span className="text-xs opacity-70">({tagFrequency[tag]})</span>
            </button>
          ))}
        </div>
        
        {/* Active filters display */}
        {(activeFilters.category || activeFilters.tags.length > 0 || searchQuery) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {activeFilters.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {activeFilters.category}
                    <button 
                      onClick={() => setCategory(null)}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {activeFilters.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag}
                    <button 
                      onClick={() => toggleTag(tag)}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {searchQuery && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: “{searchQuery}”
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Results count */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredPosts.length} of {blogPosts.length} articles
      </div>
      
      {/* Blog posts */}
      {sortedYears.length > 0 ? (
        sortedYears.map(year => (
          <div key={year} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{year}</h2>
            <div className="space-y-4">
              {postsByYear[year].map((post) => (
                <Link 
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block p-6 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <article>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4">{post.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.tags.map(tag => (
                            <span 
                              key={tag} 
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                activeFilters.tags.includes(tag) 
                                  ? 'bg-blue-600 text-white' 
                                  : 'text-blue-600 bg-blue-50'
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <time className="text-sm text-gray-500">{post.date}</time>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No articles found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
          <div className="mt-6">
            <button 
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 