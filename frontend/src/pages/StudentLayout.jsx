import StudentSidebar from "./StudentSidebar"

function StudentLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#080D19]">
      <StudentSidebar />

      <div className="ml-60 min-h-screen bg-[#080D19]">
        {children}
      </div>
    </div>
  )
}

export default StudentLayout