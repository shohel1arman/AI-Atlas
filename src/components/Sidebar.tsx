import { NavLink } from "react-router-dom";
import { GROUP_ORDER, modulesByGroup } from "@/modules/registry";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <span className="mark" />
        <span className="name">
          AI <b>Atlas</b>
        </span>
      </NavLink>

      <NavLink to="/" className="nav-item" end>
        <span className="ico">⌂</span> Atlas Home
      </NavLink>

      {GROUP_ORDER.map((group) => (
        <div className="nav-group" key={group}>
          <h4>{group}</h4>
          {modulesByGroup(group).map((m) => (
            <NavLink
              key={m.id}
              to={`/m/${m.slug}`}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
              <span className="ico">{m.icon}</span>
              {m.title}
              <span className={`badge${m.status === "live" ? " live" : ""}`}>
                {m.status === "live" ? "live" : "soon"}
              </span>
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  );
}
