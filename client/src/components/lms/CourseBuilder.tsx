"use client";

import { memo, useState } from "react";
import { ChevronRight, ChevronLeft, Save, Upload, BookOpen, Users, FileText } from "lucide-react";

interface CourseBuilderProps {
  onSave?: (courseData: any) => void;
  onCancel?: () => void;
}

const CourseBuilder = memo(function CourseBuilder({ onSave, onCancel }: CourseBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    duration: "",
    modules: [] as any[],
    materials: [] as any[],
  });

  const steps = [
    { id: 1, title: "Course Info", icon: BookOpen },
    { id: 2, title: "Modules", icon: FileText },
    { id: 3, title: "Materials", icon: Upload },
    { id: 4, title: "Review", icon: Users },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    onSave?.(courseData);
  };

  const updateCourseData = (field: string, value: any) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#00D084] mb-2">Course Title</label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => updateCourseData("title", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1B1B1B]/70 border border-white/20 text-white placeholder-[#00D084] focus:outline-none focus:border-[#00D084]"
                placeholder="Enter course title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00D084] mb-2">Description</label>
              <textarea
                value={courseData.description}
                onChange={(e) => updateCourseData("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-[#1B1B1B]/70 border border-white/20 text-white placeholder-[#00D084] focus:outline-none focus:border-[#00D084]"
                placeholder="Describe your course"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#00D084] mb-2">Category</label>
                <select
                  value={courseData.category}
                  onChange={(e) => updateCourseData("category", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#1B1B1B]/70 border border-white/20 text-white focus:outline-none focus:border-[#00D084]"
                >
                  <option value="">Select category</option>
                  <option value="theology">Theology</option>
                  <option value="biblical-studies">Biblical Studies</option>
                  <option value="church-history">Church History</option>
                  <option value="leadership">Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#00D084] mb-2">Level</label>
                <select
                  value={courseData.level}
                  onChange={(e) => updateCourseData("level", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#1B1B1B]/70 border border-white/20 text-white focus:outline-none focus:border-[#00D084]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00D084] mb-2">Duration (weeks)</label>
              <input
                type="number"
                value={courseData.duration}
                onChange={(e) => updateCourseData("duration", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1B1B1B]/70 border border-white/20 text-white placeholder-[#00D084] focus:outline-none focus:border-[#00D084]"
                placeholder="Enter duration in weeks"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Course Modules</h3>
            <p className="text-[#00D084] text-sm">Add modules and lessons for your course</p>

            {courseData.modules.map((module, index) => (
              <div key={index} className="rounded-lg bg-[#1B1B1B]/70 p-4 border border-white/20">
                <input
                  type="text"
                  placeholder="Module title"
                  value={module.title || ""}
                  onChange={(e) => {
                    const newModules = [...courseData.modules];
                    newModules[index] = { ...newModules[index], title: e.target.value };
                    updateCourseData("modules", newModules);
                  }}
                  className="w-full px-3 py-2 rounded bg-[#1B1B1B]/70 border border-white/20 text-white placeholder-[#00D084] focus:outline-none focus:border-[#00D084] mb-2"
                />
                <textarea
                  placeholder="Module description"
                  value={module.description || ""}
                  onChange={(e) => {
                    const newModules = [...courseData.modules];
                    newModules[index] = { ...newModules[index], description: e.target.value };
                    updateCourseData("modules", newModules);
                  }}
                  rows={2}
                  className="w-full px-3 py-2 rounded bg-[#1B1B1B]/70 border border-white/20 text-white placeholder-[#00D084] focus:outline-none focus:border-[#00D084]"
                />
              </div>
            ))}

            <button
              onClick={() => updateCourseData("modules", [...courseData.modules, { title: "", description: "" }])}
              className="w-full py-2 rounded-lg bg-[#1B1B1B] hover:bg-[#1B1B1B] text-[#00D084] font-medium transition-colors"
            >
              + Add Module
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Course Materials</h3>
            <p className="text-[#00D084] text-sm">Upload files, videos, and other resources</p>

            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
              <Upload className="mx-auto mb-4 text-[#00D084]" size={48} />
              <p className="text-[#00D084] mb-2">Drag and drop files here or click to browse</p>
              <button className="px-4 py-2 rounded-lg bg-[#1B1B1B] hover:bg-[#1B1B1B] text-[#00D084] font-medium transition-colors">
                Browse Files
              </button>
            </div>

            {courseData.materials.length > 0 && (
              <div className="space-y-2">
                {courseData.materials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#1B1B1B]/70">
                    <span className="text-white">{material.name}</span>
                    <button className="text-red-400 hover:text-red-300">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Review Course</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-[#00D084]">Course Information</h4>
                <p className="text-white"><strong>Title:</strong> {courseData.title}</p>
                <p className="text-white"><strong>Category:</strong> {courseData.category}</p>
                <p className="text-white"><strong>Level:</strong> {courseData.level}</p>
                <p className="text-white"><strong>Duration:</strong> {courseData.duration} weeks</p>
              </div>

              <div>
                <h4 className="font-medium text-[#00D084]">Modules ({courseData.modules.length})</h4>
                {courseData.modules.map((module, index) => (
                  <div key={index} className="ml-4 mt-2">
                    <p className="text-white font-medium">{module.title}</p>
                    <p className="text-[#F7F7F7] text-sm">{module.description}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-medium text-[#00D084]">Materials ({courseData.materials.length})</h4>
                <p className="text-[#F7F7F7] text-sm">Files uploaded</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg shadow-charcoal/20">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.id
                  ? "bg-[#00D084] text-[#1B1B1B]"
                  : "bg-[#1B1B1B] text-[#00D084]"
              }`}
            >
              <step.icon size={20} />
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                currentStep >= step.id ? "text-[#00D084]" : "text-[#F7F7F7]"
              }`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="ml-4 text-[#00D084]" size={16} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          className="px-6 py-2 rounded-lg bg-[#1B1B1B] hover:bg-[#1B1B1B] text-[#00D084] font-medium transition-colors"
        >
          {currentStep === 1 ? "Cancel" : "Previous"}
        </button>

        <div className="flex gap-3">
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-[#00D084] hover:bg-[#A6FF4D] text-[#1B1B1B] font-medium transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-limeCTA to-primaryBg text-[#1B1B1B] font-medium hover:shadow-lg transition-shadow"
            >
              <Save size={16} />
              Create Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default CourseBuilder;