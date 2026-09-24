import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getInitials = (name = "Lumora writer") =>
  name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const TrendingAndVoices = () => {
     const [active, setActive] = useState("");
     const [topics, setTopics] = useState([]);
     const [voices, setVoices] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const loadCommunityData = async () => {
         if (!API_BASE_URL) {
           setLoading(false);
           return;
         }

         try {
           const [blogsResponse, authorsResponse] = await Promise.all([
             fetch(`${API_BASE_URL}/blog`),
             fetch(`${API_BASE_URL}/user/authors`),
           ]);
           const blogsResult = await blogsResponse.json();
           const authorsResult = await authorsResponse.json();
           const blogs = Array.isArray(blogsResult.data) ? blogsResult.data : [];
           const topicNames = [...new Set(blogs
             .filter((blog) => blog.status === "PUBLISHED")
             .map((blog) => blog.category?.name)
             .filter(Boolean))].slice(0, 7);

           setTopics(topicNames);
           setActive(topicNames[0] || "");
           setVoices(Array.isArray(authorsResult.data) ? authorsResult.data.slice(0, 3) : []);
         } catch (error) {
           console.error("Community data error:", error);
         } finally {
           setLoading(false);
         }
       };

       loadCommunityData();
     }, []);

     const handleFollow = async (authorId) => {
       const token = localStorage.getItem("accessToken");
       if (!token) {
         window.location.href = "/login";
         return;
       }

       try {
         await fetch(`${API_BASE_URL}/user/${authorId}/follow`, {
           method: "POST",
           headers: { Authorization: token },
         });
       } catch (error) {
         console.error("Follow author error:", error);
       }
     };

     return (
       <section className="bg-indigo-50/50">
         <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div>
             <h3 className="text-lg font-bold text-slate-900 mb-4">Trending Topics</h3>
             {loading && <p className="text-sm text-slate-500">Loading topics...</p>}
             {!loading && topics.length === 0 && <p className="text-sm text-slate-500">Topics will appear as stories are published.</p>}
             <div className="flex flex-wrap gap-2">
               {topics.map((topic) => (
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
             {loading && <p className="text-sm text-slate-500">Loading authors...</p>}
             {!loading && voices.length === 0 && <p className="text-sm text-slate-500">No authors available yet.</p>}
             {voices.length > 0 && <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
               {voices.map((voice) => (
                 <div
                   key={voice.id}
                   className="flex items-center justify-between px-5 py-4"
                 >
                   <div className="flex items-center gap-3">
                     {voice.profile?.avatar ? <img src={voice.profile.avatar} alt={voice.name} className="w-9 h-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{getInitials(voice.name)}</span>}
                     <div>
                       <p className="text-sm font-semibold text-slate-900">
                         {voice.name}
                       </p>
                       <p className="text-xs text-slate-400">{voice.profile?.profession || `${voice._count?.blogs ?? 0} published stories`}</p>
                     </div>
                   </div>
                   <button onClick={() => handleFollow(voice.id)} className="text-xs font-medium text-indigo-600 border border-indigo-100 hover:bg-indigo-50 transition-colors px-3.5 py-1.5 rounded-full">
                     Follow
                   </button>
                 </div>
               ))}
             </div>}
           </div>
         </div>
       </section>
     );
};

export default TrendingAndVoices;