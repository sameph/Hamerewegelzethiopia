"use client";

import { memo, useState } from "react";
import { Search, Filter, SortAsc, Edit, Trash2, Users, Plus } from "lucide-react";

interface Course {
  id: string;
  title: string;
  status: "active" | "inactive";
  enrolledStudents: number;
  completionRate: number;
}

interface CourseManagementProps {
  courses: Course[];
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  onCreateNew?: () => void;
}

const CourseManagement = memo(function CourseManagement({
  courses,
  onEdit,
  onDelete,
  onCreateNew,
}: CourseManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"title" | "students" | "completion">("title");

  const filteredAndSortedCourses = courses
    .filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || course.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "students":
          return b.enrolledStudents - a.enrolledStudents;
        case "completion":
          return b.completionRate - a.completionRate;
        default:
          return a.title.localeCompare(b.title);
      }
    });

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg shadow-charcoal/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Course Management</h2>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-limeCTA to-primaryBg px-4 py-2 text-sm font-semibold text-[#1B1B1B] hover:shadow-lg transition-shadow"
        >
          <Plus size={16} />
          Create Course
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00D084]" size={16} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1B1B1B]/70 border border-white/20 text-white placeholder-[#00D084] focus:outline-none focus:border-[#00D084]"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="px-3 py-2 rounded-lg bg-[#1B1B1B]/70 border border-white/20 text-white focus:outline-none focus:border-[#00D084]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "title" | "students" | "completion")}
            className="px-3 py-2 rounded-lg bg-[#1B1B1B]/70 border border-white/20 text-white focus:outline-none focus:border-[#00D084]"
          >
            <option value="title">Sort by Title</option>
            <option value="students">Sort by Students</option>
            <option value="completion">Sort by Completion</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedCourses.map((course) => (
          <div
            key={course.id}
            className="rounded-xl border border-white/20 bg-[#1B1B1B]/70 p-4 hover:bg-[#1B1B1B]/90 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#F7F7F7] line-clamp-2">{course.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {course.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-[#F7F7F7]">
                <Users size={14} />
                <span>{course.enrolledStudents} students</span>
              </div>
              <div className="text-xs text-[#F7F7F7]">
                Completion Rate: {course.completionRate}%
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(course.id)}
                className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-[#1B1B1B] hover:bg-[#1B1B1B] px-3 py-2 text-xs font-medium text-[#00D084] transition-colors"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={() => onDelete?.(course.id)}
                className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedCourses.length === 0 && (
        <div className="text-center py-8 text-[#00D084]">
          No courses found matching your criteria.
        </div>
      )}
    </div>
  );
});

export default CourseManagement;