import { projectsData } from '../data';

export default function JournalProjects() {
  return (
    <section className="py-16 md:py-24">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-bold">Featured Projects</h2>
        <div className="h-[1px] bg-slate-700 flex-1"></div>
      </div>

      <div className="space-y-16">
        {projectsData.map((project, idx) => (
          <div 
            key={project.id}
            className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center group`}
          >
            {/* Project Image */}
            <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden bg-bg-card border border-slate-700 shadow-xl group-hover:border-accent-cyan/50 transition-colors">
              <div className="aspect-video relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
                {/* Overlay transparan */}
                <div className="absolute inset-0 bg-bg-dark/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
            </div>

            {/* Project Info */}
            <div className={`w-full md:w-1/2 flex flex-col ${idx % 2 === 0 ? 'md:items-start text-left' : 'md:items-end md:text-right'}`}>
              <p className="font-mono text-accent-violet text-sm mb-2">Featured Project</p>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-accent-cyan transition-colors">{project.title}</h3>
              
              <div className="bg-bg-card p-6 rounded-lg border border-slate-700 shadow-lg mb-4 w-full relative z-10">
                <p className="text-text-secondary leading-relaxed">
                  {project.desc}
                </p>
              </div>

              <ul className="flex flex-wrap gap-3 font-mono text-sm text-text-secondary mt-2">
                {project.stack.map(tech => (
                  <li key={tech} className="bg-bg-dark px-3 py-1 rounded border border-slate-700">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}