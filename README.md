# Academic Personal Website

A modern academic personal website built with Next.js, featuring a professional homepage with research information and a blog section with PDF viewing capabilities for research papers and articles.

## Features

- Modern, responsive design using Tailwind CSS
- Academic homepage with sections for:
  - Research interests and publications
  - Recent news and updates
  - Teaching information
  - Professional experience
- Research blog with PDF viewing functionality
- PDF.js integration for smooth PDF rendering
- Mobile-friendly navigation

## Prerequisites

- Node.js 18.0.0 or later
- npm 9.0.0 or later

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mypage
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customizing the Website

### Homepage

Edit the content in `app/page.tsx` to update your:
- Personal information and academic position
- Research interests and areas
- Publications list
- Recent news and updates
- Teaching information

### Blog/Publications

1. Place your PDF research papers and articles in the `public/blog` directory
2. Update the `blogPosts` array in:
   - `app/blog/page.tsx` - For the blog listing page
   - `app/blog/[id]/page.tsx` - For the individual blog post page

## Adding Sample PDFs

For testing purposes, you can add sample PDFs to the `public/blog` directory. In a production environment, you would replace these with your actual research papers and articles.

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF viewer
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

This project is licensed under the MIT License - see the LICENSE file for details.
