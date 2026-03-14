ALTER TABLE public.systems ADD COLUMN name_ar text;
ALTER TABLE public.systems ADD COLUMN description_ar text;

UPDATE public.systems SET name_ar = 'التعليم', description_ar = 'بناء أنظمة إدارة تعليمية متكاملة مع دورات وعضويات وشهادات.' WHERE slug = 'education';
UPDATE public.systems SET name_ar = 'التجارة الإلكترونية', description_ar = 'بنية تجارة إلكترونية شاملة مع مخزون ومدفوعات وشحن.' WHERE slug = 'ecommerce';
UPDATE public.systems SET name_ar = 'أنظمة الجيم', description_ar = 'أنظمة إدارة الجيم مع تتبع الأعضاء والجداول وأدوات المدربين.' WHERE slug = 'gym';
UPDATE public.systems SET name_ar = 'أنظمة العيادات', description_ar = 'إدارة العيادات مع المواعيد وسجلات المرضى والفوترة.' WHERE slug = 'clinic';
UPDATE public.systems SET name_ar = 'أنظمة المطاعم', description_ar = 'عمليات المطاعم مع الطلبات والحجوزات وإدارة المطبخ.' WHERE slug = 'restaurant';