from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
RESUME_JSON = ROOT / "public" / "resume" / "imtiaz-hossain-resume.json"
OUTPUT_PDF = ROOT / "public" / "resume" / "imtiaz-hossain-resume.pdf"


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    ink = colors.HexColor("#161616")
    muted = colors.HexColor("#666666")
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=22,
            leading=23,
            textColor=ink,
            spaceAfter=1.5,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=8.8,
            leading=10.2,
            textColor=ink,
            spaceAfter=1,
        ),
        "tagline": ParagraphStyle(
            "Tagline",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=9.7,
            leading=11,
            textColor=ink,
            spaceAfter=0,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=11.1,
            leading=12.2,
            textColor=ink,
            spaceAfter=1.5,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=9.5,
            leading=11.5,
            textColor=ink,
            spaceAfter=1,
        ),
        "skill_group": ParagraphStyle(
            "SkillGroup",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=9.35,
            leading=10.4,
            textColor=ink,
            spaceBefore=2.1,
            spaceAfter=0,
        ),
        "skill_line": ParagraphStyle(
            "SkillLine",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=8.85,
            leading=10.2,
            leftIndent=7,
            firstLineIndent=-4,
            textColor=ink,
            spaceAfter=0,
        ),
        "entry": ParagraphStyle(
            "Entry",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=9.65,
            leading=10.9,
            textColor=ink,
            spaceAfter=0,
        ),
        "date": ParagraphStyle(
            "Date",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=8.9,
            leading=10.9,
            alignment=TA_RIGHT,
            textColor=muted,
            spaceAfter=0,
        ),
        "org": ParagraphStyle(
            "Org",
            parent=base["Normal"],
            fontName="Times-Italic",
            fontSize=9.05,
            leading=10.2,
            textColor=ink,
            spaceAfter=0.6,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=9.15,
            leading=10.85,
            leftIndent=11,
            firstLineIndent=-7,
            textColor=ink,
            spaceAfter=0.9,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=8.9,
            leading=10.4,
            textColor=ink,
            spaceAfter=1,
        ),
    }


def section(story: list, title: str, styles: dict[str, ParagraphStyle], *, top: float = 4.5) -> None:
    story.append(Spacer(1, top))
    story.append(Paragraph(esc(title), styles["section"]))
    story.append(
        HRFlowable(
            width="100%",
            thickness=0.45,
            color=colors.HexColor("#333333"),
            spaceAfter=2.4,
        )
    )


def bullet(text: str, styles: dict[str, ParagraphStyle]) -> Paragraph:
    return Paragraph(f"- {esc(text)}", styles["bullet"])


def period_for(item: dict) -> str:
    period = item.get("startDate", "")
    if item.get("endDate"):
        period += f" - {item['endDate']}"
    return period


