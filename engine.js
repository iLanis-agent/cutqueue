/* CutQueue: 1D cutting stock. Each piece consumes length+kerf, including a
   finishing cut. End trim is reserved once at each end of every stock bar.
   Exact minimum-bar search is bounded to 18 pieces and 150000 nodes. */
'use strict';
(function(root){
function plan(stock,kerf,trim,pieces){
 if(![stock,kerf,trim].every(Number.isFinite)||stock<=0||kerf<0||trim<0||!Array.isArray(pieces)||!pieces.length||pieces.length>200)return {error:'Use positive stock, nonnegative kerf/trim, and 1-200 pieces.'};
 const cap=stock-2*trim, ps=pieces.map((p,i)=>({length:p,id:i,cost:p+kerf}));
 if(ps.some(p=>!Number.isFinite(p.length)||p.length<=0||p.cost>cap+1e-8))return {error:'A piece plus its finishing-cut kerf does not fit after end trim.'};
 ps.sort((a,b)=>b.cost-a.cost||a.id-b.id);
 const bins=[];
 for(const p of ps){let b=bins.find(b=>b.used+p.cost<=cap+1e-8);if(!b){b={used:0,items:[]};bins.push(b);}b.used+=p.cost;b.items.push(p);}
 let best=bins.map(b=>({used:b.used,items:b.items.slice()})), nodes=0,cutoff=false;
 const sum=ps.reduce((s,p)=>s+p.cost,0), lower=Math.max(1,Math.ceil((sum-1e-8)/cap));
 if(ps.length<=18&&best.length>lower){
 const work=[];
 function search(i){if(++nodes>150000){cutoff=true;return;}if(i===ps.length){if(work.length<best.length)best=work.map(b=>({used:b.used,items:b.items.slice()}));return;}
 if(work.length>=best.length||best.length===lower||cutoff)return;
 const p=ps[i],seen=new Set();
 for(const b of work){const key=b.used.toFixed(8);if(seen.has(key)||b.used+p.cost>cap+1e-8)continue;seen.add(key);b.items.push(p);b.used+=p.cost;search(i+1);b.used-=p.cost;b.items.pop();}
 if(work.length+1<best.length){work.push({used:p.cost,items:[p]});search(i+1);work.pop();}}
 search(0);
 }
 const proven=best.length===lower||(ps.length<=18&&!cutoff);
 return {stock,kerf,trim,capacity:cap,bars:best.map((b,i)=>({n:i+1,pieces:b.items.map(p=>({id:p.id,length:p.length})),offcut:Math.max(0,cap-b.used)})),count:best.length,lowerBound:lower,proven,nodes,cutoff,totalLength:pieces.reduce((s,p)=>s+p,0),kerfLoss:pieces.length*kerf,trimLoss:best.length*2*trim};
}
const api={plan};if(typeof module==='object')module.exports=api;root.CutQueue=api;
})(typeof globalThis==='object'?globalThis:this);
