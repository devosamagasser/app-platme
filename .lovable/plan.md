

# تحويل Hero Visual لـ AI Orchestrator (Gomaa)

## الفكرة
استبدال الـ NetworkVisual الحالي بـ visual جديد بسيط وأنيق: دائرة مركزية "Gomaa AI" مع 3 خطوات (Analyze → Build → Deploy) بتظهر بالتتابع وخطوط animated بتوصلهم.

## التغييرات

### 1. `src/components/landing/HeroSection.tsx`
- **حذف**: `NODES`, `EDGES`, `PARTICLES`, `NetworkVisual` بالكامل
- **إضافة** `OrchestratorVisual` component جديد:
  - دائرة مركزية كبيرة فيها أيقونة Brain + نص "Gomaa" مع pulse animation مستمر (ring بيكبر ويختفي)
  - 3 أيقونات صغيرة حوالين المركز (Search/Analyze, Hammer/Build, Rocket/Deploy)
  - كل أيقونة بتظهر بالتتابع (staggered animation) مع delay
  - خطوط SVG animated بتتكون من المركز لكل أيقونة (pathLength animation)
  - نص صغير تحت كل أيقونة بالترجمة
  - Particles خفيفة في الخلفية (أقل من الحالي — 6-8 فقط)

### 2. `src/i18n/en.json`
- استبدال `hero.nodes.*` بـ:
  - `hero.orchestrator.analyze`: "Analyze"
  - `hero.orchestrator.build`: "Build"  
  - `hero.orchestrator.deploy`: "Deploy"
  - `hero.orchestrator.core`: "Gomaa AI"

### 3. `src/i18n/ar.json`
- نفس المفاتيح بالعربي: "تحليل"، "بناء"، "نشر"، "جمعة AI"

## الشكل المتوقع
```text
                    [Analyze]
                        |
                        |
    [Build] ----  ( Gomaa AI )  ---- [Deploy]
                   pulse glow
```
- المركز: دائرة كبيرة مع glow + pulse rings
- الفروع: 3 دوائر أصغر، كل واحدة فيها أيقونة lucide + label تحتها
- الخطوط: animated SVG paths بتتكون تدريجياً
- الكل بيتحرك floating خفيف

