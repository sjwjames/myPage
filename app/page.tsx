import Image from "next/image";
export default function Home() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-50 shadow-md">
            <Image 
              src="/images/headshot.jpg" 
              alt="Profile photo" 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Jianwei Shen</h1>
        <p className="text-xl text-gray-600">Ph.D. Candidate</p>
        <p className="text-lg text-gray-600">Department of Computer Science</p>
        <p className="text-lg text-gray-600">University of Arizona</p>
        <div className="flex justify-center space-x-4 text-gray-600">
          <a href="mailto:sjwjames@arizona.edu" className="hover:text-blue-600">sjwjames@arizona.edu</a>
          <a href="https://scholar.google.com/citations?user=ECUtFxIAAAAJ&hl=en&authuser=1" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">Google Scholar</a>
          <a href="https://github.com/sjwjames" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">GitHub</a>
        </div>
      </header>

      {/* Recent News Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent News</h2>
        <ul className="space-y-4 text-gray-700">
          <li className="flex gap-2">
            <span className="text-gray-500">[Apr 2024]</span>
            <span>Paper “Efficient Variational Sequential Information Control” accepted to AISTATS 2024!</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">[Feb 2022]</span>
            <span>Paper “Privacy-preserving training of tree ensembles over continuous data” published in PoPETS 2022</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">[Jan 2021]</span>
            <span>Paper “High performance logistic regression for privacy-preserving genome analysis” published in BMC Medical Genomics</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">[Nov 2019]</span>
            <span>Two papers accepted to ACM SIGSPATIAL 2019 on GPS trace analysis</span>
          </li>
        </ul>
      </section>

      {/* About Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-gray-700">
          I am a Ph.D. candidate in the Department of Computer Science at University of Arizona, working with Dr. Jason Pacheco.
          My research focuses on machine learning, POMDP, information control problems. 
        </p>
        <p className="text-gray-700 mt-4">
          Prior to attending the University of Arizona, I worked with Dr. Martine De Cock and Dr. Anderson Nascimento, on the topic of Privacy-preserving machine learning, at the University of Washington Tacoma, where 
          I received my M.S. in Computer Science in 2020. In the meantime, I also worked with Dr. Mohamed Ali, on the topic of map-matching.
        </p>
      </section>

      {/* Publications Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Selected Publications</h2>
        <div className="space-y-6">
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">Efficient Variational Sequential Information Control</h3>
            <p className="text-gray-600 italic">International Conference on Artificial Intelligence and Statistics (AISTATS), 2024</p>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Authors:</span> Jianwei Shen, Jason L. Pacheco
            </p>
            <div className="mt-2 flex space-x-4">
              <a href="https://proceedings.mlr.press/v238/shen24a.html" className="text-blue-600 hover:underline">Paper</a>
              <a href="https://github.com/sjwjames/EVSIC" className="text-blue-600 hover:underline">Code</a>
            </div>
          </div>

          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">High performance logistic regression for privacy-preserving genome analysis</h3>
            <p className="text-gray-600 italic">BMC Medical Genomics, 2021</p>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Authors:</span> Martine De Cock, Rafael Dowsley, Anderson C. A. Nascimento, Davis Railsback, Jianwei Shen, Ariel Todoki
            </p>
            <div className="mt-2 flex space-x-4">
              <a href="https://bmcmedgenomics.biomedcentral.com/articles/10.1186/s12920-021-00889-z" className="text-blue-600 hover:underline">Paper</a>
            </div>
          </div>

          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">Privacy-preserving training of tree ensembles over continuous data</h3>
            <p className="text-gray-600 italic">Proceedings on Privacy Enhancing Technologies (PoPETS), 2022</p>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Authors:</span> S Adams, C Choudhary, M De Cock, R Dowsley, D Melanson, Jianwei Shen, et al.
            </p>
            <div className="mt-2 flex space-x-4">
              <a href="https://petsymposium.org/popets/2022/popets-2022-0053.pdf" className="text-blue-600 hover:underline">Paper</a>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <a href="https://scholar.google.com/citations?user=ECUtFxIAAAAJ&hl=en&authuser=1" className="text-blue-600 hover:underline">View all publications →</a>
        </div>
      </section>

      {/* Research Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Research</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Sequential Information Control</h3>
            <p className="text-gray-700 mt-2">
              Developing efficient variational methods for sequential information control problems in partially observable Markov decision processes (POMDPs).
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Privacy-Preserving Machine Learning</h3>
            <p className="text-gray-700 mt-2">
              Creating secure and privacy-preserving methods for training machine learning models, particularly for healthcare and genomic data analysis.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Geospatial Data Analysis</h3>
            <p className="text-gray-700 mt-2">
              Developing techniques for analyzing and cleaning GPS traces, with applications in map-matching and transportation systems.
            </p>
          </div>
        </div>
      </section>

      {/* Teaching Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Working Experience</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Graduate Teaching Assistant</h3>
            <p className="text-gray-600">University of Arizona, 2025 Spring</p>
            <p className="text-gray-700 mt-1">CSC 460: Database Design</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Graduate Teaching Assistant</h3>
            <p className="text-gray-600">University of Arizona, 2025 Spring</p>
            <p className="text-gray-700 mt-1">CSC 380: Introduction to Data Science</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Graduate Research Assistant</h3>
            <p className="text-gray-600">University of Arizona, 2020 - Present</p>
            <p className="text-gray-700 mt-1">Research on sequential information control and variational methods for POMDPs.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Research Assistant</h3>
            <p className="text-gray-600">University of Washington Tacoma, 2019 - 2020</p>
            <p className="text-gray-700 mt-1">Developed privacy-preserving machine learning methods for healthcare and genomic data.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Research Assistant</h3>
            <p className="text-gray-600">University of Washington Tacoma and Microsoft, Summer 2019</p>
            <p className="text-gray-700 mt-1">Worked on geospatial data analysis and map-matching algorithms for GPS traces.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Software Engineer</h3>
            <p className="text-gray-600">X.D. Network Inc., 2016-2018</p>
            <p className="text-gray-700 mt-1">Worked on data visualization and data analysis websites.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
