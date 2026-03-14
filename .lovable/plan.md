

# حفظ رسائل الشات في الجلسة

## المشكلة
الرسائل حالياً في React state فقط — أي refresh للصفحة بيضيعها ويبدأ محادثة جديدة.

## الحل
استخدام `sessionStorage` لحفظ الرسائل والـ nodes/edges. الداتا بتفضل موجودة طول ما التاب مفتوح، وبتتمسح لما المستخدم يقفل التاب (جلسة جديدة).

## التغييرات

### 1. `src/components/composer/LeftPanel.tsx`
- عند تحديث `messages` → حفظها في `sessionStorage` بمفتاح `platme_chat_{businessType}`
- عند mount → قراءة الرسائل المحفوظة. لو فيه رسائل، تحميلها بدل إرسال intro جديد
- تخطي auto-intro لو فيه رسائل محفوظة

### 2. `src/pages/Composer.tsx`
- حفظ `nodes` و `edges` في `sessionStorage` بمفتاح `platme_graph_{businessType}`
- عند mount → لو فيه nodes محفوظة، استخدامها بدل defaults
- ده يضمن إن الـ graph كمان يرجع زي ما كان

### تفاصيل تقنية
- المفتاح: `platme_chat_{businessType}` و `platme_graph_{businessType}`
- Format: `JSON.stringify` / `JSON.parse`
- `sessionStorage` بيتمسح تلقائياً لما التاب يتقفل = جلسة جديدة
- لو المستخدم غير الـ business type، كل نوع له رسائله المنفصلة