def entry_header(item: dict, styles: dict[str, ParagraphStyle], page_width: float) -> list:
    table = Table(
        [[
            Paragraph(esc(item["position"]), styles["entry"]),
            Paragraph(esc(period_for(item)), styles["date"]),
        ]],
        colWidths=[page_width - 3.45 * cm, 3.45 * cm],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return [table, Paragraph(esc(item["name"]), styles["org"])]


def add_work_entries(
    story: list,
    items: list[dict],
    styles: dict[str, ParagraphStyle],
    page_width: float,
) -> None:
    for index, item in enumerate(items):
        if index:
            story.append(Spacer(1, 3))
        highlights = item["highlights"]
        first_block = entry_header(item, styles, page_width)
        first_block.append(bullet(highlights[0], styles))
        story.append(KeepTogether(first_block))
        story.extend(bullet(text, styles) for text in highlights[1:])


def draw_page_number(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFont("Times-Roman", 8)
    canvas.setFillColor(colors.HexColor("#4F4F4F"))
    canvas.drawRightString(A4[0] - 1.2 * cm, 0.62 * cm, f"{doc.page}/2")
    canvas.restoreState()


def build_pdf() -> None:
    data = json.loads(RESUME_JSON.read_text(encoding="utf-8"))
    styles = make_styles()
    story: list = []

    left_margin = 1.2 * cm
    right_margin = 1.2 * cm
    top_margin = 0.88 * cm
    bottom_margin = 0.92 * cm
    page_width = A4[0] - left_margin - right_margin
    frame = Frame(
        left_margin,
        bottom_margin,
        page_width,
        A4[1] - top_margin - bottom_margin,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )

    basics = data["basics"]
    profiles = {profile["network"]: profile["url"] for profile in basics["profiles"]}

    story.append(Paragraph(esc(basics["name"]), styles["name"]))
    story.append(
        Paragraph(
            f'<a href="mailto:{esc(basics["email"])}">{esc(basics["email"])}</a> | '
            f'{esc(basics["phone"])} | Dhaka, Bangladesh',
            styles["contact"],
        )
    )
    story.append(
        Paragraph(
            '<a href="https://www.imtiazhossain.dev">imtiazhossain.dev</a> | '
            f'<a href="{profiles["GitHub"]}">GitHub</a> | '
            f'<a href="{profiles["LinkedIn"]}">LinkedIn</a> | '
            f'<a href="{profiles["Google Scholar"]}">Google Scholar</a>',
            styles["contact"],
        )
    )
    story.append(Paragraph(esc(basics["label"]), styles["tagline"]))

    section(story, "Summary", styles, top=4)
    story.append(Paragraph(esc(basics["summary"]), styles["body"]))

    section(story, "Technical Skills", styles)
    for skill in data["skills"]:
        story.append(Paragraph(esc(skill["name"]), styles["skill_group"]))
        for line in skill["keywords"]:
            story.append(Paragraph(f"- {esc(line)}", styles["skill_line"]))

    research_work = [item for item in data["work"] if item["section"] == "Research Experience"]
    section(story, "Research Experience", styles)
    add_work_entries(story, research_work, styles, page_width)

    engineering_work = [
        item for item in data["work"] if item["section"] == "Selected Engineering Projects"
    ]
    section(story, "Selected Engineering Projects", styles, top=0)
    add_work_entries(story, engineering_work, styles, page_width)

    section(story, "Additional Projects", styles)
    for project in data["projects"]:
        story.append(
            Paragraph(
                f'<b>{esc(project["name"])}:</b> {esc(project["description"])}',
                styles["small"],
            )
        )

    section(story, "Research Output", styles)
    for item in data["publications"]:
        story.append(
            Paragraph(
                f'<b>{esc(item["name"])}.</b> {esc(item["publisher"])}, '
                f'{esc(item["releaseDate"])}. {esc(item["summary"])}',
                styles["small"],
            )
        )

    section(story, "Education", styles)
    education = data["education"][0]
    education_table = Table(
        [
            [
                Paragraph(
                    f'<b>{esc(education["studyType"])} in {esc(education["area"])}</b>',
                    styles["small"],
                ),
                Paragraph(
                    f'{esc(education["startDate"])} - {esc(education["endDate"])}',
                    styles["date"],
                ),
            ],
            [
                Paragraph(
                    f'{esc(education["institution"])}, Dhaka, Bangladesh',
                    styles["small"],
                ),
                Paragraph(f'<b>{esc(education["score"])}</b>', styles["date"]),
            ],
        ],
        colWidths=[page_width - 3.45 * cm, 3.45 * cm],
    )
    education_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(education_table)
    story.append(
        Paragraph(
            f'Relevant coursework: {esc(", ".join(education["courses"]))}.',
            styles["small"],
        )
    )

    section(story, "Teaching & Leadership", styles)
    for item in data["volunteer"]:
        period = period_for(item) or "Leadership experience"
        story.extend(
            entry_header(
                {
                    "position": item["position"],
                    "name": item["organization"],
                    "startDate": period,
                },
                styles,
                page_width,
            )
        )
        story.append(Paragraph(esc(item["summary"]), styles["small"]))

    section(story, "Honors & Certifications", styles)
    honors = " | ".join(
        f'{item["title"]} ({item["awarder"]})' for item in data["awards"]
    )
    certificates = " | ".join(
        f'{item["name"]} - {item["issuer"]}' for item in data["certificates"]
    )
    story.append(Paragraph(esc(honors), styles["small"]))
    story.append(Paragraph(esc(certificates), styles["small"]))

    doc = BaseDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        leftMargin=left_margin,
        rightMargin=right_margin,
        topMargin=top_margin,
        bottomMargin=bottom_margin,
        title="Resume - Imtiaz Hossain",
        author="Imtiaz Hossain",
    )
    doc.addPageTemplates(PageTemplate(id="resume", frames=[frame], onPage=draw_page_number))
    doc.build(story)


if __name__ == "__main__":
    build_pdf()
