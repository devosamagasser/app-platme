

# إضافة بيانات Owner وإرسال POST Request عند إنشاء المنصة

## ملخص
إضافة حقول (الاسم، الإيميل، الهاتف، الباسورد) لصاحب المنصة في صفحة Configure، وعند الضغط على Deploy يتم إرسال كل البيانات كـ POST request للـ `api_url` الخاص بالنظام.

---

## التغييرات

### 1. `src/pages/Configure.tsx`
- إضافة 4 state variables: `ownerName`, `ownerEmail`, `ownerPhone`, `ownerPassword`
- إضافة section جديد في الفورم بعنوان "Platform Owner" فيه 4 inputs
- تعديل `loadData` لجلب `api_url` من جدول `systems` مع باقي البيانات
- تعديل `handleDeploy`:
  1. Validation: التأكد من ملء كل الحقول + email format + password min 8 + phone required
  2. بعد حفظ المنصة في الداتابيز وخصم التوكنز
  3. إرسال POST request للـ `api_url` بالشكل المطلوب:
     ```json
     {
       "domain": "subdomain",
       "storage": 50,
       "capacity": 100,
       "mobile_app": true,
       "features": ["feature-slug-1", "feature-slug-2"],
       "name": "Owner Name",
       "email": "owner@email.com",
       "phone": "01234567890",
       "password": "password123"
     }
     ```
  4. لو الـ API رجع error → عرض toast بالخطأ (المنصة تفضل محفوظة في الداتابيز)

### 2. `src/i18n/en.json` و `src/i18n/ar.json`
- إضافة ترجمات:
  - `configure.ownerDetails` → "Platform Owner" / "صاحب المنصة"
  - `configure.ownerName` → "Full Name" / "الاسم الكامل"
  - `configure.ownerEmail` → "Email" / "البريد الإلكتروني"
  - `configure.ownerPhone` → "Phone" / "رقم الهاتف"
  - `configure.ownerPassword` → "Password" / "كلمة المرور"
  - `configure.fillAllFields` → "Please fill all owner fields" / "من فضلك أكمل بيانات صاحب المنصة"

### 3. Edge Function (اختياري — لو CORS مشكلة)
- لو الـ API الخارجي ما بيقبلش requests من الـ browser مباشرة (CORS)، هنعمل edge function `create-platform` كـ proxy يبعت الـ POST request من السيرفر
- لو الـ API بيقبل CORS عادي، هنبعت مباشرة من الـ client بـ `fetch`

---

## تفاصيل تقنية
- الـ POST request هيتبعت بـ `fetch` مباشرة أولاً، ولو CORS blocked هنحوّل لـ edge function
- حقل الباسورد هيكون `type="password"` مع `minLength={8}`
- حقل الإيميل هيكون `type="email"` مع validation
- الـ `api_url` هيتجاب من جدول `systems` ويتخزن في state مع الـ pricing
- الـ features هتتبعت كـ array of slugs

