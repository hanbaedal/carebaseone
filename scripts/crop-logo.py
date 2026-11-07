from PIL import Image, ImageFilter, ImageOps

src = r"C:\Users\hanba\.cursor\projects\c-CAREBAND\assets\KakaoTalk_20261030_142944092-f217b262-490b-42ae-b999-1ebed7d68057.jpg"
public = r"C:\CAREBAND\public"
app = r"C:\CAREBAND\src\app"
assets = r"C:\Users\hanba\.cursor\projects\c-CAREBAND\assets"

im = Image.open(src).convert("RGBA")

# Full top header band — start at y=0 so the C crown is not clipped by the mock crop
region = im.crop((8, 0, 280, 82))
pixels = region.load()
w, h = region.size

# Detect logo-colored pixels (blue family), keep soft edges
mask = Image.new("L", (w, h), 0)
mask_px = mask.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # Blue-ish brand pixels (icon + wordmark)
        is_blue = b > 120 and b > r + 15 and b > g + 5
        is_dark_blue = b > 80 and r < 90 and g < 110 and b > r + 20
        if is_blue or is_dark_blue:
            mask_px[x, y] = 255
        elif r > 210 and g > 210 and b > 210:
            mask_px[x, y] = 0
        else:
            # keep mid anti-alias fringe around logo
            if b > r and b > 90:
                mask_px[x, y] = 180

# Dilate mask slightly so tops/curves aren't shaved
mask = mask.filter(ImageFilter.MaxFilter(3))
mask = mask.filter(ImageFilter.GaussianBlur(0.6))

out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
out_px = out.load()
mask_px = mask.load()
for y in range(h):
    for x in range(w):
        alpha = mask_px[x, y]
        if alpha:
            r, g, b, _ = pixels[x, y]
            out_px[x, y] = (r, g, b, alpha)

bbox = out.getbbox()
if not bbox:
    raise SystemExit("logo not found")

logo = out.crop(bbox)

# Generous transparent padding so UI/CSS never clips the top
pad_x = max(12, logo.height // 4)
pad_top = max(16, logo.height // 3)
pad_bottom = max(12, logo.height // 4)
padded = Image.new(
    "RGBA",
    (logo.width + pad_x * 2, logo.height + pad_top + pad_bottom),
    (0, 0, 0, 0),
)
padded.paste(logo, (pad_x, pad_top), logo)

# Multi-step upscale for smoother edges
hi = padded
for _ in range(3):
    hi = hi.resize((hi.width * 2, hi.height * 2), Image.Resampling.LANCZOS)
hi = hi.filter(ImageFilter.UnsharpMask(radius=1.6, percent=130, threshold=1))

hi.save(f"{public}\\logo.png", optimize=False, compress_level=1)
hi.save(f"{assets}\\logo-from-mock.png", optimize=False, compress_level=1)

# Icon from left circular mark
icon_cut = logo.crop((0, 0, int(logo.height * 1.15), logo.height))
ib = icon_cut.getbbox()
icon_cut = icon_cut.crop(ib)
side = max(icon_cut.width, icon_cut.height)
margin = max(10, side // 6)
icon_canvas = Image.new("RGBA", (side + margin * 2, side + margin * 2), (0, 0, 0, 0))
icon_canvas.paste(
    icon_cut,
    (margin + (side - icon_cut.width) // 2, margin + (side - icon_cut.height) // 2),
    icon_cut,
)
icon_hi = icon_canvas
for _ in range(3):
    icon_hi = icon_hi.resize((icon_hi.width * 2, icon_hi.height * 2), Image.Resampling.LANCZOS)
icon_hi = icon_hi.resize((1024, 1024), Image.Resampling.LANCZOS)
icon_hi = icon_hi.filter(ImageFilter.UnsharpMask(radius=1.4, percent=120, threshold=1))
icon_hi.save(f"{public}\\icon.png", optimize=False, compress_level=1)
icon_hi.save(f"{app}\\icon.png", optimize=False, compress_level=1)
icon_hi.resize((180, 180), Image.Resampling.LANCZOS).save(
    f"{app}\\apple-icon.png", optimize=False, compress_level=1
)
icon_hi.save(f"{assets}\\icon-from-mock.png", optimize=False, compress_level=1)

print(
    "bbox",
    bbox,
    "logo",
    hi.size,
    "icon",
    icon_hi.size,
    "content",
    logo.size,
)
