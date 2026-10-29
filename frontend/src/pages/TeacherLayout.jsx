import TeacherSidebar from "./TeacherSidebar"

function TeacherLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#080D19]">
      <TeacherSidebar />

      <div className="ml-60 min-h-screen bg-[#080D19]">
        {children}
      </div>
    </div>
  )
}

export default TeacherLayout
