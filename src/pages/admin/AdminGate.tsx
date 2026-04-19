import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { signOut } from "aws-amplify/auth";
import { useApp } from "../../context/AppContext";
import { IronwakeMark } from "../../components/IronwakeMark";
import { ConfigWarning } from "../../components/ConfigWarning";

export function AdminGate() {
  const { amplifyConfigured } = useApp();
  const navigate = useNavigate();

  if (!amplifyConfigured) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <ConfigWarning />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100 text-ink-900">
      <Authenticator signUpAttributes={["email"]}>
        {({ user }) => (
          <div className="min-h-screen flex">
            <aside className="w-64 border-r border-ink-900/10 bg-paper-100/90 flex-shrink-0 hidden md:flex flex-col">
              <Link to="/" className="flex items-center gap-3 p-6 border-b border-ink-900/10">
                <IronwakeMark className="w-8 h-8 text-clay-500" />
                <div>
                  <div className="font-display text-lg">Studio</div>
                  <div className="text-[10px] uppercase tracking-widest text-ink-500">
                    Admin console
                  </div>
                </div>
              </Link>
              <nav className="flex-1 p-4 space-y-1">
                <AdminLink to="/admin" end>Overview</AdminLink>
                <AdminLink to="/admin/products">Products</AdminLink>
                <AdminLink to="/admin/orders">Orders</AdminLink>
                <AdminLink to="/admin/inquiries">Inquiries</AdminLink>
                <AdminLink to="/admin/settings">Shop settings</AdminLink>
              </nav>
              <div className="p-4 border-t border-ink-900/10">
                <div className="text-xs text-ink-500 mb-2 truncate">
                  {user?.signInDetails?.loginId ?? user?.username}
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                  className="btn-ghost w-full text-xs"
                >
                  Sign out
                </button>
              </div>
            </aside>
            <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
              <MobileNav />
              <Outlet />
            </main>
          </div>
        )}
      </Authenticator>
    </div>
  );
}

function AdminLink({
  to,
  end,
  children,
}: {
  to: string;
  end?: boolean;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg text-sm transition ${
          isActive
            ? "bg-clay-500/15 text-clay-400 border border-clay-500/30"
            : "text-ink-700 hover:bg-paper-200/60"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function MobileNav() {
  return (
    <nav className="md:hidden flex gap-2 overflow-x-auto mb-6 pb-2 -mx-6 px-6 border-b border-ink-900/10">
      <AdminLink to="/admin" end>Overview</AdminLink>
      <AdminLink to="/admin/products">Products</AdminLink>
      <AdminLink to="/admin/orders">Orders</AdminLink>
      <AdminLink to="/admin/inquiries">Inquiries</AdminLink>
      <AdminLink to="/admin/settings">Settings</AdminLink>
    </nav>
  );
}
