import { Suspense, lazy, useMemo } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";
import TopBar from "@/components/TopBar";
import Home from "@/pages/Home";
import { findModule } from "@/modules/registry";

/** Resolves a module slug to either its lazy playground or a scaffolded stub. */
function ModuleRoute() {
  const { slug = "" } = useParams();
  const mod = findModule(slug);

  // Lazy() must be stable across renders for a given slug.
  const Lazy = useMemo(
    () => (mod?.load ? lazy(mod.load) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slug],
  );

  if (!mod) {
    return (
      <>
        <TopBar crumb="Not found" />
        <ComingSoon title="Unknown module" icon="∅" blurb="That path doesn't match any module in the registry." />
      </>
    );
  }

  if (Lazy) {
    return (
      <Suspense
        fallback={
          <>
            <TopBar crumb={mod.title} tag="loading…" />
            <div className="coming-soon"><div className="big">⏳</div><p>Loading playground…</p></div>
          </>
        }
      >
        <Lazy />
      </Suspense>
    );
  }

  return (
    <>
      <TopBar crumb={mod.title} tag="coming soon" />
      <ComingSoon title={mod.title} icon={mod.icon} blurb={mod.blurb} />
    </>
  );
}

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/m/:slug" element={<ModuleRoute />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}
