"""Step 5a: final per-SKU engrave colour. Priority: sku-measured > group-median > family rule."""
import json,os,collections,numpy as np
HERE=os.path.dirname(os.path.abspath(__file__))
meas=json.load(open(os.path.join(HERE,"measured.json"))); groups=json.load(open(os.path.join(HERE,"groups.json")))
gc={(r['family'],r['color']):r for r in json.load(open(os.path.join(HERE,"group-colors.json")))}
glass=json.load(open(os.path.join(HERE,"measured-glass.json")))
def h2rgb(h): return [int(h[i:i+2],16) for i in (1,3,5)]
def hexof(rgb): return "#%02X%02X%02X"%tuple(int(round(x)) for x in rgb)
def L(h):
    r,g,b=[x/255 for x in h2rgb(h)]; f=lambda c: ((c+0.055)/1.055)**2.4 if c>0.04045 else c/12.92
    y=0.2126*f(r)+0.7152*f(g)+0.0722*f(b); return 116*(y**(1/3) if y>0.008856 else 7.787*y+16/116)-16
# glass: frost tint over white (JDS photos, 11 SKUs ok)
gvals=[v for v in glass.values() if v['n']>=100]
GLASS_HEX=hexof(np.median([h2rgb(v['engrave_hex']) for v in gvals],0)); GLASS_N=len(gvals)
STEEL_SILVER=gc[('steel-powder','Black')]['engrave_hex']   # steel revealed under black coat, 33 SKUs
RULES={  # family -> (hex, note) when no measurement exists
 'glass':(GLASS_HEX,'frost; measured on white from %d JDS photos'%GLASS_N),
 'acrylic':(GLASS_HEX,'frost, same as glass'),
 'lazerburst':('#F2F2F2','white core revealed (rule)'),
 'aluminum':(STEEL_SILVER,'anodized layer removed -> silver aluminum (rule = black-steel measurement)'),
 'brass':('#C9A46A','brass revealed (rule)'),
 'plastic':('#E6E6E6','light core (rule)'),
 'slate':(gc[('slate','Charcoal Gray')]['engrave_hex'],'slate group measurement'),
 'ceramic':('#2B2B2B','dark core (rule) - check: white ceramic may be sublimation not laser'),
 'wood':(gc[('wood','Multi Brown')]['engrave_hex'],'burnt wood, Multi Brown group'),
 'leatherette':('#262626','dark burn (rule, single-tone leatherette)'),
 'steel-powder':(STEEL_SILVER,'steel revealed (rule)'),
}
BAD_SKU={'GFT2138','GFT2242','FSK310','FSK304'}  # visually confirmed misaligned/blown
out={}; src_count=collections.Counter()
for r in groups:
    s=r['sku']; key=(r['family'],r['color']); g=gc.get(key); m=meas.get(s)
    rec={"family":r['family'],"color":r['color']}
    if r['family']=='glass' and s in glass and glass[s]['n']>=100:
        rec.update(hex=glass[s]['engrave_hex'],source="sku-measured",n=glass[s]['n'])
    elif r['family']=='glass':
        rec.update(hex=GLASS_HEX,source="group-median",n=GLASS_N)
    elif m and m.get('ok') and s not in BAD_SKU and m['n_px']>=300 and m['frac']<0.30 and m['engrave_hex'] not in ('#FFFFFF','#000000') and (not g or not g['engrave_hex'] or abs(L(m['engrave_hex'])-L(g['engrave_hex']))<25):
        rec.update(hex=m['engrave_hex'],source="sku-measured",n=m['n_px'])
    elif g and g['engrave_hex'] and g['measured']>=1 and g['engrave_hex'] not in ('#FFFFFF','#000000'):
        rec.update(hex=g['engrave_hex'],source="group-median",n=g['measured'])
    else:
        h,note=RULES.get(r['family'],('#BFBFBF','unknown family'))
        # colour-aware rule refinements
        if r['family']=='leatherette' and '/' in r['color']:
            core=r['color'].split('/')[-1]
            h={'Gold':gc[('leatherette','Black/Gold')]['engrave_hex'],'Silver':gc[('leatherette','Black/Silver')]['engrave_hex']}.get(core,h); note='core %s (rule from measured Black/%s)'%(core,core)
        rec.update(hex=h,source="rule",note=note)
    if r['family']=='glass': rec.update(frost=True,opacity=0.55,opacity_source="provisional - workshop photo on black card needed")
    out[s]=rec; src_count[rec['source']]+=1
# FOMA own products (foma-products.ts) — rule mapping by family/colour name
FOMA={
 'FM-KNIFE-TAC':('steel-powder','Black'),'FM-LTR-MONO':('steel-powder','Black'),
 'TM-FM-BLK':('steel-powder','Black'),'TM-FM-WHT':('steel-powder','White'),'TM-FM-CRM':('steel-powder','White'),
 'TM-FM-CHA':('steel-powder','Dark Gray'),'TM-FM-FOG':('steel-powder','Dark Gray'),'TM-FM-AZR':('steel-powder','Light Blue'),
 'TM-FM-EUC':('steel-powder','Light Blue'),'TM-FM-BAY':('steel-powder','Olive Green'),'TM-FM-LIL':('steel-powder','Light Purple'),
 'TM-FM-HPK':('steel-powder','Pink'),'TM-FM-ROS':('steel-powder','Coral'),'TM-FM-FRS':('steel-powder','Green'),
 'FM-CHAR-MARB-11':('slate','Charcoal Gray'),'FM-SERV-MARB-5':('slate','Charcoal Gray'),'FM-BBQ-11':('wood','Multi Brown'),
 'FM-DOPP-DL-BRN':('leatherette','Brown'),'FM-DOPP-SL-BRN':('leatherette','Brown'),'FM-RB-HEX':('wood','Walnut'),'FM-CHAR-BMB-1611':('steel-powder','Bamboo'),
}
for s,key in FOMA.items():
    g=gc.get(key); out[s]={"family":key[0],"color":key[1],"hex":g['engrave_hex'],"source":"group-median","n":g['measured'],"note":"FOMA own product mapped to JDS group by material/colour"}
    src_count['foma-group']+=1
json.dump(out,open(os.path.join(HERE,"engraving-colors.json"),"w"),indent=1,sort_keys=True)
print("skus",len(out),dict(src_count)); print("GLASS frost tint over white:",GLASS_HEX,"from",GLASS_N,"SKUs; steel silver:",STEEL_SILVER)
