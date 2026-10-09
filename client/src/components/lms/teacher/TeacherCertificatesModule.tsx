const certificates = [
  { student: "Samuel Bekele", course: "Church Leadership", issueDate: "May 10, 2026", status: "Verified" },
  { student: "Liya Tesfaye", course: "Pastoral Counseling", issueDate: "May 12, 2026", status: "Pending" },
];

export default function TeacherCertificatesModule() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white">Certificate Management</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-xl bg-[#d6ff00] px-4 py-2 text-sm font-semibold text-[#08120f]">Generate Certificates</button>
          <button className="rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-100">Approve Completion</button>
          <button className="rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-100">Certificate Templates</button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white">Student Certificates</h3>
        <div className="mt-4 space-y-3">
          {certificates.map((item) => (
            <div key={item.student + item.course} className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
              <p>Student Name: {item.student}</p>
              <p>Course Name: {item.course}</p>
              <p>Issue Date: {item.issueDate}</p>
              <p>Verification Status: {item.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
