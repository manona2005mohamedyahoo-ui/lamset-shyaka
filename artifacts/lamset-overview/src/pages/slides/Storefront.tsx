const base = import.meta.env.BASE_URL;

export default function Storefront() {
  return (
    <div dir="rtl" className="w-screen h-screen overflow-hidden relative bg-bg text-text">
      <div className="absolute left-[7vw] top-[9vh] h-[82vh] w-[35vw] overflow-hidden rounded-[1.2vw]">
        <img
          src={`${base}images/bags.webp`}
          crossOrigin="anonymous"
          alt="صورة تحريرية لحقائب ضمن الهوية البصرية"
          className="h-full w-full object-cover"
        />
      </div>
      <main className="absolute right-0 top-0 z-10 flex h-full w-[64vw] flex-col justify-center px-[7vw]">
        <h2 className="font-display text-[4.7vw] font-bold leading-tight text-primary">
          واجهة المتجر
        </h2>
        <div className="mt-[5.5vh] max-w-[50vw] space-y-[3.3vh]">
          <p className="border-r-[0.35vw] border-accent pr-[1.6vw] text-[2.2vw] leading-[1.4]">
            صفحة رئيسية وأقسام للشنط والعطور والطرح
          </p>
          <p className="border-r-[0.35vw] border-accent pr-[1.6vw] text-[2.2vw] leading-[1.4]">
            بحث وفلاتر وصفحات تفاصيل المنتجات
          </p>
          <p className="border-r-[0.35vw] border-accent pr-[1.6vw] text-[2.2vw] leading-[1.4]">
            تجربة متجاوبة على الهاتف والكمبيوتر
          </p>
          <p className="border-r-[0.35vw] border-accent pr-[1.6vw] text-[2.2vw] leading-[1.4]">
            عند عدم وجود منتجات حقيقية تظهر حالة فارغة صريحة
          </p>
        </div>
      </main>
    </div>
  );
}
