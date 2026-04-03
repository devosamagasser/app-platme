

# تحسين Composer Graph UX + تغيير الاسم

## تغيير الاسم
الاسم الحالي: "Guided Intelligence™ Composer" / "Architecture Canvas"
الاسم الجديد المقترح: **"System Studio"** — أبسط وأوضح، بيعبّر إن المستخدم بيصمم النظام بتاعه.

- Header: "System Studio" بدل "Guided Intelligence™ Composer"
- Canvas label: "System Blueprint" بدل "Architecture Canvas"
- عربي: "استوديو النظام" / "مخطط النظام"

## تحسينات الـ Graph UX

### 1. ألوان مختلفة لكل Category
كل category هتاخد لون مميز (mint للـ LMS, blue للـ Content, amber للـ Communication, etc.) — الـ node border و الـ category label هيتلونوا.

### 2. Minimap
مربع صغير (150x100px) في corner فيه overview مصغر للـ graph كله — بيوضح الـ viewport الحالي كمستطيل شفاف.

### 3. Zoom Controls أحسن
- أزرار zoom أكبر وأوضح مع icons (ZoomIn/ZoomOut من lucide)
- زرار "Fit to View" يرجع الـ zoom والـ pan للوضع الافتراضي
- عرض النسبة بشكل أوضح

### 4. تحسين شكل الـ Nodes
- أيقونة صغيرة لكل category جوه الـ node
- شريط لوني علوي (color bar) على الـ node بلون الـ category
- hover effect أقوى مع subtle shadow

### 5. تحسين الـ Edges
- Curved lines (bezier) بدل خطوط مستقيمة
- Animated gradient على الخطوط النشطة

## الملفات المتأثرة
1. **`src/components/composer/CenterPanel.tsx`** — Minimap, category colors, curved edges, improved nodes, better zoom controls
2. **`src/components/composer/ComposerHeader.tsx`** — تغيير الاسم
3. **`src/i18n/en.json`** — تحديث النصوص
4. **`src/i18n/ar.json`** — تحديث النصوص العربية
5. **`src/pages/Composer.tsx`** — تمرير fit-to-view callback

