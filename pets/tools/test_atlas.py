import tempfile
import unittest
from pathlib import Path

from atlas import assemble, extract, load_pack, verify


ROOT = Path(__file__).resolve().parents[1]


class AtlasTests(unittest.TestCase):
    def test_approved_assets_and_lossless_roundtrip(self):
        for name in ["skull-orb", "longbeak-gentleman"]:
            with self.subTest(pet=name), tempfile.TemporaryDirectory() as directory:
                folder = ROOT / name
                report = verify(folder)
                self.assertTrue(report["ok"], report)
                self.assertEqual(report["used_frames"], 73)
                self.assertEqual(report["empty_cells"], 15)
                output = Path(directory)
                extract(folder, output / "frames")
                rebuilt = assemble(folder, output / "frames", output / "roundtrip.png")
                _, original = load_pack(folder)
                self.assertEqual(rebuilt.tobytes(), original.tobytes())
                self.assertEqual(len(list((output / "frames").glob("*/*.png"))), 73)

    def test_registered_rows_match_atlas(self):
        from PIL import Image
        for name in ["skull-orb", "longbeak-gentleman"]:
            manifest, image = load_pack(ROOT / name)
            for row in manifest["animations"]:
                with self.subTest(pet=name, state=row["state"]):
                    with Image.open(ROOT / name / "source" / "registered-rows" / f"{row['state']}.png") as strip:
                        expected = image.crop((0, row["row"] * 208, 1536, (row["row"] + 1) * 208))
                        self.assertEqual(strip.tobytes(), expected.tobytes())


if __name__ == "__main__":
    unittest.main()
