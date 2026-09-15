import TeacherSidebar from "./TeacherSidebar"

function TeacherLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TeacherSidebar />

      <div className="ml-60 min-h-screen">
        {children}
      </div>
    </div>
  )
}

export default TeacherLayout