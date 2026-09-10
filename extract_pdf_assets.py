import fitz
import os
import json
import re

pdf_path = 'SISTEMAS CUAUHTLI AGOSTO (1).pdf'
doc = fitz.open(pdf_path)

slides_dir = os.path.join('public', 'assets', 'slides')
os.makedirs(slides_dir, exist_ok=True)

posts_dir = os.path.join('public', 'assets', 'posts')
os.makedirs(posts_dir, exist_ok=True)

print("Rendering high-res slide images to public/assets/slides...")
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=150)
    pix.save(os.path.join(slides_dir, f'slide_{i+1:02d}.png'))

# Also extract individual images from pages
print("Extracting embedded creative images...")
img_count = 0
for i, page in enumerate(doc):
    il = page.get_images()
    for j, img in enumerate(il):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        # Save only if larger than 10KB to ignore tiny icons/dots
        if len(image_bytes) > 10000:
            img_filename = f'p{i+1:02d}_img{j+1:02d}.{image_ext}'
            with open(os.path.join(posts_dir, img_filename), "wb") as f:
                f.write(image_bytes)
            img_count += 1

print(f"Saved {img_count} high-res post images to public/assets/posts.")

# Extract texts per page
parsed_pages = []
for i, page in enumerate(doc):
    txt = page.get_text()
    parsed_pages.append({
        "pageNumber": i + 1,
        "text": txt.strip(),
        "lines": [l.strip() for l in txt.split("\n") if l.strip()]
    })

os.makedirs('src/data', exist_ok=True)
with open('src/data/raw_pdf_text.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_pages, f, indent=2, ensure_ascii=False)

print("Text extraction complete!")
