'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  pdfUrl: string;
  authors: string[];
  citation: string;
  abstract: string;
}

interface BlogPostClientProps {
  post: BlogPost | undefined;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/myPage';
  
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-600">Blog post not found</h1>
        <p className="mt-4">
          <Link href={`${basePath}/blog`} className="text-blue-600 hover:underline">
            Return to blog list
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="mb-8">
        <Link href={`${basePath}/blog`} className="text-blue-600 hover:underline">
          ← Back to all articles
        </Link>
      </div>
      
      <article className="bg-white rounded-lg border border-gray-100 p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
              {post.category}
            </span>
            {post.tags.map(tag => (
              <span key={tag} className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{post.description}</p>
          
          <div className="text-gray-700">
            <p className="mb-2">
              <span className="font-medium">Authors:</span> {post.authors.join(', ')}
            </p>
            <p className="mb-2">
              <span className="font-medium">Published:</span> {post.date}
            </p>
          </div>
        </header>

        {/* Abstract */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Abstract</h2>
          <p className="text-gray-700">{post.abstract}</p>
        </section>

        {/* Citation */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Citation</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 font-mono text-sm">{post.citation}</p>
          </div>
        </section>

        {/* PDF Preview */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Paper Preview</h2>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-center">
              <Document
                file={`${basePath}${post.pdfUrl}`}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={1.5}
                />
              </Document>
            </div>
            {numPages && (
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  disabled={pageNumber <= 1}
                  onClick={previousPage}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
                >
                  Previous
                </button>
                <p className="text-gray-600">
                  Page {pageNumber} of {numPages}
                </p>
                <button
                  type="button"
                  disabled={pageNumber >= numPages}
                  onClick={nextPage}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Download Section */}
        <section className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Full Paper</h2>
              <p className="text-gray-600">Download the complete paper in PDF format</p>
            </div>
            <a 
              href={`${basePath}${post.pdfUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </a>
          </div>
        </section>
      </article>
    </div>
  );
} 