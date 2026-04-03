

# خطة التحسينات — 5 مهام متتالية

## المهمة 1: تحسين Hero Section بـ animation تفاعلية
**الملف:** `src/components/landing/HeroSection.tsx`

- إعادة بناء `NetworkVisual` بالكامل:
  - Nodes تفاعلية بتتحرك عشوائياً (floating animation مع framer-motion)
  - كل node عليها label (مثلاً: LMS, CRM, E-Commerce) بتمثل أنظمة PLATME
  - الخطوط بين الـ nodes بتتكون تدريجياً (animated connections)
  - Hover على node يعمل glow effect ويبرز الخطوط المتصلة بيها
  - Particles خفيفة في الخلفية بتتحرك
- تحسين النص: إضافة typing effect أو word-by-word animation للعنوان
- إضافة ترجمة labels الـ nodes في `en.json` و `ar.json`

---

## المهمة 2: Onboarding Wizard لأول مرة
**ملفات جديدة:** `src/components/onboarding/OnboardingWizard.tsx`

- 3-4 خطوات قصيرة (Dialog/Modal):
  1. مرحباً بك في PLATME — شرح سريع
  2. اختر نظامك الأول
  3. كيف يعمل الـ Composer
  4. ابدأ الآن
- تخزين `platme_onboarding_done` في `localStorage` — يظهر مرة واحدة فقط
- Progress dots في الأسفل + Skip button
- يظهر تلقائياً في صفحة `/select` أو `/` لأول مرة

---

## المهمة 3: Dark/Light Mode
**الملفات:**
- `src/index.css` — إضافة `:root` light theme variables
- `tailwind.config.ts` — `darkMode: ["class"]` (موجود بالفعل)
- `src/components/ThemeToggle.tsx` — زر تبديل الثيم
- `src/components/landing/LandingNav.tsx` و `src/components/LanguageSwitcher.tsx` — إضافة الزر

- إضافة CSS variables لـ light mode تحت `.light` أو `:root` بدون class
- تخزين التفضيل في `localStorage`
- ألوان Light: خلفية بيضاء/رمادية فاتحة، نصوص داكنة، primary يفضل emerald/forest بدل mint

---

## المهمة 4: تحسين Composer Graph UX
**الملف:** `src/components/composer/CenterPanel.tsx`

- **Minimap:** مربع صغير في الزاوية يوري نظرة عامة على كل الـ nodes مع مؤشر الـ viewport الحالي
- **Zoom controls أوضح:** أزرار +/- أكبر مع slider للزوم + زر "Fit All" يرجع الـ view لعرض كل الـ nodes
- **ألوان مختلفة لكل category:** خريطة ألوان (مثلاً: Core=mint, Content=blue, Assessment=amber, Communication=purple) مع legend صغير
- **تحسين الخطوط:** curved lines (bezier) بدل خطوط مستقيمة + animated flow

---

## المهمة 5: Mobile Responsive لـ Configure و Dashboard
**الملفات:** `src/pages/Configure.tsx`, `src/pages/Dashboard.tsx`

- **Configure:** تحويل الـ grid layout لـ single column على الموبايل، تصغير الـ sliders، stack الـ owner fields عمودياً
- **Dashboard:** الـ platforms cards تبقى full-width على الموبايل، تصغير الـ nav، إخفاء عناصر ثانوية
- اختبار على viewport أقل من 768px
- التأكد إن كل الـ buttons و inputs سهلة اللمس (min 44px touch target)

---

## ترتيب التنفيذ
1. Hero Section (تأثير بصري فوري)
2. Onboarding Wizard
3. Dark/Light Mode
4. Composer Graph UX
5. Mobile Responsive

هبدأ بالمهمة الأولى بعد الموافقة.

