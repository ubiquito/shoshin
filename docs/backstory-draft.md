# Backstory Draft

**Status:** Draft for review
**Date:** 2026-04-27
**Intent:** Internal narrative. Could be adapted for a Gumroad long-form description, a blog post, a colophon page, or the preface of the printed book. Honest rather than polished.

---

## How Shoshin Was Made

The study came first. The code came after.

Shoshin started as a personal practice — a set of exercises drawn from Shunryu Suzuki's *Zen Mind, Beginner's Mind*, arranged into twelve weeks. Not a reading programme. Each week asked for something physical: a breath pattern, a posture held for one minute, three minutes of silence, a word written on a page and then burned. The kind of thing you can only do by doing it.

At some point the question became: what if someone else could use these?

Not as an app. Not as a course with modules and progress bars and a completion certificate. The whole point of beginner's mind is that you don't graduate from it. The tool needed to get out of the way.

---

The entire project was built in a weekend in April 2026. One sitting produced all twelve practice tools — singing bowls synthesised from the Web Audio API, a breathing circle, a calligraphy engine on canvas, a bonfire that burns your words, a silent timer that does nothing but count. Thirty-three files, three thousand lines. Static HTML. No framework.

The author's git identity reads `Peacemaker <peacemaker@haiku-lab.local>`. The seller name on Gumroad is fractalvortex. Make of that what you will.

The access model is as minimal as the practice: you buy a key, the key opens the door. No account. No password. No database. An HttpOnly cookie and a Cloudflare KV store. The entire auth system could be explained on an index card.

---

During the same week the practice tools were being built, the same machine was running an automated paper trading bot — cryptocurrency and equities, live on Cloudflare Workers, monitored from a phone. The author was tuning trailing stop algorithms in one terminal and arranging singing bowl frequencies in another.

This is not a contradiction. Beginner's mind is not the opposite of worldly engagement. Suzuki writes about it as the willingness to approach anything — the familiar, the complex, the frightening — without the armour of expertise. You can sit in silence for three minutes and then go read a candlestick chart. The posture is the same: attend to what is actually happening.

The trading bot and the Zen course were built with the same tools, from the same directory, in the same week. One watches markets. The other watches breath. Both require you to notice when you've started telling yourself a story instead of looking at what's in front of you.

---

The name comes from the Japanese 初心 — "beginner's mind." Suzuki's student who doesn't yet know what to expect, and so is open to everything. The twelve weeks are not a journey from ignorance to mastery. They are twelve different ways of arriving at the same place you already are.

The course was built for sale, but the design resists the transactional. There is no upsell, no community, no follow-up sequence. You buy the key. You use the tools. If they are useful, they are useful. If they are not, they taught you that.

Nothing special.

---

### Colophon

Built with Claude (Opus 4.6) as co-author and pair programmer. Hosted on Cloudflare Pages. Sold through Gumroad. Set in Georgia on rice paper (#f8f6f1) and ink (#1a1a1a).

The printed edition, when it arrives, will be the same twelve weeks in a form you can hold. Paper instead of pixels. The practice doesn't change.
