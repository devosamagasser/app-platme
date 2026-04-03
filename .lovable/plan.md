

# تعديل Footer و CTA Button

## المشكلة
1. "Guided Intelligence™" في الفوتر موجودة كـ link/status وهي مش محتاجة تكون رابط — دي branding مش صفحة
2. زرار "Request Early Access" في الـ CTA — المفروض يكون "Start Building" لأن المنصة شغالة فعلاً

## التغييرات

### 1. `src/components/landing/FinalCTA.tsx`
- في قسم **Status** (سطر 78-93): شيل "Guided Intelligence™" كعنصر منفصل وخليها بس في الـ bottom bar كـ branding text
- بدلها ممكن نحط حاجة مفيدة زي رابط "Documentation" أو "Contact" أو نشيل القسم ده خالص ونخلي الفوتر 2 columns بس

### 2. `src/i18n/en.json` (سطر 90)
- `"button": "Request Early Access"` → `"button": "Start Building"`

### 3. `src/i18n/ar.json` (سطر 90)
- `"button": "اطلب وصول مبكر"` → `"button": "ابدأ البناء"`

## النتيجة
- CTA button يقول "Start Building" / "ابدأ البناء"
- الفوتر أنظف بدون عنصر Guided Intelligence كـ رابط وهمي
