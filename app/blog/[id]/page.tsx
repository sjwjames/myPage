import React from 'react';
import BlogPostClient from './BlogPostClient';

// This would typically come from your database or CMS
const blogPosts = [
  {
    id: '1',
    title: 'Efficient Variational Sequential Information Control',
    description: 'Our recent work on developing efficient variational methods for sequential information control problems in partially observable Markov decision processes.',
    date: '2024-04-15',
    category: 'Research',
    tags: ['POMDP', 'Variational Methods', 'Sequential Control'],
    pdfUrl: 'https://sjwjames.github.io/myPage/blog/efficient-variational-sequential-information-control.pdf',
    authors: ['Jianwei Shen', 'Jason L. Pacheco'],
    citation: 'Shen, J., & Pacheco, J. L. (2024). Efficient Variational Sequential Information Control. International Conference on Artificial Intelligence and Statistics, 3907-3915.',
    abstract: 'We present an efficient variational approach for sequential information control in partially observable Markov decision processes (POMDPs). Our method combines variational inference with information-theoretic objectives to optimize sensing and control policies.'
  },
  {
    id: '2',
    title: 'Privacy-preserving training of tree ensembles over continuous data',
    description: 'Overview of our work on secure multi-party computation techniques for training decision trees and random forests while preserving privacy.',
    date: '2022-02-10',
    category: 'Research',
    tags: ['Privacy-Preserving ML', 'Random Forests', 'Secure Computation'],
    pdfUrl: 'https://sjwjames.github.io/myPage/blog/privacy-preserving-tree-ensembles.pdf',
    authors: ['S Adams', 'C Choudhary', 'Martine De Cock', 'Rafael Dowsley', 'D Melanson', 'Jianwei Shen', 'et al.'],
    citation: 'Adams, S., Choudhary, C., De Cock, M., Dowsley, R., Melanson, D., Shen, J., et al. (2022). Privacy-preserving training of tree ensembles over continuous data. Proceedings on Privacy Enhancing Technologies, 2022(2), 205-226.',
    abstract: 'This paper presents novel protocols for privacy-preserving training of decision trees and random forests over continuous data using secure multi-party computation techniques.'
  },
  {
    id: '3',
    title: 'High performance logistic regression for privacy-preserving genome analysis',
    description: 'Our highly-cited work on implementing secure logistic regression for analyzing genomic data while maintaining privacy.',
    date: '2021-01-20',
    category: 'Research',
    tags: ['Genomics', 'Privacy-Preserving ML', 'Logistic Regression'],
    pdfUrl: 'https://sjwjames.github.io/myPage/blog/high-performance-logistic-regression.pdf',
    authors: ['Martine De Cock', 'Rafael Dowsley', 'Anderson C. A. Nascimento', 'Davis Railsback', 'Jianwei Shen', 'Ariel Todoki'],
    citation: 'De Cock, M., Dowsley, R., Nascimento, A.C.A., Railsback, D., Shen, J., & Todoki, A. (2021). High performance logistic regression for privacy-preserving genome analysis. BMC Medical Genomics, 14, 1-18.',
    abstract: 'We introduce a high-performance implementation of privacy-preserving logistic regression specifically designed for genomic data analysis, ensuring both computational efficiency and data privacy.'
  },
  {
    id: '4',
    title: 'An interactive map-based system for visually exploring and cleaning GPS traces',
    description: 'Summary of our ACM SIGSPATIAL paper on developing interactive systems for GPS trace analysis and cleaning.',
    date: '2019-11-15',
    category: 'Research',
    tags: ['GPS', 'Map Matching', 'Geospatial Data'],
    pdfUrl: 'https://sjwjames.github.io/myPage/blog/interactive-map-gps-traces.pdf',
    authors: ['A Hendawi', 'SS Sabbineni', 'Jianwei Shen', 'Y Song', 'P Cao', 'Z Zhang', 'J Krumm', 'et al.'],
    citation: 'Hendawi, A., Sabbineni, S.S., Shen, J., Song, Y., Cao, P., Zhang, Z., Krumm, J., et al. (2019). An interactive map-based system for visually exploring and cleaning GPS traces. Proceedings of the 27th ACM SIGSPATIAL International Conference on Advances in Geographic Information Systems.',
    abstract: 'This paper presents an interactive system for visualizing and cleaning GPS traces, helping users identify and correct errors in geospatial data through an intuitive map-based interface.'
  },
  {
    id: '5',
    title: 'Which one is correct, the map or the GPS trace',
    description: 'Discussion on methods for resolving discrepancies between GPS traces and map data in geospatial applications.',
    date: '2019-11-05',
    category: 'Research',
    tags: ['GPS', 'Map Matching', 'Data Cleaning'],
    pdfUrl: 'https://sjwjames.github.io/myPage/blog/map-vs-gps-trace.pdf',
    authors: ['A Hendawi', 'SS Sabbineni', 'Jianwei Shen', 'Y Song', 'P Cao', 'Z Zhang', 'J Krumm', 'et al.'],
    citation: 'Hendawi, A., Sabbineni, S.S., Shen, J., Song, Y., Cao, P., Zhang, Z., Krumm, J., et al. (2019). Which one is correct, the map or the GPS trace. Proceedings of the 27th ACM SIGSPATIAL International Conference on Advances in Geographic Information Systems.',
    abstract: 'We investigate methods for determining the accuracy of GPS traces versus map data, providing algorithms and heuristics for resolving discrepancies in location-based applications.'
  }
];

// Required for static site generation with dynamic routes
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }));
}

export default function BlogPost(props: unknown) {
  const params = (props as { params: { id: string } }).params;
  const id = params.id;
  const post = blogPosts.find(p => p.id === id) || undefined;

  return <BlogPostClient post={post} />;
}