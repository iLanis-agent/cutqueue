'use strict';
const assert=require('assert'),{plan}=require('../engine.js');
// Independent oracle: enumerate assignments to k fixed bins, increasing k.
function optimum(cap,arr){for(let k=1;k<=arr.length;k++){const used=Array(k).fill(0);function fit(i){if(i===arr.length)return true;for(let b=0;b<k;b++){if(used[b]+arr[i]<=cap){used[b]+=arr[i];if(fit(i+1))return true;used[b]-=arr[i];}if(used[b]===0)break;}return false;}if(fit(0))return k;}}
let checks=0;
function verify(s,k,t,a){const p=plan(s,k,t,a);assert(!p.error);assert.equal(p.count,optimum(s-2*t,a.map(x=>x+k)));assert(p.proven);const ids=p.bars.flatMap(b=>b.pieces.map(x=>x.id)).sort((a,b)=>a-b);assert.deepEqual(ids,a.map((_,i)=>i));for(const b of p.bars)assert(b.pieces.reduce((sum,x)=>sum+x.length+k,0)<=s-2*t+1e-8);checks++;}
verify(10,0,0,[6,5,3,2,2,2]);verify(2400,3,10,[1100,1100,800,800,550,550]);verify(100,0,0,[50,50]);verify(100,2,5,[43,43]);
let seed=405;for(let n=0;n<100;n++){const a=Array.from({length:3+n%6},()=>{seed=(seed*1664525+1013904223)>>>0;return 1+seed%18;});verify(40,1,1,a);}
for(const args of [[0,0,0,[1]],[10,-1,0,[1]],[10,1,0,[10]],[10,0,0,[]],[10,0,0,[NaN]],[10,0,0,[Infinity]]]){assert(plan(...args).error);checks++;}
const large=plan(100,0,0,Array(30).fill(30));assert(!large.proven);assert.equal(large.count,10);checks++;
console.log(checks+' cases passed; independent exhaustive bin-assignment oracle + constraints.');
