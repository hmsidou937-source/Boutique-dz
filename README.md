# DZ Store — متجر إلكتروني للبيع في الجزائر

متجر إلكتروني كامل مبني بـ **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase**،
مخصص للبيع عبر الإنترنت في الجزائر: كتالوج منتجات، سلة، Checkout بنظام
الدفع عند الاستلام (COD)، توصيل حسب الولاية/البلدية (منزل/مكتب) بأسعار
قابلة للتعديل بالكامل من لوحة التحكم، لوحة تحكم للطلبات/المنتجات/
التصنيفات/التوصيل/الإعدادات، إحصائيات، Meta Pixel + TikTok Pixel، زر
WhatsApp، حسابات عملاء اختيارية + شراء كزائر، مفضلة، وواجهة ثنائية
اللغة (عربي RTL / فرنسي LTR).

هذا المشروع **لا يعمل هنا في المحادثة** — هو كود جاهز لتنزيله وتشغيله
على جهازك مع مشروع Supabase حقيقي.

---

## 1. المتطلبات

- Node.js 18.18+ (يفضل 20+)
- حساب [Supabase](https://supabase.com) مجاني (لقاعدة البيانات + المصادقة)

## 2. التثبيت

```bash
npm install
cp .env.example .env.local
```

## 3. إعداد Supabase

1. أنشئ مشروعًا جديدًا على [supabase.com](https://supabase.com).
2. اذهب إلى **SQL Editor** والصق محتوى الملف `supabase/schema.sql` بالكامل ثم شغّله.
   هذا ينشئ كل الجداول (منتجات، تصنيفات، طلبات، ولايات/بلديات وأسعار
   التوصيل، عملاء، إعدادات المتجر...) مع سياسات RLS المناسبة.
3. من **Project Settings → API** انسخ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (سرّي جدًا، لا تكشفه أبدًا في المتصفح) → `SUPABASE_SERVICE_ROLE_KEY`
4. أنشئ حساب المدير: **Authentication → Users → Add user** (بريد + كلمة مرور)،
   ثم ضع نفس البريد في `ADMIN_EMAILS` داخل `.env.local`. هذا الحساب فقط
   يمكنه الدخول إلى `/admin`.
5. (اختياري) لرفع صور المنتجات: أنشئ Bucket باسم `products` من
   **Storage**، اجعله Public، وارفع صورك يدويًا ثم الصق الروابط العامة
   في نموذج المنتج بلوحة التحكم (حقل "روابط الصور").

## 4. التشغيل محليًا

```bash
npm run dev
```

افتح `http://localhost:3000` للمتجر، و `http://localhost:3000/admin`
للوحة التحكم.

## 5. النشر (Deployment)

يعمل مباشرة على [Vercel](https://vercel.com):

```bash
vercel
```

أضف نفس متغيرات `.env.local` في إعدادات المشروع على Vercel
(Environment Variables)، وحدّث `NEXT_PUBLIC_SITE_URL` بالدومين النهائي.

## 6. تفعيل إشعارات تأكيد الطلب (بريد إلكتروني / WhatsApp)

الكود جاهز في `src/lib/notifications.ts` ومربوط تلقائيًا في
`src/app/checkout/actions.ts` — يكفي إضافة متغيرات البيئة المناسبة،
بدون تعديل أي كود.

### أ) البريد الإلكتروني عبر Resend (الأسهل)

1. أنشئ حسابًا مجانيًا على [resend.com](https://resend.com).
2. تحقق من نطاقك (Domain) من **Domains** (أو استعمل نطاق `onboarding@resend.dev` للتجربة).
3. أنشئ **API Key** من **API Keys**.
4. أضف في `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxx
   RESEND_FROM_EMAIL="DZ Store <orders@yourdomain.com>"
   ```
5. أعد تشغيل السيرفر. أي طلب فيه بريد إلكتروني (حقل اختياري في
   Checkout) سيستلم رسالة تأكيد تلقائيًا.

### ب) WhatsApp عبر Twilio

1. أنشئ حسابًا على [twilio.com](https://www.twilio.com).
2. فعّل **WhatsApp Sandbox** (للتجربة) من **Messaging → Try it out →
   Send a WhatsApp message**، أو اطلب رقم WhatsApp Business معتمد
   للإنتاج الحقيقي.
3. من لوحة Twilio انسخ `Account SID` و `Auth Token`.
4. أضف في `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxx
   TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"
   ```
5. في وضع Sandbox، كل زبون يريد استلام الرسالة يجب أن يرسل أولاً كود
   الانضمام (join xxxx) إلى رقم Twilio مرة واحدة — هذا قيد خاص بوضع
   التجربة فقط ويختفي مع رقم WhatsApp Business الحقيقي.

### ج) خدمة أخرى (SMS، أو مزوّد مختلف)

`src/lib/notifications.ts` مجرد استدعاءات `fetch` بسيطة — يمكنك
استبدال Resend بأي مزوّد بريد آخر (مثل SendGrid)، أو Twilio بأي مزوّد
SMS/WhatsApp آخر (مثل 360dialog أو Vonage)، فقط بتغيير الرابط
والـ headers داخل هاتين الدالتين، دون المساس ببقية المشروع.

---

## البنية العامة

```
src/
  app/                    → صفحات Next.js (App Router)
    page.tsx              → الصفحة الرئيسية
    products/              → الكتالوج + صفحة المنتج
    cart/, checkout/       → السلة وإتمام الطلب
    order-confirmation/    → تأكيد الطلب
    account/                → تسجيل الدخول / التسجيل / طلباتي
    wishlist/               → المفضلة
    policies/               → سياسات التوصيل/الاستبدال/الخصوصية
    admin/                  → لوحة التحكم الكاملة
      page.tsx              → الإحصائيات
      products/, categories/, orders/, delivery/, settings/
    api/                    → مسارات API صغيرة (ولايات، بلديات، منتجات بالمعرف)
    sitemap.ts, robots.ts   → SEO
  components/               → مكوّنات واجهة قابلة لإعادة الاستخدام
  contexts/                  → السلة + المفضلة (localStorage)
  lib/
    supabase/                → عملاء Supabase (متصفح / خادم / صلاحية كاملة)
    data.ts                   → قراءات عامة (منتجات، تصنيفات، إعدادات...)
    orders.ts                  → بحث آمن عن طلب واحد (تأكيد الطلب/التتبّع)
    i18n/                       → عربي/فرنسي
supabase/schema.sql            → كامل قاعدة البيانات + RLS
```

## ملاحظات أمنية مهمة

- كل عمليات الكتابة الحساسة (إنشاء/تعديل/حذف منتج، تغيير حالة طلب،
  تعديل أسعار التوصيل، تعديل الإعدادات) تمر عبر **Server Actions**
  تستعمل `service_role` **على الخادم فقط** — لا تستورد
  `src/lib/supabase/admin.ts` أبدًا داخل ملف يبدأ بـ `"use client"`.
- جدول `orders` **غير قابل للقراءة العامة** عبر المفتاح العام؛ صفحة
  تأكيد الطلب وصفحة "تتبّع الطلب" تمرّان عبر Server Action يعيد طلبًا
  واحدًا فقط بمطابقة دقيقة (رقم الطلب، أو رقم الطلب + الهاتف)، تفاديًا
  لتسريب بيانات كل الزبائن.
- ميدلوير `/admin` يتحقق من جلسة Supabase Auth ومن أن البريد موجود في
  `ADMIN_EMAILS`. لمشروع إنتاجي حقيقي، يُستحسن أيضًا استعمال جدول أدوار
  (roles) بدل متغيّر بيئة بسيط.

## أشياء بسّطتها عمدًا (يمكن تطويرها لاحقًا)

- **رفع الصور**: النموذج يقبل روابط صور جاهزة (بعد رفعها يدويًا إلى
  Supabase Storage) بدل واجهة رفع Drag & Drop مباشرة — يمكن إضافتها
  بسهولة عبر `supabase.storage.from('products').upload(...)`.
- **الدفع الإلكتروني**: مفعّل حاليًا الدفع عند الاستلام (COD) فقط،
  والبنية (`payment_method` في جدول `orders`) جاهزة لإضافة بوابة دفع
  لاحقًا (مثل SATIM أو Chargily) دون تغيير الهيكل العام.
- **إشعارات WhatsApp/SMS/Email التلقائية** بعد الطلب: تحتاج تكامل خارجي
  (مثل Twilio لـ SMS، أو WhatsApp Business API، أو Resend للبريد) —
  الحقل جاهز في `createOrder` لإضافة هذا الاستدعاء.
- الولايات/البلديات مُدرجة كأمثلة فقط (3 ولايات) — أضف الباقي من لوحة
  التحكم (`/admin/delivery`) أو مباشرة في `supabase/schema.sql`.
