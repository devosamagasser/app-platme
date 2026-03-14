

# خطة: نظام المستخدمين والخطط والمنصات

## ملخص

بناء نظام تسجيل دخول كامل مع نظام توكنز ونوع حساب مطور، وربط إنشاء المنصات بالمستخدم المسجل مع حساب الإيجار الشهري من الداتابيز.

---

## 1. قاعدة البيانات — جداول جديدة

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | references auth.users(id) ON DELETE CASCADE |
| email | text | |
| full_name | text | nullable |
| is_developer | boolean | default false — حساب مطور |
| tokens | integer | default 50 — التوكنز المتاحة |
| created_at | timestamptz | default now() |

### `platforms`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid | references profiles(id) |
| system_id | uuid | references systems(id) |
| subdomain | text unique | |
| mobile_app | boolean | default false |
| storage_gb | integer | default 10 |
| capacity_users | integer | default 100 |
| monthly_price | numeric | محسوب ومحفوظ |
| status | text | 'active' / 'pending' / 'suspended' |
| created_at | timestamptz | |

### `platform_features`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| platform_id | uuid | references platforms(id) ON DELETE CASCADE |
| feature_slug | text | |
| feature_price | numeric | السعر وقت الإنشاء |

### `token_transactions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid | references profiles(id) |
| amount | integer | + أو - |
| reason | text | 'signup_bonus', 'platform_creation', 'purchase' |
| created_at | timestamptz | |

### RLS Policies
- profiles: المستخدم يقرأ ويعدّل بياناته فقط
- platforms: المستخدم يقرأ ويعمل CRUD على منصاته فقط
- platform_features: مرتبطة بصاحب المنصة
- token_transactions: المستخدم يقرأ معاملاته فقط

### Trigger
- عند إنشاء مستخدم جديد في auth.users → يتعمل صف في profiles مع 50 توكن + صف في token_transactions بـ 'signup_bonus'

---

## 2. حساب الإيجار الشهري

السعر الشهري هيتحسب من:
- **أسعار الفيتشرز**: مجموع `price` لكل فيتشر مختار من `system_features`
- **Storage**: `storage_gb × system.unit_storage_price`
- **Capacity**: `capacity_users × system.unit_capacity_price`
- **Mobile**: `system.mobile_app_price` لو مفعّل

صفحة Configure هتجيب الأسعار من جدول `systems` بدل ما تكون hardcoded.

---

## 3. صفحات Auth

### `/auth` — صفحة تسجيل دخول / إنشاء حساب
- فورم Login و Signup بتاب
- بعد التسجيل → redirect لـ `/select`
- البريد لازم يتأكد (no auto-confirm)

### `/dashboard` — لوحة تحكم المستخدم
- عرض التوكنز المتاحة
- قائمة المنصات اللي عملها
- زر "حساب مطور" (toggle is_developer)
- خيار شراء توكنز

---

## 4. حماية الراوتات

- `/composer` و `/configure` محميين — لازم المستخدم يكون مسجّل
- لو مش مسجّل → redirect لـ `/auth`
- التوكنز تتخصم لما يعمل Deploy في Configure

---

## 5. نظام المطور (Developer Account)

- المستخدم يقدر يفعّل `is_developer = true` من الداشبورد
- كل منصة عملها وبتتجدد شهريًا → يحصل على 10% من monthly_price كعائد
- العائد يتحسب في edge function أو cron job

---

## 6. الملفات اللي هتتعدل/تتعمل

| Action | File |
|--------|------|
| Create | `src/pages/Auth.tsx` |
| Create | `src/pages/Dashboard.tsx` |
| Create | `src/components/auth/AuthForm.tsx` |
| Create | `src/components/auth/ProtectedRoute.tsx` |
| Modify | `src/App.tsx` — إضافة routes + ProtectedRoute |
| Modify | `src/pages/Configure.tsx` — جلب الأسعار من systems + حفظ المنصة + خصم توكنز |
| Modify | `src/pages/Composer.tsx` — التأكد من تسجيل الدخول |
| DB | 4 migrations: profiles, platforms, platform_features, token_transactions + trigger |

