import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import { MODULES } from "@/modules/registry";

export default function Home() {
  return (
    <>
      <TopBar crumb="Home" tag="build · run · learn" />
      <div className="content">
        <h1 className="page-title">
          Learn AI by <span style={{ color: "var(--accent-soft)" }}>playing</span> with it.
        </h1>
        <p className="page-sub">
          Every concept — from gradient descent to transformers to data pipelines — as something you
          can touch, tune, and watch move. No passive reading. Drag the inputs, see the math react.
        </p>

        <div className="module-grid">
          {MODULES.map((m) => {
            const card = (
              <>
                <span className={`pill ${m.status}`}>{m.status === "live" ? "live" : "soon"}</span>
                <div className="ico">{m.icon}</div>
                <h3>{m.title}</h3>
                <p>{m.blurb}</p>
              </>
            );
            return m.status === "live" ? (
              <Link key={m.id} to={`/m/${m.slug}`} className="module-card">
                {card}
              </Link>
            ) : (
              <Link key={m.id} to={`/m/${m.slug}`} className="module-card" style={{ opacity: 0.72 }}>
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
