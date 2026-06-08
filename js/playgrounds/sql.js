/* ============================================================
   AI ATLAS — tiny in-browser SQL engine + sample dataset
   Supports: SELECT (cols | * | aggregates) FROM orders
             [WHERE c op v [AND ...]] [GROUP BY col]
             [ORDER BY col [ASC|DESC]] [LIMIT n]
   ============================================================ */
(function () {
  'use strict';
  // ---- deterministic sample dataset ----
  function rng(s){ return ()=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return s/0x7fffffff; }; }
  const r = rng(42);
  const regions=['North','South','East','West'], cats=['Electronics','Apparel','Home','Toys'], chans=['Online','Retail'], months=['Jan','Feb','Mar','Apr','May','Jun'];
  const DATA=[];
  for(let i=0;i<90;i++){
    const region=regions[(r()*regions.length)|0], category=cats[(r()*cats.length)|0], channel=chans[(r()*chans.length)|0], month=months[(r()*months.length)|0];
    const units=1+((r()*40)|0);
    const price=category==='Electronics'?120+r()*400:category==='Apparel'?20+r()*80:category==='Home'?30+r()*150:10+r()*60;
    const revenue=Math.round(units*price);
    DATA.push({ id:1000+i, region, category, channel, month, units, revenue });
  }
  const COLS=['id','region','category','channel','month','units','revenue'];
  const NUMERIC=['id','units','revenue'];

  function err(msg){ return { error: msg }; }

  function parseVal(v){ if(v==null) return null; v=v.trim(); if(/^'.*'$/.test(v)||/^".*"$/.test(v)) return v.slice(1,-1); if(/^-?[\d.]+$/.test(v)) return +v; return v; }
  function applyWhere(rows, where){
    if(!where) return rows;
    const conds = where.split(/\s+and\s+/i).map(c=>{
      const m=c.match(/^\s*(\w+)\s*(>=|<=|!=|=|>|<)\s*('[^']*'|"[^"]*"|[\w.\-]+)\s*$/);
      if(!m) throw 'Bad WHERE near "'+c.trim()+'"';
      return { col:m[1], op:m[2], val:parseVal(m[3]) };
    });
    return rows.filter(row=>conds.every(({col,op,val})=>{
      if(!(col in row)) throw 'Unknown column "'+col+'"';
      const a=row[col];
      switch(op){ case'=':return a==val; case'!=':return a!=val; case'>':return a>val; case'<':return a<val; case'>=':return a>=val; case'<=':return a<=val; }
    }));
  }
  function parseSelectItem(item){
    item=item.trim();
    let alias=null; const am=item.match(/\s+as\s+(\w+)\s*$/i); if(am){ alias=am[1]; item=item.slice(0,am.index).trim(); }
    const agg=item.match(/^(count|sum|avg|min|max)\s*\(\s*(\*|\w+)\s*\)$/i);
    if(agg) return { agg:agg[1].toUpperCase(), col:agg[2], label:alias||item.replace(/\s+/g,'') };
    return { col:item, label:alias||item };
  }
  function aggregate(rows, items, groupCols){
    function calc(set, it){
      if(it.agg==='COUNT') return set.length;
      const vals=set.map(r=>r[it.col]).filter(v=>typeof v==='number');
      if(it.agg==='SUM') return vals.reduce((a,b)=>a+b,0);
      if(it.agg==='AVG') return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
      if(it.agg==='MIN') return Math.min(...vals);
      if(it.agg==='MAX') return Math.max(...vals);
    }
    if(groupCols.length){
      const groups={};
      rows.forEach(r=>{ const k=groupCols.map(c=>r[c]).join('||'); (groups[k]=groups[k]||[]).push(r); });
      return Object.values(groups).map(set=>{
        const o={};
        items.forEach(it=>{ if(it.agg) o[it.label]=calc(set,it); else o[it.label]=set[0][it.col]; });
        return o;
      });
    } else {
      const o={}; items.forEach(it=>{ o[it.label]= it.agg?calc(rows,it):rows[0]?.[it.col]; }); return [o];
    }
  }

  window.SAMPLE_COLS = COLS; window.SAMPLE_DATA = DATA; window.SAMPLE_NUMERIC = NUMERIC;
  window.runSQL = function(q){
    try{
      q=q.replace(/;\s*$/,'').replace(/\s+/g,' ').trim();
      const m=q.match(/^select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(.+?))?(?:\s+group\s+by\s+([\w,\s]+?))?(?:\s+order\s+by\s+(\w+)(?:\s+(asc|desc))?)?(?:\s+limit\s+(\d+))?$/i);
      if(!m) return err('Could not parse query. Try: SELECT region, SUM(revenue) FROM orders GROUP BY region');
      const [,sel,table,where,group,orderCol,orderDir,limit]=m;
      if(table.toLowerCase()!=='orders') return err('Unknown table "'+table+'". Only "orders" exists.');
      let rows=applyWhere(DATA, where);
      const groupCols = group? group.split(',').map(s=>s.trim()).filter(Boolean):[];
      let items;
      let out;
      if(sel.trim()==='*'){ items=COLS.map(c=>({col:c,label:c})); out=rows.map(r=>{const o={};COLS.forEach(c=>o[c]=r[c]);return o;}); }
      else {
        items=sel.split(',').map(parseSelectItem);
        const hasAgg=items.some(it=>it.agg);
        if(hasAgg||groupCols.length) out=aggregate(rows, items, groupCols);
        else out=rows.map(r=>{const o={};items.forEach(it=>o[it.label]=r[it.col]);return o;});
      }
      const cols = items.map(it=>it.label);
      if(orderCol){ const dir=(orderDir||'asc').toLowerCase()==='desc'?-1:1; const key=cols.find(c=>c.toLowerCase()===orderCol.toLowerCase())||orderCol; out.sort((a,b)=>{const x=a[key],y=b[key]; return (x>y?1:x<y?-1:0)*dir;}); }
      if(limit) out=out.slice(0,+limit);
      return { cols, rows: out.map(o=>cols.map(c=>o[c])) , count: out.length };
    } catch(e){ return err(typeof e==='string'?e:'Query error'); }
  };
})();
