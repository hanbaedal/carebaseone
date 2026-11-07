from PIL import Image, ImageFilter

logo_src = r"C:\Users\hanba\.cursor\projects\c-CAREBAND\assets\carebase-logo-hi.jpg"
icon_src = r"C:\Users\hanba\.cursor\projects\c-CAREBAND\assets\carebase-icon-hi.jpg"
public = r"C:\CAREBAND\public"
app = r"C:\CAREBAND\src\app"
assets = r"C:\Users\hanba\.cursor\projects\c-CAREBAND\assets"


def knockout(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    pixels = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            brightness = (r + g + b) / 3
            # black backdrop
            if brightness < 30 and max(r, g, b) < 40:
                pixels[x, y] = (0, 0, 0, 0)
                continue
            # white / light gray card
            if r > 232 and g > 232 and b > 232:
                pixels[x, y] = (0, 0, 0, 0)
                continue
            if r > 210 and g > 210 and b > 210 and abs(r - g) < 12 and abs(g - b) < 12:
                alpha = max(0, min(255, int((245 - brightness) * 10)))
                pixels[x, y] = (r, g, b, alpha)
    return im


def with_padding(im: Image.Image, top: float, side: float, bottom: float) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        raise SystemExit("empty image")
    content = im.crop(bbox)
    pad_x = max(20, int(content.height * side))
    pad_top = max(24, int(content.height * top))
    pad_bottom = max(20, int(content.height * bottom))
    out = Image.new(
        "RGBA",
        (content.width + pad_x * 2, content.height + pad_top + pad_bottom),
        (0, 0, 0, 0),
    )
    out.paste(content, (pad_x, pad_top), content)
    return out


logo = with_padding(knockout(Image.open(logo_src)), top=0.28, side=0.18, bottom=0.22)
if logo.width < 2000:
    scale = 2000 / logo.width
    logo = logo.resize(
        (int(logo.width * scale), int(logo.height * scale)),
        Image.Resampling.LANCZOS,
    )
logo = logo.filter(ImageFilter.UnsharpMask(radius=1.1, percent=80, threshold=2))
logo.save(f"{public}\\logo.png", optimize=False, compress_level=1)
logo.save(f"{assets}\\logo-from-mock.png", optimize=False, compress_level=1)

icon = with_padding(knockout(Image.open(icon_src)), top=0.22, side=0.22, bottom=0.22)
icon = icon.resize((1024, 1024), Image.Resampling.LANCZOS)
icon = icon.filter(ImageFilter.UnsharpMask(radius=1.0, percent=75, threshold=2))
icon.save(f"{public}\\icon.png", optimize=False, compress_level=1)
icon.save(f"{app}\\icon.png", optimize=False, compress_level=1)
icon.resize((180, 180), Image.Resampling.LANCZOS).save(
    f"{app}\\apple-icon.png", optimize=False, compress_level=1
)
icon.save(f"{assets}\\icon-from-mock.png", optimize=False, compress_level=1)

print("logo", logo.size, "icon", icon.size)
