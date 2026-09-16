import { NavLink } from "react-router-dom"

function TeacherSidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/teacher-dashboard" },
    { name: "Evaluations", path: "/evaluations" },
    { name: "Answer Sheets", path: "/answer-sheets" },
    { name: "Rubrics", path: "/rubrics" },
    { name: "Students", path: "/students" },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col">

      <div className="h-14 px-5 flex items-center border-b border-slate-200">
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          E
        </div>

        <div className="ml-3">
          <p className="text-sm font-bold text-slate-900">
            EvalAI
          </p>

          <p className="text-[9px] text-slate-400">
            Theory Evaluation
          </p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {item.name}
          </NavLink>

        ))}

      </nav>

      <div className="p-4 border-t border-slate-200">

        <div className="flex items-center gap-3">

          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
            T
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700">
              Teacher
            </p>

            <p className="text-[10px] text-slate-400">
              Evaluation Portal
            </p>
          </div>

        </div>

      </div>

    </aside>
  )
}

export default TeacherSidebar