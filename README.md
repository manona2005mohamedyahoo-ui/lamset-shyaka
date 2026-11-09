# لمسة شياكة — ملفات المشروع

هذا المستودع يجمع كود موقع «لمسة شياكة»، وتطبيق الجوال، والخادم، والعرض التقديمي القابل للتعديل.

## الروابط والتحميل

- **[المتجر المنشور](https://lms-shyk.replit.app)**
- **[العرض التقديمي — المصدر القابل للتعديل](artifacts/lamset-overview)**
- **[تحميل أحدث كود كاملًا ZIP](https://github.com/manona2005mohamedyahoo-ui/lamset-shyaka/archive/refs/heads/main.zip)**

لتحميل أحدث كود بعد أي تعديلات لاحقة، اختاري **Code → Download ZIP** من صفحة المستودع.

## أين توجد الملفات؟

| الجزء | المجلد |
| --- | --- |
| موقع المتجر | [artifacts/lamset-shyaka](artifacts/lamset-shyaka) |
| تطبيق أندرويد وآيفون — كود Expo | [artifacts/lamset-mobile](artifacts/lamset-mobile) |
| الخادم وخدمات المتجر | [artifacts/api-server](artifacts/api-server) |
| العرض التقديمي — المصدر القابل للتعديل | [artifacts/lamset-overview](artifacts/lamset-overview) |
| مكونات التصميم التجريبية | [artifacts/mockup-sandbox](artifacts/mockup-sandbox) |
| مخطط قاعدة البيانات | [lib/db/src/schema](lib/db/src/schema) |
| تعريف واجهة الخدمات | [lib/api-spec/openapi.yaml](lib/api-spec/openapi.yaml) |
| المكتبات المشتركة | [lib](lib) |
| أدوات المشروع | [scripts](scripts) |

## الأدلة والإعدادات

- [دليل التسليم وحالة الوظائف](artifacts/lamset-shyaka/DELIVERY.ar.md)
- [إعدادات الهوية وحساب الإدارة](artifacts/lamset-shyaka/BRANDING.ar.md)
- [دليل تطبيق الجوال](artifacts/lamset-mobile/MOBILE.ar.md)
- [مثال متغيرات البيئة دون أسرار](artifacts/lamset-shyaka/.env.example)
- [إعدادات الحزم](package.json) و[ملف إصدارات الاعتماديات](pnpm-lock.yaml)

## ملاحظات مهمة

- ملف PowerPoint هو العرض المعتمد سابقًا، وليس تقريرًا آليًا عن آخر التغييرات. تفاصيل إدارة الهوية الأحدث في دليل الهوية أعلاه.
- رفع الكود إلى GitHub لا ينشر تحديثات الموقع تلقائيًا، وقد تختلف النسخة المنشورة عن آخر كود هنا.
- كود تطبيق الجوال موجود؛ الحزمة لا تتضمن APK أو نسخة iOS قابلة للتثبيت.
- الحزمة لا تتضمن بيانات العملاء أو نسخة من قاعدة البيانات أو حسابات الإدارة أو مفاتيح الخدمات. تُضبط الخدمات والصلاحيات في بيئة التشغيل.
- مصدر العرض موجود في هذا المستودع. ملف PowerPoint المصدّر سُلّم منفصلًا في المحادثة؛ لم ينجح رفعه كمرفق GitHub، ولذلك لا يوجد رابط تحميل PPTX هنا.
