#!/usr/bin/env python3
"""Lossless asset utilities; never redraw, rescale, recolor, or recenter artwork."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image


def load_pack(folder: Path):
    manifest = json.loads((folder / "manifest.json").read_text(encoding="utf-8"))
    image = Image.open(folder / manifest["atlas"]["file"])
    image.load()
    return manifest, image


def verify(folder: Path):
    manifest, image = load_pack(folder)
    atlas = manifest["atlas"]
    expected_size = (atlas["columns"] * atlas["cell_width"], atlas["rows"] * atlas["cell_height"])
    digest = hashlib.sha256((folder / atlas["file"]).read_bytes()).hexdigest()
    errors = []
    if image.size != expected_size:
        errors.append(f"size {image.size} != {expected_size}")
    if image.mode != "RGBA":
        errors.append(f"mode {image.mode} != RGBA")
    if digest != atlas["sha256"]:
        errors.append("atlas SHA-256 differs from approved artifact")
    if errors:
        return {"ok": False, "errors": errors, "sha256": digest}
    used = 0
    transparent = 0
    for row in manifest["animations"]:
        for column in range(atlas["columns"]):
            frame = cell(image, atlas, row["row"], column)
            has_art = frame.getchannel("A").getbbox() is not None
            expected_art = column < row["frames"]
            if has_art != expected_art:
                errors.append(f"row {row['row']} column {column}: artwork presence mismatch")
            used += int(expected_art)
            transparent += int(not has_art)
    for file, expected in manifest["files_sha256"].items():
        path = folder / file
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            errors.append(f"asset checksum mismatch: {file}")
    return {"ok": not errors, "sha256": digest, "width": image.width,
            "height": image.height, "mode": image.mode, "used_frames": used,
            "empty_cells": transparent, "errors": errors}


def cell(image, atlas, row, column):
    w, h = atlas["cell_width"], atlas["cell_height"]
    return image.crop((column * w, row * h, (column + 1) * w, (row + 1) * h))


def extract(folder: Path, output: Path):
    report = verify(folder)
    if not report["ok"]:
        raise ValueError(report["errors"])
    manifest, image = load_pack(folder)
    for row in manifest["animations"]:
        target = output / row["state"]
        target.mkdir(parents=True, exist_ok=True)
        for column in range(row["frames"]):
            cell(image, manifest["atlas"], row["row"], column).save(target / f"{column:02}.png")


def assemble(folder: Path, frames: Path, output: Path):
    manifest, _ = load_pack(folder)
    atlas = manifest["atlas"]
    w, h = atlas["cell_width"], atlas["cell_height"]
    result = Image.new("RGBA", (atlas["columns"] * w, atlas["rows"] * h))
    for row in manifest["animations"]:
        for column in range(row["frames"]):
            with Image.open(frames / row["state"] / f"{column:02}.png") as frame:
                if frame.mode != "RGBA" or frame.size != (w, h):
                    raise ValueError("Frame must retain original RGBA mode and cell size")
                # Paste without an alpha mask to preserve every RGBA byte exactly.
                result.paste(frame, (column * w, row["row"] * h))
    if output.resolve() == (folder / atlas["file"]).resolve():
        raise ValueError("Choose a new output path; keep the approved atlas untouched")
    output.parent.mkdir(parents=True, exist_ok=True)
    result.save(output)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    check = commands.add_parser("verify")
    check.add_argument("pack", type=Path)
    unpack = commands.add_parser("extract")
    unpack.add_argument("pack", type=Path)
    unpack.add_argument("output", type=Path)
    pack = commands.add_parser("assemble")
    pack.add_argument("pack", type=Path)
    pack.add_argument("frames", type=Path)
    pack.add_argument("output", type=Path)
    args = parser.parse_args()
    if args.command == "verify":
        report = verify(args.pack)
        print(json.dumps(report, ensure_ascii=False, indent=2))
        raise SystemExit(0 if report["ok"] else 1)
    if args.command == "extract":
        extract(args.pack, args.output)
    else:
        assemble(args.pack, args.frames, args.output)


if __name__ == "__main__":
    main()
