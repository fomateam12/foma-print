"""Measure engraved-area colour from (decorated, blank) image pairs.
Output: measured.json {sku: {engrave_hex, coating_hex, n_px, frac, dE_med, L_std, w,h, ok}}"""
import json,os,sys,numpy as np
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__)); IMG=os.path.join(HERE,"img")
pairs=json.load(open(os.path.join(IMG,"_pairs.json")))
def load(path,size=None):
    im=Image.open(path).convert("RGBA")
    if size and im.size!=size: im=im.resize(size,Image.LANCZOS)
    bg=Image.new("RGBA",im.size,(255,255,255,255)); bg.alpha_composite(im)
    return np.asarray(bg.convert("RGB")).astype(np.float32)
def rgb2lab(a):
    a=a/255.0; m=a>0.04045; a=np.where(m,((a+0.055)/1.055)**2.4,a/12.92)
    M=np.array([[0.4124,0.3576,0.1805],[0.2126,0.7152,0.0722],[0.0193,0.1192,0.9505]],np.float32)
    xyz=a@M.T; xyz/=np.array([0.95047,1.0,1.08883],np.float32)
    f=np.where(xyz>0.008856,np.cbrt(xyz),7.787*xyz+16/116)
    return np.stack([116*f[...,1]-16,500*(f[...,0]-f[...,1]),200*(f[...,1]-f[...,2])],-1)
def hexof(rgb): return "#%02X%02X%02X"%tuple(int(round(x)) for x in rgb)
def measure(sku,dec,bl,thr=14.0):
    dp=os.path.join(IMG,sku,dec.split('/')[-1]); bp=os.path.join(IMG,sku,bl.split('/')[-1])
    if not (os.path.exists(dp) and os.path.exists(bp)): return None
    D=load(dp); B=load(bp,(D.shape[1],D.shape[0]))
    # downscale for speed if huge
    h,w=D.shape[:2]
    if max(h,w)>1600:
        s=1600/max(h,w); ns=(int(w*s),int(h*s))
        D=np.asarray(Image.fromarray(D.astype(np.uint8)).resize(ns,Image.LANCZOS)).astype(np.float32)
        B=np.asarray(Image.fromarray(B.astype(np.uint8)).resize(ns,Image.LANCZOS)).astype(np.float32)
    LD=rgb2lab(D); LB=rgb2lab(B)
    dE=np.sqrt(((LD-LB)**2).sum(-1))
    # ignore near-white background pixels in blank (bg), keep product
    prod=(LB[...,0]<97)
    mask=(dE>thr)&prod
    n=int(mask.sum()); tot=int(prod.sum())
    frac=n/max(tot,1)
    if n<50: return {"ok":False,"why":"no-diff","n_px":n,"frac":round(frac,4)}
    if frac>0.40: return {"ok":False,"why":"misaligned","n_px":n,"frac":round(frac,4)}
    # keep the strongest half of diff to avoid antialias edges
    d=dE[mask]; keep=mask.copy(); keep[mask]=d>=np.percentile(d,60)
    eng=D[keep]; coat=B[keep]
    Le=LD[keep]
    med=np.median(eng,0); medc=np.median(coat,0)
    return {"ok":True,"engrave_hex":hexof(med),"coating_hex":hexof(medc),
            "engrave_L":round(float(np.median(Le[:,0])),1),"L_std":round(float(Le[:,0].std()),1),
            "n_px":n,"frac":round(n/max(tot,1),4),"dE_med":round(float(np.median(d)),1),"size":[int(D.shape[1]),int(D.shape[0])]}
out={}
sel=[p for p in pairs if (len(sys.argv)<2 or p[0] in sys.argv[1:])]
for sku,dec,bl in sel:
    try: r=measure(sku,dec,bl)
    except Exception as e: r={"ok":False,"err":str(e)}
    if r is None: continue
    out[sku]=r; print(sku,r,flush=True)
json.dump(out,open(os.path.join(HERE,"measured.json"),"w"),indent=1)
print("measured",len(out),"ok",sum(1 for v in out.values() if v.get("ok")))
