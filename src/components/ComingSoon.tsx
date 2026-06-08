interface ComingSoonProps {
  title: string;
  icon: string;
  blurb: string;
}

export default function ComingSoon({ title, icon, blurb }: ComingSoonProps) {
  return (
    <div className="coming-soon">
      <div className="big">{icon}</div>
      <h2>{title}</h2>
      <p style={{ maxWidth: "46ch", margin: "0 auto 22px" }}>{blurb}</p>
      <p className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>
        Scaffolded — wire up the live playground in
        <br />
        <code>src/playgrounds/{title.replace(/[^A-Za-z]/g, "")}/</code>
      </p>
    </div>
  );
}
