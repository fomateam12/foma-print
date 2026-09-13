"""Step 1: live fomaprint SKUs -> (family, colour) groups from JDS master."""
import json,re,csv,collections,os
HERE=os.path.dirname(os.path.abspath(__file__)); REPO=r"C:\Users\akify\fomaprint-engrave"
p=json.load(open(os.path.join(REPO,"src/data/products.json"),encoding='utf-8'))['products']
src=open(os.path.join(REPO,"src/data/catalog.ts"),encoding='utf-8').read()
removed=set(re.findall(r'"([^"]+)"',re.search(r'const REMOVED_SKUS = new Set<string>\(\[(.*?)\]\)',src,re.S).group(1)))
addblk=re.search(r'const ADDED_PRODUCTS: RawProduct\[\] = \[(.*?)\n\];',src,re.S).group(1)
added=re.findall(r'sku:\s*"([^"]+)"',addblk)
sub={}
for m in re.finditer(r'sku:\s*"([^"]+)"[^}]*?subSlug:\s*"([^"]+)"',addblk,re.S): sub[m.group(1).upper()]=m.group(2)
for it in p: sub.setdefault(it['sku'].upper(),it['subSlug'])
live=list(dict.fromkeys([it['sku'].upper() for it in p if it['sku'].upper() not in removed]+[s.upper() for s in added]))
master={}
with open(os.path.join(HERE,"jds-master.csv"),encoding='utf-8',errors='ignore',newline='') as f:
    for row in csv.DictReader(f): master[row['ITEM'].strip().upper()]=row
def family(mat,sku,name):
    m=mat.lower()
    if 'glass' in m and 'lazerburst' not in m and 'alder' not in m and 'slate' not in m: return 'glass'
    if 'lazerburst' in m: return 'lazerburst'
    if 'slate' in m: return 'slate'
    if 'ceramic' in m: return 'ceramic'
    if 'acrylic' in m: return 'acrylic'
    if 'anodized' in m or m.startswith('aluminum'): return 'aluminum'
    if 'leather' in m or 'laeather' in m: return 'leatherette'
    if 'powder' in m: return 'steel-powder'
    if 'stainless' in m: return 'steel-powder' if re.search(r'\b(powder|coated)\b',name.lower()) or True else 'steel'
    if any(w in m for w in ('bamboo','alder','maple','walnut','wood','rosewood','mdf')): return 'wood'
    if 'brass' in m: return 'brass'
    if 'plastic' in m or 'rubber' in m or 'silicone' in m: return 'plastic'
    return 'other:'+mat
def color(c):
    c=c.strip(); c=re.sub(r'\s*/\s*','/',c); c=c.replace('Purlple','Purple').replace('Ghst Blk','Ghost Black').replace('Ghost Blk','Ghost Black').replace('Blk/Silv','Black/Silver')
    c=re.sub(r'Football ?\((Brown)\)','Football',c); c=re.sub(r'Basketball ?\((Orange)\)','Basketball',c)
    c=c.replace('Blue/silver','Blue/Silver').replace('Red alder','Red Alder')
    return ' '.join(w if w[0].isupper() else w.capitalize() for w in c.split(' ')) if c else '(none)'
rows=[]
for s in live:
    r=master[s]; fam=family(r['MATERIAL'],s,r['SHORT DESCRIPTION']); col=color(r['COLOR'])
    # leatherette/wood: JDS COLOR hides the core; the product name carries 'Black/Gold', 'Blue/Silver', 'Rustic/Gold'...
    nm=r['SHORT DESCRIPTION']+' '+r['DESCRIPTION 2']
    mm=re.search(r'(?<![A-Za-z])([A-Z][a-z]+(?: [A-Z][a-z]+)?)/(Gold|Silver|Black|White|Gray)(?![a-z])',nm)
    if mm and '/' not in col and fam in ('leatherette','wood','steel-powder'): col=color(mm.group(1)+'/'+mm.group(2))
    rows.append({"sku":s,"family":fam,"color":col,"material_raw":r['MATERIAL'].strip(),"color_raw":r['COLOR'].strip(),"class":r['CLASS'].strip(),"sub":sub.get(s,''),"name":r['SHORT DESCRIPTION'].strip()[:60]})
json.dump(rows,open(os.path.join(HERE,"groups.json"),"w"),indent=0)
g=collections.Counter((r['family'],r['color']) for r in rows)
print("skus",len(rows),"groups",len(g)); fams=collections.Counter(r['family'] for r in rows); print(fams.most_common())
with open(os.path.join(HERE,"engrave-groups.csv"),"w",newline='',encoding='utf-8') as f:
    w=csv.writer(f); w.writerow(["family","color","sku_count","example_skus"])
    for (fam,c),n in sorted(g.items(),key=lambda x:(x[0][0],-x[1])):
        w.writerow([fam,c,n,' '.join(r['sku'] for r in rows if (r['family'],r['color'])==(fam,c))[:80]])
for (fam,c),n in sorted(g.items(),key=lambda x:(x[0][0],-x[1])): print(n,fam,c)
