#!/usr/bin/env python3
"""逐页检查 dist/ 构建产物的 SEO 基本面。

用法：python3 scripts/audit-dist.py [dist目录] [站点origin]
检查项：每页恰好 1 个 title / canonical / description，canonical 等于自身 URL，
title 与 description 全站唯一，JSON-LD 可解析，内部链接与图片全部可解析到产物，
sitemap 中的 URL 都有对应页面。发现问题时以非零退出码结束。
"""
import json
import os
import re
import sys
from collections import defaultdict
from html.parser import HTMLParser
from urllib.parse import unquote, urlparse

DIST = sys.argv[1] if len(sys.argv) > 1 else "dist"
ORIGIN = sys.argv[2] if len(sys.argv) > 2 else "https://aurictrip.com"


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.titles, self.canonicals, self.descriptions, self.h1 = [], [], [], 0
        self.links, self.srcs, self.jsonld = [], [], []
        self._in_title = self._in_jsonld = False
        self._buf = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self._in_title, self._buf = True, ""
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonicals.append(a.get("href", ""))
        elif tag == "meta" and a.get("name") == "description":
            self.descriptions.append(a.get("content", ""))
        elif tag == "h1":
            self.h1 += 1
        elif tag == "a" and a.get("href"):
            self.links.append(a["href"])
        elif tag in ("img", "source") and (a.get("src") or a.get("srcset")):
            self.srcs.append((a.get("src") or a.get("srcset")).split()[0])
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_jsonld, self._buf = True, ""

    def handle_endtag(self, tag):
        if tag == "title" and self._in_title:
            self.titles.append(self._buf.strip())
            self._in_title = False
        elif tag == "script" and self._in_jsonld:
            self.jsonld.append(self._buf)
            self._in_jsonld = False

    def handle_data(self, data):
        if self._in_title or self._in_jsonld:
            self._buf += data


def url_for(rel):
    """dist 内文件相对路径 -> 线上规范 URL（无尾斜杠，build.format=file）。"""
    path = rel[:-5]  # 去掉 .html
    if path.endswith("/index"):
        path = path[: -len("/index")]
    if path == "index":
        path = ""
    return ORIGIN + ("/" + path if path else "/")


def resolves(path):
    path = unquote(path.split("#")[0].split("?")[0])
    if path in ("", "/"):
        return os.path.exists(os.path.join(DIST, "index.html"))
    p = path.lstrip("/")
    cands = [p, p + ".html", os.path.join(p, "index.html")]
    return any(os.path.isfile(os.path.join(DIST, c)) for c in cands)


problems = defaultdict(list)
by_title, by_desc = defaultdict(list), defaultdict(list)
pages = 0
for root, _, files in os.walk(DIST):
    for f in files:
        if not f.endswith(".html"):
            continue
        rel = os.path.relpath(os.path.join(root, f), DIST)
        if rel.startswith("_") or rel == "404.html":
            continue
        pages += 1
        html = open(os.path.join(root, f), encoding="utf-8").read()
        p = PageParser()
        p.feed(html)
        me = url_for(rel)
        for name, vals in (("title", p.titles), ("canonical", p.canonicals), ("description", p.descriptions)):
            if len(vals) != 1:
                problems[f"{name} 数量 != 1"].append(f"{rel} ({len(vals)})")
        if p.canonicals and unquote(p.canonicals[0]) != me:
            problems["canonical 不等于自身 URL"].append(f"{rel}: {p.canonicals[0]} != {me}")
        if p.h1 != 1:
            problems["h1 数量 != 1"].append(f"{rel} ({p.h1})")
        for t in p.titles:
            by_title[t].append(rel)
        for d in p.descriptions:
            by_desc[d].append(rel)
        for block in p.jsonld:
            try:
                json.loads(block)
            except ValueError as e:
                problems["JSON-LD 无法解析"].append(f"{rel}: {e}")
        for href in p.links + p.srcs:
            u = urlparse(href)
            if u.scheme in ("mailto", "tel", "javascript") or href.startswith("#"):
                continue
            if u.netloc and u.netloc not in urlparse(ORIGIN).netloc:
                continue
            if href.endswith("/") and len(u.path) > 1:
                problems["内部链接带尾斜杠（会 308）"].append(f"{rel}: {href}")
            if not resolves(u.path):
                problems["内部死链"].append(f"{rel}: {href}")
        if len(html.encode()) > 150_000:
            problems["HTML 超过 150KB"].append(f"{rel}: {len(html.encode())//1024}KB")

for t, rels in by_title.items():
    if len(rels) > 1:
        problems["title 重复"].append(f"{t!r}: {rels}")
for d, rels in by_desc.items():
    if len(rels) > 1:
        problems["description 重复"].append(f"{d!r}: {rels}")

sitemap = os.path.join(DIST, "sitemap.xml")
if os.path.exists(sitemap):
    locs = re.findall(r"<loc>([^<]+)</loc>", open(sitemap, encoding="utf-8").read())
    for loc in locs:
        if not resolves(urlparse(loc).path):
            problems["sitemap URL 无对应页面"].append(loc)
    print(f"sitemap URL 数：{len(locs)}")
else:
    problems["缺少 sitemap"].append(sitemap)

print(f"检查页面数：{pages}")
if not problems:
    print("全部通过 ✅")
for k, v in problems.items():
    print(f"\n❌ {k}：{len(v)}")
    for line in sorted(set(v))[:15]:
        print("   ", line)
sys.exit(1 if problems else 0)
