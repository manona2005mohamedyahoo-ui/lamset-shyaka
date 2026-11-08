const base = import.meta.env.BASE_URL;

export default function Cover() {
  return (
    <div dir="rtl" className="w-screen h-screen overflow-hidden relative bg-bg text-text">
      <div className="absolute inset-y-0 left-0 w-[49vw] overflow-hidden">
        <img
          src={`${base}images/hero.webp`}
          crossOrigin="anonymous"
          alt="صورة تحريرية لأجواء الأزياء والإكسسوارات"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <div className="absolute right-0 top-0 z-10 flex h-full w-[58vw] flex-col justify-center px-[7vw]">
        <div className="mb-[3vh] h-[0.55vh] w-[8vw] bg-accent" />
        <h1 className="font-display text-[6.3vw] font-bold leading-[1.08] text-primary">
          لمسة شياكة
        </h1>
        <div className="mt-[5vh] space-y-[2.1vh] text-[2.15vw] leading-[1.45] text-muted">
          <p>متجر عربي للشنط والعطور والطرح</p>
          <p>واجهة ويب وتطبيق جوال بتجربة RTL وهوية موحّدة</p>
          <p>عرض تعريفي بالمشروع وحالة جاهزيته</p>
        </div>
      </div>
      <div className="absolute bottom-[6vh] right-[7vw] h-[10vh] w-[0.12vw] bg-accent/70" />
    </div>
  );
}
