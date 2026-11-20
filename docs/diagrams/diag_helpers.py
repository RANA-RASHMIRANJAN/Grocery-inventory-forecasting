"""Shared drawing helpers for the project's black-and-white academic diagrams.

Coordinate system: inches. Every diagram canvas is `W` x `H` inches,
x = 0..W (left to right), y = 0..H (bottom to top).
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import (
    FancyBboxPatch, Rectangle, FancyArrowPatch, Circle, Ellipse, Polygon,
)

plt.rcParams["font.family"] = "serif"
plt.rcParams["font.serif"] = ["Times New Roman"]
plt.rcParams["font.size"] = 9
plt.rcParams["text.color"] = "black"
plt.rcParams["axes.edgecolor"] = "black"

EC = "black"
LW = 1.0


def fig_ax(w, h):
    fig = plt.figure(figsize=(w, h), dpi=300)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, w)
    ax.set_ylim(0, h)
    ax.axis("off")
    return fig, ax


def box(ax, x, y, w, h, text="", fs=9, bold=False, rounded=None, fc="white",
        ec=EC, lw=LW, dashed=False, align="center", va="center", pad=0.04,
        text_dy=0.0):
    """Draw a rectangle (optionally rounded). y = bottom edge."""
    if rounded:
        style = f"round,pad=0,rounding_size={rounded}"
    else:
        style = "square,pad=0"
    p = FancyBboxPatch((x, y), w, h, boxstyle=style, fc=fc, ec=ec, lw=lw,
                       linestyle="--" if dashed else "-")
    ax.add_patch(p)
    if text:
        tx = x + w / 2 if align == "center" else x + pad
        if va == "center":
            ty = y + h / 2 + text_dy
            tva = "center"
        else:  # top-left aligned text block
            ty = y + h - pad + text_dy
            tva = "top"
        ha = "center" if align == "center" else "left"
        ax.text(tx, ty, text, fontsize=fs, ha=ha, va=tva,
                fontweight="bold" if bold else "normal", linespacing=1.25)
    return p


def band(ax, x, y, w, h, title, fs=9.5, fc="#f2f2f2", title_dy=0.16):
    """Light-gray container band with a bold centered title at its top."""
    box(ax, x, y, w, h, rounded=0.07, fc=fc, lw=LW)
    ax.text(x + w / 2, y + h - title_dy, title, fontsize=fs, ha="center",
            va="center", fontweight="bold")


def arrow(ax, x1, y1, x2, y2, label=None, fs=8, label_t=0.5, dx=0.0, dy=0.0,
          ha="center", va="center", lw=LW, dashed=False, ms=10,
          connstyle=None, label_bg=True, label_ha=None):
    """Straight (or angled) arrow with optional label at fraction label_t."""
    a = FancyArrowPatch((x1, y1), (x2, y2),
                        arrowstyle="-|>", mutation_scale=ms, lw=lw,
                        color=EC, linestyle="--" if dashed else "-",
                        shrinkA=1.0, shrinkB=1.0,
                        connectionstyle=connstyle or "arc3,rad=0")
    ax.add_patch(a)
    if label:
        lx = x1 + (x2 - x1) * label_t + dx
        ly = y1 + (y2 - y1) * label_t + dy
        bb = dict(fc="white", ec="none", pad=1.0) if label_bg else None
        ax.text(lx, ly, label, fontsize=fs, ha=label_ha or ha, va=va, bbox=bb,
                linespacing=1.15)
    return a


def line(ax, x1, y1, x2, y2, lw=LW, dashed=False):
    ax.plot([x1, x2], [y1, y2], color=EC, lw=lw,
            linestyle="--" if dashed else "-", solid_capstyle="round")


def polyline_arrow(ax, pts, label=None, fs=8, label_at=0.5, lw=LW,
                   dashed=False):
    """Orthogonal polyline whose final segment ends in an arrowhead."""
    for i in range(len(pts) - 2):
        line(ax, *pts[i], *pts[i + 1], lw=lw, dashed=dashed)
    arrow(ax, *pts[-2], *pts[-1], lw=lw, dashed=dashed)
    if label:
        # place label near the first segment midpoint
        x = pts[0][0] + (pts[1][0] - pts[0][0]) * 0.5
        y = pts[0][1] + (pts[1][1] - pts[0][1]) * 0.5
        ax.text(x, y, label, fontsize=fs, ha="center", va="center",
                bbox=dict(fc="white", ec="none", pad=1.0))


def diamond(ax, cx, cy, w, h, text="", fs=8):
    pts = [(cx, cy + h / 2), (cx + w / 2, cy), (cx, cy - h / 2), (cx - w / 2, cy)]
    ax.add_patch(Polygon(pts, closed=True, fc="white", ec=EC, lw=LW))
    ax.text(cx, cy, text, fontsize=fs, ha="center", va="center",
            linespacing=1.2)


def circle_proc(ax, cx, cy, r, num, name, fs=8.5, num_fs=8.5):
    """Yourdon/DeMarco DFD process circle."""
    ax.add_patch(Circle((cx, cy), r, fc="white", ec=EC, lw=LW))
    ax.text(cx, cy + r * 0.35, num, fontsize=num_fs, ha="center", va="center",
            fontweight="bold")
    ax.text(cx, cy - r * 0.18, name, fontsize=fs, ha="center", va="center",
            linespacing=1.15)


def data_store(ax, x, y, w, h, label, sub="", fs=8.5):
    """Open-ended rectangle data store (left edge closed, right edge open)."""
    ax.add_patch(Polygon([(x, y), (x, y + h)], closed=False, fc="none", ec=EC, lw=LW))
    line(ax, x, y, x + w, y)
    line(ax, x, y + h, x + w, y + h)
    if sub:
        line(ax, x + 0.30, y, x + 0.30, y + h)
        ax.text(x + 0.15, y + h / 2, sub, fontsize=fs, ha="center", va="center",
                fontweight="bold")
        ax.text(x + 0.30 + (w - 0.30) / 2, y + h / 2, label, fontsize=fs,
                ha="center", va="center")
    else:
        ax.text(x + w / 2, y + h / 2, label, fontsize=fs, ha="center",
                va="center")


def external_entity(ax, x, y, w, h, text, fs=8.5):
    box(ax, x, y, w, h, text, fs=fs, align="center")


def cylinder(ax, cx, cy, w, h, text, fs=8.5):
    """Database cylinder. (cx, cy) = center."""
    ew = w * 0.30
    body_h = h - h * 0.14
    ax.add_patch(Rectangle((cx - w / 2, cy - body_h / 2), w, body_h,
                           fc="white", ec="none"))
    line(ax, cx - w / 2, cy - body_h / 2, cx - w / 2, cy + body_h / 2)
    line(ax, cx + w / 2, cy - body_h / 2, cx + w / 2, cy + body_h / 2)
    ax.add_patch(Ellipse((cx, cy + body_h / 2), w, h * 0.14, fc="white", ec=EC, lw=LW))
    ax.add_patch(Ellipse((cx, cy - body_h / 2), w, h * 0.14, fc="white", ec=EC, lw=LW))
    # erase the top half of the bottom ellipse
    ax.add_patch(Rectangle((cx - w / 2 + 0.001, cy - body_h / 2), w - 0.002,
                           body_h / 2 - 0.001, fc="white", ec="none"))
    line(ax, cx - w / 2, cy - body_h / 2, cx - w / 2, cy + body_h / 2)
    line(ax, cx + w / 2, cy - body_h / 2, cx + w / 2, cy + body_h / 2)
    ax.add_patch(Ellipse((cx, cy + body_h / 2), w, h * 0.14, fc="white", ec=EC, lw=LW))
    ax.text(cx, cy, text, fontsize=fs, ha="center", va="center", linespacing=1.25)


def start_end(ax, cx, cy, label=None, r=0.065, kind="start"):
    if kind == "start":
        ax.add_patch(Circle((cx, cy), r, fc=EC, ec=EC))
    else:
        ax.add_patch(Circle((cx, cy), r, fc="white", ec=EC, lw=LW))
        ax.add_patch(Circle((cx, cy), r * 0.62, fc=EC, ec=EC))
    if label:
        ax.text(cx + 0.18, cy, label, fontsize=8.5, ha="left", va="center")


def actor(ax, cx, cy, label, scale=1.0):
    """UML stick-figure actor centered at (cx, cy); label below."""
    s = scale
    ax.add_patch(Circle((cx, cy + 0.42 * s), 0.115 * s, fc="white", ec=EC, lw=LW))
    line(ax, cx, cy + 0.30 * s, cx, cy - 0.10 * s)          # body
    line(ax, cx - 0.17 * s, cy + 0.14 * s, cx + 0.17 * s, cy + 0.14 * s)  # arms
    line(ax, cx, cy - 0.10 * s, cx - 0.14 * s, cy - 0.42 * s)  # left leg
    line(ax, cx, cy - 0.10 * s, cx + 0.14 * s, cy - 0.42 * s)  # right leg
    ax.text(cx, cy - 0.62 * s, label, fontsize=9, ha="center", va="top",
            fontweight="bold", linespacing=1.2)


def usecase(ax, cx, cy, w, h, text, fs=8):
    ax.add_patch(Ellipse((cx, cy), w, h, fc="white", ec=EC, lw=LW))
    ax.text(cx, cy, text, fontsize=fs, ha="center", va="center", linespacing=1.15)


def note(ax, x, y, w, h, text, fs=7.5):
    box(ax, x, y, w, h, text, fs=fs, dashed=True, align="left", va="top",
        rounded=0.04)


def entity_box(ax, x, y, w, title, attrs, fs=8.2, row_h=0.225, header_h=0.30,
               pk_underscore=True):
    """ER entity: bold header + attribute rows."""
    h = header_h + row_h * len(attrs)
    box(ax, x, y, w, h, fc="white")
    line(ax, x, y + h - header_h, x + w, y + h - header_h, lw=LW)
    ax.text(x + w / 2, y + h - header_h / 2, title, fontsize=fs + 0.5,
            ha="center", va="center", fontweight="bold")
    for i, a in enumerate(attrs):
        ry = y + h - header_h - row_h * (i + 1)
        if i > 0:
            line(ax, x, ry + row_h, x + w, ry + row_h, lw=0.5)
        ax.text(x + 0.10, ry + row_h / 2, a, fontsize=fs, ha="left", va="center")
    return h


def save(fig, path):
    fig.savefig(path, dpi=300, facecolor="white", bbox_inches=None)
    plt.close(fig)
    print("saved", path)
