from pypdf import PdfReader
from pathlib import Path

Path("input/text").mkdir(parents=True, exist_ok=True)
for pdf in Path("input").glob("*.pdf"):
    reader = PdfReader(pdf)
    out = [f"## Slide {i}\n{(p.extract_text() or '').strip()}"
           for i, p in enumerate(reader.pages, 1)]
    Path("input/text", pdf.stem + ".md").write_text("\n\n".join(out), encoding="utf-8")
    print(pdf.name, len(reader.pages), "slides")