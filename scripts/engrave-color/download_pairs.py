import json,re,os,sys,urllib.request,concurrent.futures as cf
REPO=r"C:\Users\akify\fomaprint-engrave"
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),"img")
os.makedirs(OUT,exist_ok=True)
BASE="https://pub-7dbfe9f161d34085b011aea74e8f75ac.r2.dev"
p=json.load(open(os.path.join(REPO,"src/data/products.json"),encoding='utf-8'))['products']
src=open(os.path.join(REPO,"src/data/catalog.ts"),encoding='utf-8').read()
removed=set(re.findall(r'"([^"]+)"',re.search(r'const REMOVED_SKUS = new Set<string>\(\[(.*?)\]\)',src,re.S).group(1)))
added=re.findall(r'sku:\s*"([^"]+)"',re.search(r'const ADDED_PRODUCTS: RawProduct\[\] = \[(.*?)\n\];',src,re.S).group(1))
live=list(dict.fromkeys([it['sku'].upper() for it in p if it['sku'].upper() not in removed]+[s.upper() for s in added]))
imgs=json.load(open(os.path.join(REPO,"src/data/product-images.json"),encoding='utf-8'))
pairs=[]
for s in live:
    g=imgs.get(s) or imgs.get(s.lower())
    if not g: continue
    blanks=[x for x in g if 'BLANK' in x.upper()]
    decs=[x for x in g if 'BLANK' not in x.upper()]
    if not blanks or not decs: continue
    # prefer main pair: {SKU}.jpg + {SKU}_BLANK.png ; else first of each
    dec=next((x for x in decs if re.search(r'/'+re.escape(s)+r'\.(jpg|png)$',x,re.I)),decs[0])
    bl=next((x for x in blanks if re.search(r'_BLANK\.(png|jpg)$',x,re.I) and 'OPEN' not in x.upper()),blanks[0])
    pairs.append((s,dec,bl))
json.dump(pairs,open(os.path.join(OUT,"_pairs.json"),"w"),indent=0)
print("live",len(live),"pairs",len(pairs),flush=True)
def get(path):
    dst=os.path.join(OUT,path.split('/')[2],path.split('/')[-1])
    if os.path.exists(dst) and os.path.getsize(dst)>0: return "skip"
    os.makedirs(os.path.dirname(dst),exist_ok=True)
    req=urllib.request.Request(BASE+path,headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0) Chrome/128"})
    for i in range(3):
        try:
            d=urllib.request.urlopen(req,timeout=60).read(); open(dst,'wb').write(d); return "ok"
        except Exception as e: err=e
    return "ERR "+str(err)
jobs=[x for s,d,b in pairs for x in (d,b)]
res={}
with cf.ThreadPoolExecutor(8) as ex:
    for path,r in zip(jobs,ex.map(get,jobs)):
        res[path]=r
        if r.startswith("ERR"): print(r,path,flush=True)
import collections; print(collections.Counter(v.split()[0] for v in res.values()),flush=True)
