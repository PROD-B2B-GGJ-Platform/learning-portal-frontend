import { useEffect, useState } from 'react';
import { BookOpen, Clock, Star, Filter, Search, ChevronDown, Users, Play } from 'lucide-react';
import { api } from '../services/api';

export default function CourseCatalog() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Leadership', 'Data Science', 'Cloud Computing', 'Compliance'];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await api.getCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Course Catalog</h1>
        <p className="text-gray-400">Explore our comprehensive library of courses</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search courses..."
            className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
        <button className="theme-button-secondary flex items-center gap-2 px-4 py-3">
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="theme-card animate-pulse">
              <div className="h-40 bg-gray-700 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredCourses.map((course, i) => (
            <div key={i} className="theme-card p-0 overflow-hidden card-hover cursor-pointer group">
              {/* Course Image */}
              <div className="h-40 bg-gradient-to-br from-gray-700 to-gray-800 relative flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-cyan-400/30" />
                <div className="absolute top-3 right-3">
                  <span className="badge badge-info">{course.category}</span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform shadow-lg shadow-cyan-500/25">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </button>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-5">
                <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{course.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.durationHours} hrs
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                  <span>{course.instructor}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-white font-medium">{course.rating || '4.5'}</span>
                    </div>
                    <span className="text-gray-400 text-sm">({course.reviewsCount || 120} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{Math.floor(Math.random() * 500 + 100)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-16 theme-card">
          <BookOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-gray-400">Try adjusting your filters or start the Course Management service</p>
        </div>
      )}
    </div>
  );
}
