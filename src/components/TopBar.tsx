interface TopBarProps {
  crumb: string;
  tag?: string;
}

export default function TopBar({ crumb, tag = "interactive" }: TopBarProps) {
  return (
    <div className="topbar">
      <span className="crumb">
        <b>Atlas</b> &nbsp;/&nbsp; {crumb}
      </span>
      <span className="tag">
        <span className="dot" /> {tag}
      </span>
    </div>
  );
}
