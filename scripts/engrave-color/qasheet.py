"""QA sheet: one tile per (family,colour) group: swatch + example decorated crop around engraving + blank crop."""
import json,os,sys,numpy as np
from PIL import Image,ImageDraw,ImageFont
HERE=os.path.dirname(os.path.abspath(__file__)); IMG=os.path.join(HERE,"img")
ns={"__file__":os.path.abspath(os.path.join(HERE,"measure.py"))}; exec(open(os.path.join(HERE,"measure.py")).read().split("out={}")[0],ns)
pairs={p[0]:p for p in ns["pairs"]}
gc=json.load(open(os.path.join(HERE,"group-colors.json"))); meas=json.load(open(os.path.join(HERE,"measured.json"))); groups=json.load(open(os.path.join(HERE,"groups.json")))
final=json.load(open(os.path.join(HERE,"engraving-colors.json")))
try: F=ImageFont.truetype("arial.ttf",18); Fs=ImageFont.truetype("arial.ttf",14)
except: F=Fs=ImageFont.load_default()
def crop_pair(sku):
    s,dec,bl=pairs[sku]
    D=ns["load"](os.path.join(IMG,s,dec.split('/')[-1])); B=ns["load"](os.path.join(IMG,s,bl.split('/')[-1]),(D.shape[1],D.shape[0]))
    LD=ns["rgb2lab"](D); LB=ns["rgb2lab"](B); dE=np.sqrt(((LD-LB)**2).sum(-1)); m=(dE>14)&(LB[...,0]<97)
    ys,xs=np.where(m)
    if len(ys)<50: return None
    y0,y1=np.percentile(ys,[2,98]).astype(int); x0,x1=np.percentile(xs,[2,98]).astype(int)
    pad=int(0.15*max(y1-y0,x1-x0))+10; y0=max(0,y0-pad); x0=max(0,x0-pad); y1=min(D.shape[0],y1+pad); x1=min(D.shape[1],x1+pad)
    a=Image.fromarray(D[y0:y1,x0:x1].astype(np.uint8)); b=Image.fromarray(B[y0:y1,x0:x1].astype(np.uint8))
    return a,b
TW,TH=560,230
tiles=[]
fam_filter=sys.argv[1] if len(sys.argv)>1 else None
for g in gc:
    if fam_filter and g['family']!=fam_filter: continue
    tile=Image.new("RGB",(TW,TH),"white"); d=ImageDraw.Draw(tile)
    hx=g['engrave_hex'] or "#FFFFFF"; d.rectangle([10,10,110,110],fill=hx,outline="black")
    d.rectangle([10,120,110,220],fill=g['coating_hex'] or "#FFFFFF",outline="black")
    d.text((120,10),f"{g['family']} / {g['color']}",fill="black",font=F)
    d.text((120,36),f"{g['skus']} SKU, {g['measured']} olculdu",fill="black",font=Fs)
    d.text((120,56),f"kazima {hx}  L={g['engrave_L_med']} +/-{g['L_spread']}",fill="black",font=Fs)
    d.text((120,76),f"kaplama {g['coating_hex']}",fill="black",font=Fs)
    ex=[s for s in (g['examples'] or '').split() if s in pairs and meas.get(s,{}).get('ok')]
    if ex:
        cp=crop_pair(ex[0])
        if cp:
            a,b=cp; a.thumbnail((200,120)); b.thumbnail((200,120)); tile.paste(a,(120,100)); tile.paste(b,(330,100)); d.text((120,222),ex[0],fill="black",font=Fs)
    else: d.text((120,120),"gorsel cifti yok -> kural/grup",fill="gray",font=Fs)
    tiles.append(tile)
cols=3; rows=(len(tiles)+cols-1)//cols
sheet=Image.new("RGB",(cols*TW+20,rows*TH+20),"#DDDDDD")
for i,t in enumerate(tiles): sheet.paste(t,(10+(i%cols)*TW,10+(i//cols)*TH))
name="qa-"+(fam_filter or "all")+".jpg"; sheet.save(os.path.join(HERE,name),quality=85); print(name,sheet.size,len(tiles))
