"""Step 2b: per (family,colour) group -> median engrave colour from per-SKU measurements."""
import json,os,csv,collections,numpy as np
HERE=os.path.dirname(os.path.abspath(__file__))
meas=json.load(open(os.path.join(HERE,"measured.json"))); groups=json.load(open(os.path.join(HERE,"groups.json")))
def h2rgb(h): return [int(h[i:i+2],16) for i in (1,3,5)]
def hexof(rgb): return "#%02X%02X%02X"%tuple(int(round(x)) for x in rgb)
def lum(rgb): r,g,b=[x/255 for x in rgb]; return round(0.2126*r+0.7152*g+0.0722*b,3)
by=collections.defaultdict(list)
for r in groups:
    m=meas.get(r['sku'])
    if m and m.get('ok'): by[(r['family'],r['color'])].append((r['sku'],m))
rows=[]
allg=collections.Counter((r['family'],r['color']) for r in groups)
for key,n in sorted(allg.items(),key=lambda x:(x[0][0],-x[1])):
    ms=by.get(key,[])
    if ms:
        E=np.array([h2rgb(m['engrave_hex']) for s,m in ms]); C=np.array([h2rgb(m['coating_hex']) for s,m in ms])
        Ls=np.array([m['engrave_L'] for s,m in ms])
        med=np.median(E,0); spread=float(Ls.std()) if len(ms)>1 else 0.0
        rows.append({"family":key[0],"color":key[1],"skus":n,"measured":len(ms),"engrave_hex":hexof(med),"coating_hex":hexof(np.median(C,0)),
                     "engrave_L_med":round(float(np.median(Ls)),1),"L_spread":round(spread,1),"tone":"light" if lum(med)>0.45 else "dark",
                     "examples":' '.join(s for s,m in ms[:4])})
    else:
        rows.append({"family":key[0],"color":key[1],"skus":n,"measured":0,"engrave_hex":"","coating_hex":"","engrave_L_med":"","L_spread":"","tone":"","examples":' '.join(r['sku'] for r in groups if (r['family'],r['color'])==key)[:40]})
with open(os.path.join(HERE,"group-colors.csv"),"w",newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
json.dump(rows,open(os.path.join(HERE,"group-colors.json"),"w"),indent=1)
cov=sum(r['skus'] for r in rows if r['measured']); print("groups",len(rows),"measured groups",sum(1 for r in rows if r['measured']),"skus covered by measured group",cov,"/",sum(r['skus'] for r in rows))
for r in rows: print(f"{r['skus']:3d} {r['measured']:3d} {r['family']:12s} {r['color']:24s} {r['engrave_hex']:8s} coat {r['coating_hex']:8s} L={r['engrave_L_med']} ±{r['L_spread']} {r['tone']}")
