import { useState } from 'react';

const trendingTopics = [
  "Design Thinking",
  "Artificial Intelligence",
  "Productivity",
  "Mental Health",
  "Venture Capital",
  "Web3",
  "Remote Work",
];

const topVoices = [
  {
    name: "Marcus Sterling",
    role: "Tech & Startups",
    avatar: "https://i.pravatar.cc/40?img=51",
  },
  {
    name: "Aisha Rahman",
    role: "Design & Art",
    avatar: "https://i.pravatar.cc/40?img=47",
  },
  {
    name: "Dr. Thomas Weil",
    role: "Philosophy & Life",
    avatar: "https://i.pravatar.cc/40?img=60",
  },
];

const TrendingAndVoices = () => {
     const [active, setActive] = useState("Design Thinking");

     return (
       <section className="bg-indigo-50/50">
         <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div>
             <h3 className="text-lg font-bold text-slate-900 mb-4">Trending Topics</h3>
             <div className="flex flex-wrap gap-2">
               {trendingTopics.map((topic) => (
                 <button
                   key={topic}
                   onClick={() => setActive(topic)}
                   className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                     active === topic
                       ? "bg-indigo-600 border-indigo-600 text-white"
                       : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                   }`}
                 >
                   {topic}
                 </button>
               ))}
             </div>
           </div>
   
           <div>
             <h3 className="text-lg font-bold text-slate-900 mb-4">Top Voices</h3>
             <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
               {topVoices.map((voice) => (
                 <div
                   key={voice.name}
                   className="flex items-center justify-between px-5 py-4"
                 >
                   <div className="flex items-center gap-3">
                     <img
                       src={voice.avatar}
                       alt={voice.name}
                       className="w-9 h-9 rounded-full object-cover"
                     />
                     <div>
                       <p className="text-sm font-semibold text-slate-900">
                         {voice.name}
                       </p>
                       <p className="text-xs text-slate-400">{voice.role}</p>
                     </div>
                   </div>
                   <button className="text-xs font-medium text-indigo-600 border border-indigo-100 hover:bg-indigo-50 transition-colors px-3.5 py-1.5 rounded-full">
                     Follow
                   </button>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </section>
     );
};

export default TrendingAndVoices;