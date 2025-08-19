from __future__ import annotations

import os
import sys
import argparse
from pathlib import Path
from typing import Dict, Any

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen

FIGMA_API_BASE = "https://api.figma.com/v1"


def http_get(url: str, headers: Dict[str, str], params: Dict[str, str] | None = None) -> Any:
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers=headers)
    with urlopen(req, timeout=30) as resp:  # type: ignore[call-arg]
        return json.load(resp)


def fetch_figma_file(token: str, file_key: str) -> Dict[str, Any]:
    """Fetch raw file data from Figma REST API."""
    url = f"{FIGMA_API_BASE}/files/{file_key}"
    headers = {"X-Figma-Token": token}
    return http_get(url, headers)


def rgb_to_css(color: Dict[str, float]) -> str:
    """Convert Figma RGB color dict to CSS rgb() string."""
    r = int(round(color.get("r", 0) * 255))
    g = int(round(color.get("g", 0) * 255))
    b = int(round(color.get("b", 0) * 255))
    a = color.get("a", 1)
    if a < 1:
        return f"rgba({r}, {g}, {b}, {a:.2f})"
    return f"rgb({r}, {g}, {b})"


def resolve_style_color(token: str, file_key: str, node_id: str) -> str | None:
    """Resolve a style's color by inspecting one node that uses it."""
    url = f"{FIGMA_API_BASE}/files/{file_key}/nodes"
    headers = {"X-Figma-Token": token}
    data = http_get(url, headers, {"ids": node_id}).get("nodes", {}).get(node_id, {})
    document = data.get("document", {})
    fills = document.get("fills") or []
    if not fills:
        return None
    paint = fills[0]
    if paint.get("type") != "SOLID":
        return None
    color = paint.get("color", {})
    return rgb_to_css(color)


def generate_css(styles: Dict[str, Any], token: str, file_key: str) -> str:
    lines = ["/* Generated from Figma styles */", ":root {"]
    for style_id, style in styles.items():
        var_name = style["name"].strip().lower().replace(" ", "-")
        node_id = style.get("node_id")
        color = resolve_style_color(token, file_key, node_id) if node_id else None
        if color:
            lines.append(f"  --{var_name}: {color};")
    lines.append("}")
    return "\n".join(lines)


def generate_component_react(name: str) -> str:
    name = name.replace(" ", "")
    return (
        "import React from 'react';\n\n"
        f"export const {name} = () => (\n    <div>{name} from Figma</div>\n);\n"
    )


def generate_component_vue(name: str) -> str:
    name = name.replace(" ", "")
    return (
        "<template>\n  <div>" + name + " from Figma</div>\n</template>\n"
        "<script>\nexport default {\n  name: '" + name + "'\n};\n</script>\n"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Import Figma components and styles")
    parser.add_argument(
        "--framework",
        choices=["react", "vue", "css"],
        default="css",
        help="Output format",
    )
    parser.add_argument(
        "--outdir", default="figma_output", help="Directory to write generated files"
    )
    args = parser.parse_args()

    token = os.getenv("FIGMA_TOKEN")
    file_key = os.getenv("FIGMA_FILE_KEY")
    if not token or not file_key:
        sys.exit("FIGMA_TOKEN and FIGMA_FILE_KEY environment variables are required")

    data = fetch_figma_file(token, file_key)
    components = data.get("components", {})
    styles = data.get("styles", {})

    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    if args.framework == "css":
        css = generate_css(styles, token, file_key)
        (outdir / "figma-styles.css").write_text(css, encoding="utf-8")
    else:
        for comp_id, comp in components.items():
            name = comp.get("name", f"Component{comp_id}")
            if args.framework == "react":
                content = generate_component_react(name)
                ext = "jsx"
            else:
                content = generate_component_vue(name)
                ext = "vue"
            (outdir / f"{name.replace(' ', '')}.{ext}").write_text(
                content, encoding="utf-8"
            )

    print(f"Generated assets in {outdir}")


if __name__ == "__main__":
    main()
