const base = import.meta.env.BASE_URL;

export default function Management() {
  return (
    <div dir="rtl" className="w-screen h-screen overflow-hidden relative bg-[#e9dfcf] text-text">
      <div className="absolute left-[7vw] top-[8vh] h-[84vh] w-[33vw] overflow-hidden">
        <img
          src={`${base}images/atelier.webp`}
          crossOrigin="anonymous"
          alt="صورة تحريرية لمساحة عمل أنيقة"
          className="h-full w-full object-cover"
        />
      </div>
      <main className="absolute right-0 top-0 z-10 flex h-full w-[67vw] flex-col justify-center px-[7vw]">
        <h2 className="font-display text-[4.4vw] font-bold leading-tight text-primary">
          الإدارة والشفافية
        </h2>
        <div className="mt-[4.5vh] max-w-[53vw] space-y-[2.65vh]">
          <p className="text-[2vw] leading-[1.4]">مدخل الإدارة يفتح لوحة Shopify الخارجية الآمنة</p>
          <p className="text-[2vw] leading-[1.4]">صلاحيات صاحبة المتجر تحددها حسابات Shopify</p>
          <p className="text-[2vw] leading-[1.4]">لا توجد لوحة تعديل داخل التطبيق حتى الآن</p>
          <p className="text-[2vw] leading-[1.4]">لا تقييمات أو خصومات أو وعود شحن مختلقة</p>
          <p className="text-[2vw] leading-[1.4]">رقم واتساب وإرساله داخل التطبيق غير مفعّلين</p>
        </div>
      </main>
    </div>
  );
}
