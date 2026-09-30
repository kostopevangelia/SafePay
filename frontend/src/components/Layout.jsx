import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">SP</span>
          <div>
            <div className="brand-name">SafePay</div>
            <div className="brand-sub">Payment operations</div>
          </div>
        </div>
        <nav className="app-nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/payments">Payments</NavLink>
          <NavLink to="/history">Payment History</NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
