import { NavLink, useNavigate } from "react-router-dom"

function StudentSidebar() {
  const navigate = useNavigate()

  const menuItems = [
    {
      name: "Dashboard",
      path: "/student-dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      name: "My Evaluations",
      path: "/student-evaluations",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 4h8M8 8h8M8 12h5M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        </svg>
      ),
    },
    {
      name: "Answer Sheets",
      path: "/student-answer-sheets",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </svg>
      ),
    },
    {
      name: "My Results",
      path: "/student-result",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 19V5M4 19h17M8 16v-5M13 16V8M18 16V4" />
        </svg>
      ),
    },
    {
      name: "My Profile",
      path: "/student-profile",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      ),
    },
  ]

  const handleLogout = () => {
    navigate("/")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-white/10 bg-[#0B1220]">
      <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-950/40">
          E
        </div>

        <div>
          <p className="text-[17px] font-bold tracking-tight text-white">
            Eval<span className="text-blue-400">AI</span>
          </p>
          <p className="text-[10px] font-medium tracking-wide text-slate-500">
            THEORY EVALUATION
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-7">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
          Student Workspace
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "border border-blue-400/20 bg-blue-500/15 text-blue-300 shadow-sm shadow-blue-950/20"
                    : "border border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 h-7 w-[3px] rounded-r-full bg-blue-400" />
                  )}

                  <span
                    className={`h-[19px] w-[19px] shrink-0 ${
                      isActive
                        ? "text-blue-400"
                        : "text-slate-500 group-hover:text-slate-200"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="flex-1">{item.name}</span>

                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#111B2D] p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white">
            S
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">
              Student
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Academic Portal
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-[18px] w-[18px]"
            >
              <path d="M10 17l5-5-5-5M15 12H3M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
            </svg>
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-500">
          EvalAI · Academic Workspace
        </p>
      </div>
    </aside>
  )
}

export default StudentSidebar