const base = import.meta.env.BASE_URL;

export default function CustomerApp() {
  return (
    <div dir="rtl" className="w-screen h-screen overflow-hidden relative bg-bg text-text">
      <div className="absolute left-[7vw] top-[10vh] flex h-[80vh] w-[31vw] items-center justify-center bg-[#e7ddce]">
        <div className="relative h-[64vh] w-[20vw] rounded-[3vw] border-[0.55vw] border-primary bg-[#faf7f1] p-[0.8vw] shadow-[0_2vw_5vw_rgba(32,26,22,0.18)]">
          <div className="h-full w-full overflow-hidden rounded-[2.3vw]">
            <img
              src={`${base}images/perfume.webp`}
              crossOrigin="anonymous"
              alt="صورة تحريرية ضمن معاينة الهوية على الهاتف"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute left-1/2 top-[1.2vh] h-[0.6vh] w-[4vw] -translate-x-1/2 rounded-full bg-primary" />
        </div>
      </div>
      <main className="absolute right-0 top-0 z-10 flex h-full w-[70vw] flex-col justify-center px-[7vw]">
        <h2 className="font-display text-[4.7vw] font-bold leading-tight text-primary">
          تطبيق للزبائن
        </h2>
        <div className="mt-[4.7vh] max-w-[56vw] space-y-[2.8vh]">
          <p className="text-[2.1vw] leading-[1.42]">تطبيق Expo لأندرويد وآيفون في معاينة التطوير</p>
          <p className="text-[2.1vw] leading-[1.42]">تصفح الكتالوج والبحث وتفاصيل المنتج</p>
          <p className="text-[2.1vw] leading-[1.42]">المفضلة والسلة محفوظتان على الجهاز</p>
          <p className="text-[2.1vw] leading-[1.42]">الشراء ينتقل إلى صفحة Shopify المستضافة</p>
          <p className="text-[2.1vw] font-semibold leading-[1.42] text-accent">
            المعاينة تعمل؛ ملف التثبيت المستقل لم يُنشأ
          </p>
        </div>
      </main>
    </div>
  );
}
