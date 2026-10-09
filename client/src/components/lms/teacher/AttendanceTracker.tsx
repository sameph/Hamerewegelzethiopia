export default function AttendanceTracker() {
  const rows = [
    { className: "Biblical Hermeneutics", present: 32, absent: 4, percent: "89%" },
    { className: "Pastoral Counseling", present: 28, absent: 3, percent: "90%" },
    { className: "Church Leadership", present: 30, absent: 5, percent: "86%" },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white">Attendance Management</h3>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.className} className="grid grid-cols-4 items-center gap-2 rounded-2xl bg-white/5 p-3 text-xs sm:text-sm">
            <p className="font-semibold text-slate-100">{row.className}</p>
            <p className="text-emerald-300">Present: {row.present}</p>
            <p className="text-red-300">Absent: {row.absent}</p>
            <p className="text-[#d6ff00] font-semibold">Attendance: {row.percent}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
