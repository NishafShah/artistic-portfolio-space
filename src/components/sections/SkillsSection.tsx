
import { useEffect, useState } from 'react';

interface Skill {
  name: string;
  level: number;
}

const SkillsSection = () => {
  const skills: Skill[] = [
    { name: 'Frontend Development', level: 90 },
    { name: 'UI/UX Design', level: 85 },
    { name: 'Backend Development', level: 80 },
    { name: 'Mobile Development', level: 75 },
  ];

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
        <div className="bg-white shadow-lg rounded-2xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-8">
            {skills.map((skill, index) => (
              <div key={skill.name} className="reveal" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-800 font-medium">{skill.name}</span>
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
      </div>
    </section>
  );
};

export default SkillsSection;
