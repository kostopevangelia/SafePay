export default function Alert({ type = 'info', title, children }) {
  if (!title && !children) {
    return null;
  }
  return (
    <div className={`alert alert-${type}`} role="alert">
      {title ? <div className="alert-title">{title}</div> : null}
      {children ? <div className="alert-body">{children}</div> : null}
    </div>
  );
}
