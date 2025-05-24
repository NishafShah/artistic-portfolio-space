
import { useEffect, useState } from 'react';

interface Skill {
  id?: string;
  name: string;
  level: number;
  category: 'Language' | 'Framework';
  icon?: string;
}

const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const storedSkills = JSON.parse(localStorage.getItem('portfolio_skills') || '[]');
    
    if (storedSkills.length === 0) {
      const defaultSkills = [
        { id: '1', name: 'JavaScript', level: 90, category: 'Language', icon: '🟨' },
        { id: '2', name: 'React', level: 85, category: 'Framework', icon: '⚛️' },
        { id: '3', name: 'TypeScript', level: 80, category: 'Language', icon: '🔷' },
        { id: '4', name: 'Node.js', level: 75, category: 'Framework', icon: '💚' },
      ];
      setSkills(defaultSkills);
    } else {
      setSkills(storedSkills);
    }
  }, []);

  const languageSkills = skills.filter(skill => skill.category === 'Language');
  const frameworkSkills = skills.filter(skill => skill.category === 'Framework');

  return (
    <section id="skills" className="py-24 px-4 bg-white reveal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase">Expertise</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">My Skills</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            I specialize in a range of technologies and constantly expand my skillset.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-lg rounded-2xl p-8 transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              💻 Programming Languages
            </h3>
            <div className="space-y-6">
              {languageSkills.map((skill, index) => (
                <div key={skill.name + index} className="reveal" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex justify-between mb-2 items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{skill.icon}</span>
                      <span className="text-gray-800 font-medium">{skill.name}</span>
                    </div>
                    <span className="text-purple-600 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              🚀 Frameworks & Tools
            </h3>
            <div className="space-y-6">
              {frameworkSkills.map((skill, index) => (
                <div key={skill.name + index} className="reveal" style={{ animationDelay: `${(index + languageSkills.length) * 200}ms` }}>
                  <div className="flex justify-between mb-2 items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{skill.icon}</span>
                      <span className="text-gray-800 font-medium">{skill.name}</span>
                    </div>
                    <span className="text-green-600 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
