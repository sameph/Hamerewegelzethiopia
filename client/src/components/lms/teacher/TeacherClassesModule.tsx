import AttendanceTracker from "./AttendanceTracker";

const liveClasses = [
  { title: "Biblical Hermeneutics", date: "May 15", time: "09:00 AM" },
  { title: "Pastoral Counseling", date: "May 15", time: "01:30 PM" },
];

const recordedClasses = [
  { title: "Church Leadership Week 3", notes: "Uploaded", resources: "Download" },
  { title: "Sermon Preparation Workshop", notes: "Uploaded", resources: "Download" },
];

export default function TeacherClassesModule() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white">Live Classes</h2>
        <div className="mt-4 space-y-3">
          {liveClasses.map((item) => (
            <div key={item.title} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/5 p-4">
              <div>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-xs text-slate-400">{item.date} • {item.time}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-100">Join Meeting</button>
                <button className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-100">Attendance</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white">Recorded Classes</h3>
        <div className="mt-4 space-y-3">
          {recordedClasses.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white/5 p-4">
              <p className="font-semibold text-white">{item.title}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-100">Upload Recording</button>
                <button className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-100">Class Notes</button>
                <button className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-100">Download Resources</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AttendanceTracker />
    </div>
  );
}
