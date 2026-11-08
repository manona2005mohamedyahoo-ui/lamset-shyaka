export default function BeforeLaunch() {
  return (
    <div dir="rtl" className="w-screen h-screen overflow-hidden relative bg-primary text-[#f7f1e8]">
      <div className="absolute left-0 top-0 h-full w-[0.9vw] bg-accent" />
      <main className="relative flex h-full flex-col justify-center px-[9vw]">
        <h2 className="font-display text-[5vw] font-bold leading-tight text-[#f7f1e8]">
          ما قبل الإطلاق
        </h2>
        <div className="mt-[5.2vh] max-w-[77vw] space-y-[2.8vh]">
          <p className="border-r-[0.3vw] border-accent pr-[1.5vw] text-[2.1vw] leading-[1.42]">
            نشر المنتجات والصور والمخزون في Shopify
          </p>
          <p className="border-r-[0.3vw] border-accent pr-[1.5vw] text-[2.1vw] leading-[1.42]">
            ضبط الشحن والضرائب والدفع والسياسات وبيانات التواصل
          </p>
          <p className="border-r-[0.3vw] border-accent pr-[1.5vw] text-[2.1vw] leading-[1.42]">
            اختبار رحلة الطلب على هاتف حقيقي ومنتجات منشورة
          </p>
          <p className="border-r-[0.3vw] border-accent pr-[1.5vw] text-[2.1vw] leading-[1.42]">
            تجهيز نسخة التطبيق للنشر بعد اكتمال الإعداد والاختبار
          </p>
          <p className="border-r-[0.3vw] border-accent pr-[1.5vw] text-[2.1vw] leading-[1.42]">
            رابط استلام متجر Shopify ليس رابطًا لرفع العرض
          </p>
        </div>
      </main>
    </div>
  );
}
