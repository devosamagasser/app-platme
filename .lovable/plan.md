

# تغيير Hero Section + نقل Network Visual للـ IndustrySection

## الفكرة
- **Hero Section**: شيل الـ NetworkVisual وحط مكانها visual جديد — فكرة "AI Orchestrator" (Gomaa):
  - دائرة مركزية فيها أيقونة AI/brain مع pulse animation
  - خطوط بتطلع منها لـ 3-4 أيقونات صغيرة (تمثل: بناء، توصيل، نشر) بتظهر واحدة ورا واحدة
  - كأن الـ AI بيوزع المهام — شكل بسيط وأنيق، مش مزدحم
  - ممكن نص صغير تحت كل أيقونة (Analyze → Build → Deploy)

- **IndustrySection**: انقل الـ NetworkVisual (الـ nodes المترابطة) هنا بدل الـ radial layout الحالي — يبقى هو الـ visual الرئيسي للسكشن ده

## التغييرات

### 1. `src/components/landing/HeroSection.tsx`
- حذف `NetworkVisual`, `NODES`, `EDGES`, `PARTICLES` بالكامل
- إضافة component جديد `OrchestratorVisual`:
  - دائرة مركزية "Gomaa AI" مع animated pulse/glow
  - 3 عناصر حواليها (Analyze, Build, Deploy) بتظهر بالتتابع
  - خطوط animated بتوصل المركز بالعناصر
  - حركة بسيطة مستمرة (rotation خفيف أو floating)

### 2. `src/components/landing/IndustrySection.tsx`
- استبدال الـ radial layout الحالي بـ `NetworkVisual` المنقول من Hero
- نقل الـ NODES, EDGES, PARTICLES والـ component كامل هنا
- تعديل بسيط في الحجم ليناسب السكشن

### 3. `src/i18n/en.json` و `src/i18n/ar.json`
- إضافة مفاتيح للـ orchestrator steps (analyze, build, deploy)

