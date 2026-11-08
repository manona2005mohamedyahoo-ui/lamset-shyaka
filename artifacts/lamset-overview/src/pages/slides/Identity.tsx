const base = import.meta.env.BASE_URL;

export default function Identity() {
  return (
    <div dir="rtl" className="w-screen h-screen overflow-hidden relative bg-[#e9dfcf] text-text">
      <div className="absolute left-0 top-0 h-full w-[37vw] overflow-hidden">
        <img
          src={`${base}images/scarves.webp`}
          crossOrigin="anonymous"
          alt="صورة تحريرية للأقمشة والطرح"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#5b4837]/10" />
      </div>
      <main className="absolute right-0 top-0 z-10 flex h-full w-[73vw] flex-col justify-center px-[7vw]">
        <h2 className="font-display text-[4.5vw] font-bold leading-tight text-primary">
          هوية تليق بالتفاصيل
        </h2>
        <div className="mt-[6vh] flex max-w-[58vw] flex-col gap-[3.5vh]">
          <div className="flex items-center gap-[1.8vw]">
            <span aria-hidden="true" className="h-[1.25vw] w-[1.25vw] shrink-0 rounded-full bg-accent" />
            <p className="text-[2.2vw] leading-[1.38]">بيج وأبيض عاجي وأسود وذهبي هادئ</p>
          </div>
          <div className="flex items-center gap-[1.8vw]">
            <span aria-hidden="true" className="h-[1.25vw] w-[1.25vw] shrink-0 rounded-full bg-accent" />
            <p className="text-[2.2vw] leading-[1.38]">العربية واتجاه القراءة من اليمين إلى اليسار</p>
          </div>
          <div className="flex items-center gap-[1.8vw]">
            <span aria-hidden="true" className="h-[1.25vw] w-[1.25vw] shrink-0 rounded-full bg-accent" />
            <p className="text-[2.2vw] leading-[1.38]">خطوط عربية وصور تحريرية مخصصة للإلهام</p>
          </div>
          <div className="flex items-center gap-[1.8vw]">
            <span aria-hidden="true" className="h-[1.25vw] w-[1.25vw] shrink-0 rounded-full bg-accent" />
            <p className="text-[2.2vw] leading-[1.38]">صور الإلهام ليست صور منتجات للبيع</p>
          </div>
        </div>
      </main>
    </div>
  );
}
