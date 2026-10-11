# Prepare ONE user photo so it is safe to publish as a site background.
#
# WHY THIS SCRIPT EXISTS (PLAN.md ADR-11 / ADR-12, §10.2 A1)
#   This repository is PUBLIC. A photo straight from a phone carries EXIF: GPS
#   coordinates, capture time and device model. Committing it publishes the
#   shooting location, irreversibly. M-3 already hit this with the first photo
#   (GPS 36 deg 02' 59.4"N / 120 deg 20' 36.0"E in the original).
#   Therefore: never copy an original photo into public/ by hand. Always go
#   through this script (or `pnpm add:background`, which calls it).
#
# WHAT IT DOES
#   1. EXIF orientation applied if requested (--rotate). EXIF is the only place
#      the orientation lives, so it MUST be baked into pixels before the EXIF
#      is dropped, otherwise portrait photos come out sideways.
#   2. Long edge capped (default 2560 px, LANCZOS).
#   3. Saved as progressive JPEG (default q82) with NO metadata at all.
#   4. Re-opens the output and *verifies* EXIF tags == 0 and GPS IFD == 0.
#   5. Prints size + a brightness summary, and writes a JSON report on stdout's
#      "REPORT:" line so the Node caller can gate on it.
#
# Usage (normally called by scripts/background-photos.mjs, not by hand):
#   python scripts/prepare_photo.py --src <input> --dst <output.jpg> [--max 2560] [--quality 82] [--rotate]

import argparse
import json
import os
import sys

from PIL import Image, ImageOps, ImageStat


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True)
    ap.add_argument('--dst', required=True)
    ap.add_argument('--max', type=int, default=2560)
    ap.add_argument('--quality', type=int, default=82)
    ap.add_argument('--rotate', action='store_true',
                    help='bake EXIF orientation into pixels before dropping EXIF')
    ap.add_argument('--report', default=None,
                    help='also write the JSON report to this file (the Node caller uses it, '
                         'because capturing a child process stdout is not always available)')
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        print('FAIL: source not found: %s' % args.src)
        return 2

    src_bytes = os.path.getsize(args.src)
    im = Image.open(args.src)
    fmt = im.format
    src_size = im.size
    exif_before = len(im.getexif())
    gps_before = len(im.getexif().get_ifd(0x8825))

    if args.rotate:
        im = ImageOps.exif_transpose(im)
    elif im.getexif().get(0x0112):
        print('WARN: source carries EXIF orientation 0x%04X and --rotate was not given.'
              % im.getexif().get(0x0112))

    w, h = im.size
    long_edge = max(w, h)
    if long_edge > args.max:
        scale = args.max / long_edge
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)

    im = im.convert('RGB')
    os.makedirs(os.path.dirname(os.path.abspath(args.dst)), exist_ok=True)
    # No `exif=` argument at all => nothing is carried over.
    im.save(args.dst, 'JPEG', quality=args.quality, optimize=True, progressive=True)

    out = Image.open(args.dst)
    exif_after = len(out.getexif())
    gps_after = len(out.getexif().get_ifd(0x8825))
    dst_bytes = os.path.getsize(args.dst)

    # Brightness summary: mean luminance decides whether the light body text will still
    # pass WCAG AA on top of the --photo-dim layer.
    grey = out.convert('L').resize((64, 64), Image.BOX)
    stat = ImageStat.Stat(grey)
    mean = stat.mean[0]
    # p90 of the brightest 8x8 block = worst case for the sticky header band.
    # Pillow 12 deprecates Image.getdata(); prefer the replacement when it exists so this
    # helper stays quiet on both old and new Pillow.
    if hasattr(grey, 'get_flattened_data'):
        values = list(grey.get_flattened_data())
    else:
        values = list(grey.getdata())
    px = sorted(values, reverse=True)
    p90 = px[max(0, len(px) // 10 - 1)]

    report = {
        'src': os.path.abspath(args.src),
        'dst': os.path.abspath(args.dst),
        'sourceFormat': fmt,
        'sourceSize': list(src_size),
        'sourceBytes': src_bytes,
        'size': list(out.size),
        'bytes': dst_bytes,
        'exifTagsBefore': exif_before,
        'gpsEntriesBefore': gps_before,
        'exifTagsAfter': exif_after,
        'gpsEntriesAfter': gps_after,
        'meanLuma': round(mean, 2),
        'p90Luma': int(p90),
    }

    ok = exif_after == 0 and gps_after == 0
    print('source : %s %sx%s %s bytes (EXIF %d tags / GPS %d entries)'
          % (fmt, src_size[0], src_size[1], src_bytes, exif_before, gps_before))
    print('output : JPEG %dx%d %s bytes  meanLuma=%.2f p90Luma=%d'
          % (out.size[0], out.size[1], dst_bytes, mean, p90))
    print('EXIF after : %d tags / %d GPS entries  ->  %s'
          % (exif_after, gps_after, 'CLEAN' if ok else 'LEAK!'))
    print('REPORT:' + json.dumps(report))
    if args.report:
        with open(args.report, 'w', encoding='utf-8') as fh:
            json.dump(report, fh)
    return 0 if ok else 3


if __name__ == '__main__':
    sys.exit(main())
