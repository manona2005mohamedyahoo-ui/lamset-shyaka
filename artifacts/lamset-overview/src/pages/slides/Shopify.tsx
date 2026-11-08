const base = import.meta.env.BASE_URL;

export default function Shopify() {
  return (
    <div dir="rtl" className="w-screen h-screen overflow-hidden relative bg-bg text-text">
      <div className="absolute left-0 top-0 h-full w-[38vw] overflow-hidden">
        <img
          src={`${base}images/atelier.webp`}
          crossOrigin="anonymous"
          alt="صورة تحريرية لمشهد متجر وأجواء منتجات"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#201a16]/15" />
      </div>
      <main className="absolute right-0 top-0 z-10 flex h-full w-[68vw] flex-col justify-center px-[7vw]">
        <h2 className="font-display text-[4.4vw] font-bold leading-tight text-primary">
          متصل بمتجر Shopify
        </h2>
        <div className="mt-[5.5vh] max-w-[54vw] space-y-[3.2vh]">
          <p className="text-[2.1vw] leading-[1.42]">Shopify مصدر بيانات المنتجات والأسعار والمخزون</p>
          <p className="text-[2.1vw] leading-[1.42]">
            اتصال الكتالوج يستجيب؛ لم تكن هناك منتجات منشورة عند الفحص
          </p>
          <p className="text-[2.1vw] leading-[1.42]">السلة تُراجع لدى Shopify قبل فتح الدفع</p>
          <p className="text-[2.1vw] leading-[1.42]">لم يُختبر شراء حقيقي لعدم توفر المنتجات</p>
        </div>
      </main>
    </div>
  );
}
