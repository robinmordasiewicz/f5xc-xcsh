#!/usr/bin/env python3
"""
Generate homebrew installation documentation with real version info.

Usage:
    python scripts/generate-homebrew-docs.py \
        --version 1.2.0 \
        --commit abc1234 \
        --built 2024-12-09T10:00:00Z \
        --output docs/install/homebrew.md
"""

import argparse
from datetime import datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader


def main():
    parser = argparse.ArgumentParser(
        description="Generate homebrew docs with real version info"
    )
    parser.add_argument("--version", help="vesctl version")
    parser.add_argument("--commit", help="Git commit hash")
    parser.add_argument("--built", help="Build timestamp")
    parser.add_argument(
        "--output",
        default="docs/install/homebrew.md",
        help="Output file path"
    )
    parser.add_argument(
        "--templates",
        default="scripts/templates",
        help="Templates directory"
    )

    args = parser.parse_args()

    # Setup Jinja2
    env = Environment(
        loader=FileSystemLoader(args.templates),
        trim_blocks=True,
        lstrip_blocks=True,
    )

    template = env.get_template("homebrew.md.j2")

    content = template.render(
        version=args.version,
        commit=args.commit,
        built=args.built,
        generation_date=datetime.utcnow().strftime("%Y-%m-%d"),
    )

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(content)

    print(f"Generated: {output_path}")
    if args.version:
        print(f"  Version: {args.version}")
        print(f"  Commit:  {args.commit}")
        print(f"  Built:   {args.built}")
    else:
        print("  (No version info provided, using template defaults)")


if __name__ == "__main__":
    main()
