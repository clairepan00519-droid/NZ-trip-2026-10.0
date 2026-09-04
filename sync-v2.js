/* NZ Trip collaborative sync v2: pure three-way merge engine.
   Remote data is never allowed to replace locally changed data silently. */
(function(global){
  const MISSING=Symbol('missing');
  const isObject=v=>v!==null&&typeof v==='object';
  const stable=v=>{
    if(v===MISSING)return'__MISSING__';
    if(Array.isArray(v))return'['+v.map(stable).join(',')+']';
    if(isObject(v))return'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';
    return JSON.stringify(v);
  };
  const equal=(a,b)=>stable(a)===stable(b);
  const itemId=v=>isObject(v)&&!Array.isArray(v)?String(v.id||v._storageKey||''):'';
  const idArray=a=>Array.isArray(a)&&a.every(v=>itemId(v));
  const mediaArray=(storeKey,path)=>storeKey==='nz_photos'||storeKey==='nz_route_maps'||/imgs?$/.test(path.join('.'));
  function merge(base,local,remote,ctx,path=[]){
    if(equal(local,remote))return local;
    if(equal(local,base))return remote;
    if(equal(remote,base))return local;
    if(Array.isArray(local)&&Array.isArray(remote)){
      if(idArray(local)&&idArray(remote)&&(base===MISSING||idArray(base))){
        const bm=new Map((base===MISSING?[]:base).map(v=>[itemId(v),v])),lm=new Map(local.map(v=>[itemId(v),v])),rm=new Map(remote.map(v=>[itemId(v),v]));
        const order=[...local.map(itemId),...remote.map(itemId).filter(id=>!lm.has(id))],out=[];
        for(const id of order){const value=merge(bm.has(id)?bm.get(id):MISSING,lm.has(id)?lm.get(id):MISSING,rm.has(id)?rm.get(id):MISSING,ctx,[...path,id]);if(value!==MISSING)out.push(value);}
        return out;
      }
      if(mediaArray(ctx.storeKey,path)){
        ctx.conflicts.push({path:path.join('.'),kind:'media-union'});
        return [...new Set([...local,...remote])];
      }
      ctx.conflicts.push({path:path.join('.'),kind:'array-order',base,local,remote});
      return local;
    }
    if(isObject(local)&&!Array.isArray(local)&&isObject(remote)&&!Array.isArray(remote)&&(base===MISSING||isObject(base)&&!Array.isArray(base))){
      const out={},keys=new Set([...Object.keys(base===MISSING?{}:base),...Object.keys(local),...Object.keys(remote)]);
      for(const key of keys){const value=merge(base!==MISSING&&key in base?base[key]:MISSING,key in local?local[key]:MISSING,key in remote?remote[key]:MISSING,ctx,[...path,key]);if(value!==MISSING)out[key]=value;}
      return out;
    }
    ctx.conflicts.push({path:path.join('.'),kind:'value',base:base===MISSING?null:base,local:local===MISSING?null:local,remote:remote===MISSING?null:remote});
    return local;
  }
  function threeWayMerge(storeKey,base,local,remote){const ctx={storeKey,conflicts:[]},value=merge(base,local,remote,ctx,[]);return{value:value===MISSING?null:value,conflicts:ctx.conflicts};}
  global.NZSyncV2={threeWayMerge,stable,equal};
})(typeof window!=='undefined'?window:globalThis);
