

## خطة: أنيميشن Deploy + أفضل طريقة للتكوين

### رأيي في أفضل طريقة

بدل صفحة منفصلة تماماً، الأفضل هو **slide-over panel** — لما يدوس Deploy، البلوكات تتجمع في أنيميشن حلوة، وبعدين يظهر panel من اليمين (أو modal كبير) فوق الـ workspace فيه كل التفاصيل (storage, capacity, mobile, subdomain). كده المستخدم يقدر يرجع للشات بسهولة ومش بيخرج من السياق.

لكن لو عايز تحافظ على صفحة Configure الموجودة، ممكن نعمل الأنيميشن وبعدين navigate. هنمشي بالـ approach اللي يناسبك.

### الخطة

#### 1. أنيميشن التجميع (Deploy Animation)
- لما يدوس Deploy في الـ Header، يتم trigger حالة `deploying` 
- كل النودز في CenterPanel تتحرك (animate) ناحية المنتصف وتصغر وتندمج في شكل واحد
- الـ edges تختفي بـ fade out
- بعد ~1.5 ثانية، يظهر **configuration panel** (slide-in من اليمين) فوق الـ workspace

#### 2. Configuration Panel (بدل صفحة منفصلة)
- Panel كبير يظهر فوق الـ canvas بعد الأنيميشن
- فيه نفس محتوى صفحة Configure الحالية: storage slider, capacity slider, mobile toggle, subdomain
- Pricing calculator في الجانب
- زرار "Confirm & Deploy" نهائي
- زرار رجوع يقفل الـ panel ويرجع البلوكات لمكانها

#### 3. التعديلات

**`src/components/composer/ComposerHeader.tsx`**
- Deploy button يستدعي `onDeploy` callback بدل ما يكون ساكن

**`src/pages/Composer.tsx`**
- إضافة state `deployPhase: 'idle' | 'animating' | 'configuring'`
- لما `deployPhase === 'animating'`: يمرر prop للـ CenterPanel يخلي النودز تتحرك للمنتصف
- بعد 1.5 ثانية: `deployPhase → 'configuring'` → يظهر ConfigPanel

**`src/components/composer/CenterPanel.tsx`**
- إضافة prop `deploying: boolean`
- لما `deploying === true`: كل نود يتحرك لنقطة المنتصف بـ framer-motion، الـ edges تعمل fade out

**`src/components/composer/ConfigPanel.tsx`** (ملف جديد)
- نفس محتوى Configure.tsx لكن كـ overlay panel
- يظهر بـ slide-in animation
- فيه: selected modules, storage, capacity, mobile, subdomain, pricing

**`src/pages/Configure.tsx`**
- يفضل موجود كـ fallback لكن الـ flow الأساسي يبقى من الـ panel

