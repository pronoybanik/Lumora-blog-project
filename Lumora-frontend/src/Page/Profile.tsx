import React from "react";
import { Link2, Mail, MessageCircle, BadgeCheck, FileText, Eye, Award, LayoutGrid, List, Heart, MessageSquare, Compass } from "lucide-react";

const stats = [
  { label: "Oct 12, 2024", read: "8 min read", title: "Designing for AI: Beyond the Chat Interface", desc: "Discover how structural UI changes and ambient computing paradigms are shaping the next generation of AI-driven...", tag: "DESIGN", likes: "1.2k", comments: 84, img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop", tagColor: "bg-black/50" },
  { label: "Sep 28, 2024", read: "5 min read", title: "The Psychology of Glassmorphism in Modern Tools", desc: "Why transparent materials in digital interfaces evoke feelings of trust, spatial awareness, and premium craftsmanship.", tag: "UX THEORY", likes: "856", comments: 42, img: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?q=80&w=400&auto=format&fit=crop", tagColor: "bg-black/50" },
];

function PublicationCard({ pub, isCaseStudy }) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row gap-4">
      <div className={`relative w-full sm:w-40 h-36 sm:h-28 shrink-0 rounded-lg overflow-hidden ${isCaseStudy ? "bg-indigo-700 flex items-center justify-center" : ""}`}>
        <span className={`absolute top-2 left-2 ${pub.tagColor} text-white text-[10px] font-medium tracking-wide px-2 py-1 rounded z-10`}>
          {pub.tag}
        </span>
        {isCaseStudy ? (
          <Compass className="w-8 h-8 text-white/90" strokeWidth={1.5} />
        ) : (
          <img src={pub.img} className="w-full h-full object-cover opacity-80" alt="" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-400 mb-1">{pub.label} &nbsp;•&nbsp; {pub.read}</p>
        <h4 className="text-slate-900 font-semibold mb-1.5">{pub.title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{pub.desc}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" strokeWidth={2} />
            {pub.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
            {pub.comments}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero / Banner */}
      <div className="relative h-[300px] overflow-hidden" style={{ background: "linear-gradient(120deg, #e9d9c9 0%, #dce7f0 35%, #e3d7ea 65%, #f0e2d6 100%)" }}>
        <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path d="M0,120 C200,180 300,60 500,110 C700,160 800,40 1000,90 C1100,115 1150,130 1200,120 L1200,300 L0,300 Z" fill="#ffffff" fillOpacity="0.25" />
          <path d="M0,180 C250,120 350,220 600,170 C800,130 900,220 1200,160 L1200,300 L0,300 Z" fill="#ffffff" fillOpacity="0.3" />
        </svg>

        <div className="relative flex flex-col items-center pt-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Sarah Jenkins</h1>
          <p className="text-sm text-slate-600 mt-1">Product Designer at Innovate Solutions</p>
          <p className="text-sm text-slate-600">London, UK</p>

          <nav className="flex gap-8 mt-6 text-sm font-medium text-slate-500">
            <a href="#" className="text-slate-800 border-b-2 border-slate-800 pb-1">Overview</a>
            <a href="#" className="hover:text-slate-800">Projects</a>
            <a href="#" className="hover:text-slate-800">Activity</a>
            <a href="#" className="hover:text-slate-800">Settings</a>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 relative pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="relative shrink-0">
              <img src="https://i.pravatar.cc/200?img=47" alt="Elena Rossi" className="w-32 h-32 rounded-full ring-4 ring-white object-cover" />
              <span className="absolute bottom-2 right-2 bg-blue-600 rounded-full p-1 ring-2 ring-white">
                <BadgeCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </span>
            </div>
            <div className="pb-2 sm:pb-3">
              <h2 className="text-xl font-semibold text-slate-900">Elena Rossi</h2>
              <p className="text-slate-500 text-sm mt-1 max-w-md">
                Senior Product Designer at Lumora. Exploring the intersection of AI and human creativity.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600">
                  <Link2 className="w-4 h-4" strokeWidth={2} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600">
                  <Mail className="w-4 h-4" strokeWidth={2} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600">
                  <MessageCircle className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pb-3 mt-4 sm:mt-0">
            <button className="px-5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium">
              Message
            </button>
            <button className="px-5 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-medium">
              Follow
            </button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 pb-16">
          {/* Left sidebar */}
          <div className="space-y-6">
            {/* Followers */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex divide-x divide-slate-100">
              <div className="flex-1 text-center py-4">
                <div className="text-lg font-semibold text-slate-900">14.2k</div>
                <div className="text-xs text-slate-400 tracking-wide">FOLLOWERS</div>
              </div>
              <div className="flex-1 text-center py-4">
                <div className="text-lg font-semibold text-slate-900">342</div>
                <div className="text-xs text-slate-400 tracking-wide">FOLLOWING</div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-indigo-50/60 rounded-xl border border-indigo-100 p-5">
              <h3 className="text-xs font-semibold tracking-wide text-slate-500 mb-4">ANALYTICS OVERVIEW</h3>

              <div className="flex items-center justify-between text-sm text-slate-700 mb-1.5">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" strokeWidth={2} />
                  Published Blogs
                </span>
                <span className="font-semibold text-slate-900">48</span>
              </div>
              <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "70%" }} />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-500" strokeWidth={2} />
                  Total Views
                </span>
                <span className="font-semibold text-slate-900">1.2M</span>
              </div>
              <svg className="w-full h-14" viewBox="0 0 260 56" fill="none">
                <polyline
                  points="0,40 20,30 40,45 60,25 80,38 100,20 120,32 140,10 160,28 180,15 200,35 220,18 240,30 260,12"
                  fill="none"
                  stroke="#4338ca"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-xs font-semibold tracking-wide text-slate-500 mb-4">ACHIEVEMENTS</h3>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  <Award className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Top Voice
                </span>
                <span className="bg-orange-100 text-transparent text-xs font-medium px-6 py-1.5 rounded-full">•</span>
                <span className="bg-indigo-100 text-transparent text-xs font-medium px-8 py-1.5 rounded-full block w-24">&nbsp;</span>
              </div>
            </div>
          </div>

          {/* Right: Latest Publications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">Latest Publications</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-100 text-slate-600">
                  <LayoutGrid className="w-4 h-4" strokeWidth={2} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-500">
                  <List className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {stats.map((pub, i) => (
                <PublicationCard key={i} pub={pub} isCaseStudy={false} />
              ))}
              <PublicationCard
                pub={{
                  label: "Sep 15, 2024",
                  read: "12 min read",
                  title: "Redefining the Lumora Dashboard",
                  desc: "A deep dive into our 6-month process of decluttering the main author experience and optimizing for writing flow states.",
                  tag: "CASE STUDY",
                  likes: "3.4k",
                  comments: 210,
                  tagColor: "bg-black/30",
                }}
                isCaseStudy={true}
              />
            </div>

            <div className="flex justify-center mt-6">
              <button className="px-6 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}