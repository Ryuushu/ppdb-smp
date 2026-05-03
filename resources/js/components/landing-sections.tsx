import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

gsap.registerPlugin(ScrollTrigger);

// Helper to render Lucide Icons dynamically
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const IconComponent = (LucideIcons as any)[name] || LucideIcons.CheckCircle;
    return <IconComponent className={className} />;
};

const DetailModal = ({ item, isOpen, onOpenChange }: { item: any, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!item) return null;
    const isGuru = !!item.attributes?.jabatan;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl overflow-hidden p-0 rounded-3xl border-none shadow-2xl">
                <div className={cn(
                    "relative flex items-center justify-center",
                    isGuru ? "pt-12 pb-6 bg-gradient-to-b from-primary/10 to-background" : "h-64"
                )}>
                    {item.image ? (
                        isGuru ? (
                            <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-background shadow-xl">
                                <img src={`/storage/${item.image}`} className="w-full h-full object-cover" alt={item.title} />
                            </div>
                        ) : (
                            <img src={`/storage/${item.image}`} className="w-full h-full object-cover" alt={item.title} />
                        )
                    ) : (
                        <div className={cn(
                            "flex items-center justify-center bg-primary/10",
                            isGuru ? "w-40 h-40 rounded-full" : "w-full h-full"
                        )}>
                            {(item.icon || isGuru) && (
                                <DynamicIcon 
                                    name={item.icon || "User"} 
                                    className={cn("text-primary", isGuru ? "w-20 h-20" : "w-16 h-16")} 
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className={cn("p-8", isGuru && "text-center pt-2")}>
                    <DialogHeader className={cn("mb-4", isGuru && "items-center")}>
                        <DialogTitle className="text-3xl font-bold text-foreground">{item.title}</DialogTitle>
                        {item.attributes?.jabatan && (
                            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold w-fit mt-2">
                                {item.attributes.jabatan}
                            </div>
                        )}
                        {item.attributes?.date && (
                            <div className="text-primary font-bold flex items-center gap-2 mt-2">
                                <LucideIcons.Calendar className="w-5 h-5" />
                                {item.attributes.date}
                            </div>
                        )}
                    </DialogHeader>
                    <div className={cn(
                        "text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg",
                        isGuru ? "text-center" : "text-left"
                    )}>
                        {item.description}
                    </div>
                    {item.attributes?.nuptk && (
                        <div className={cn(
                            "mt-6 pt-6 border-t flex items-center gap-2 text-muted-foreground text-sm font-medium",
                            isGuru ? "justify-center" : "justify-start"
                        )}>
                            <LucideIcons.CreditCard className="w-5 h-5" />
                            <span>NUPTK: {item.attributes.nuptk}</span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export function TimelineSection({ data }: { data: any[] }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".timeline-item", 
                { opacity: 0, x: -30 }, 
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.2, scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    if (!data || data.length === 0) return null;

    return (
        <section ref={sectionRef} className="py-24 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold tracking-wider rounded-full mb-4 uppercase">
                        Jadwal Kegiatan
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">Timeline Pendaftaran</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Perhatikan dengan seksama jadwal pendaftaran agar tidak tertinggal tahapan penting.</p>
                </div>
                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-[28px] md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2 rounded-full"></div>
                    
                    <div className="space-y-12">
                        {data.map((item, i) => (
                            <div key={item.id} className={`timeline-item relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Center Node */}
                                <div className="absolute left-0 md:left-1/2 w-14 h-14 bg-card border-4 border-primary rounded-full flex items-center justify-center shadow-xl md:-translate-x-1/2 z-10 group hover:scale-110 transition-transform">
                                    {item.icon ? <DynamicIcon name={item.icon} className="w-6 h-6 text-primary group-hover:text-primary/70" /> : <LucideIcons.Calendar className="w-6 h-6 text-primary group-hover:text-primary/70" />}
                                </div>
                                
                                {/* Content Box */}
                                <div className="w-full md:w-1/2 pl-20 md:pl-0">
                                    <div className={`bg-card p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-shadow ${i % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                                        <div className="flex flex-col mb-2">
                                            {item.attributes?.date && (
                                                <span className="text-primary font-bold text-sm mb-1">{item.attributes.date}</span>
                                            )}
                                            <h3 className="font-bold text-xl text-primary">{item.title}</h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function AlurSection({ data }: { data: any[] }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".alur-item", 
                { opacity: 0, y: 40 }, 
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    if (!data || data.length === 0) return null;

    return (
        <section ref={sectionRef} className="py-24 bg-background relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-600 text-sm font-bold tracking-wider rounded-full mb-4 uppercase">
                        Panduan Langkah
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">Alur Pendaftaran</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.map((item, index) => (
                        <div key={item.id} className="alur-item relative bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                            <div className="absolute -top-6 -right-6 text-[120px] font-black text-secondary/40 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                                {index + 1}
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                {index + 1}
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-foreground">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function VisiMisiSection({ settings }: { settings: any }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".vm-content", 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    if (!settings?.visi && !settings?.misi) return null;

    return (
        <section ref={sectionRef} className="py-24 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 items-stretch vm-content">
                    {/* Visi (Left) */}
                    <div className="bg-card p-8 md:p-10 rounded-3xl border shadow-sm relative overflow-hidden group h-full">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <LucideIcons.Sparkles className="w-32 h-32 text-primary" />
                        </div>
                        <div className="flex items-center gap-4 mb-6 relative">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <LucideIcons.Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Visi Sekolah</h2>
                        </div>
                        <p className="text-xl md:text-2xl font-medium leading-relaxed text-muted-foreground relative italic">
                            "{settings.visi}"
                        </p>
                    </div>
                    
                    {/* Misi (Right) */}
                    <div className="bg-card p-8 md:p-10 rounded-3xl border shadow-sm relative h-full">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <LucideIcons.Target className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Misi Sekolah</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {settings.misi?.split('\n').filter((m: string) => m.trim() !== '').map((misi: string, i: number) => (
                                <div key={i} className="flex gap-4 items-start p-4 bg-secondary/30 rounded-2xl hover:bg-secondary transition-colors">
                                    <div className="w-7 h-7 shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs shadow-sm mt-0.5">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm text-foreground/80 leading-relaxed">{misi.trim()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function KeunggulanSection({ data }: { data: any[] }) {
    const [selected, setSelected] = useState<any>(null);
    if (!data || data.length === 0) return null;

    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-yellow-500/10 text-yellow-600 text-sm font-bold tracking-wider rounded-full mb-4 uppercase">
                        Nilai Plus
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">Keunggulan Kami</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.map((item, index) => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelected(item)}
                            className="p-8 bg-card border rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-all duration-500 group-hover:rotate-12">
                                {item.icon ? <DynamicIcon name={item.icon} className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" /> : <LucideIcons.Award className="w-8 h-8 text-primary group-hover:text-primary-foreground" />}
                            </div>
                            <h4 className="font-bold text-xl text-foreground mb-3">{item.title}</h4>
                            <p className="text-muted-foreground leading-relaxed line-clamp-3">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <DetailModal item={selected} isOpen={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
        </section>
    );
}

export function FasilitasSectionNew({ data }: { data: any[] }) {
    const [selected, setSelected] = useState<any>(null);
    if (!data || data.length === 0) return null;

    return (
        <section className="py-24 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold tracking-wider rounded-full mb-4 uppercase">
                        Sarana & Prasarana
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">Fasilitas Sekolah</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.map((item, index) => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelected(item)}
                            className="bg-card rounded-3xl overflow-hidden border shadow-sm group hover:shadow-xl transition-all duration-500 cursor-pointer"
                        >
                            {item.image ? (
                                <div className="h-56 overflow-hidden relative">
                                    <img src={`/storage/${item.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            ) : (
                                <div className="h-56 bg-muted flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500"></div>
                                    {item.icon ? <DynamicIcon name={item.icon} className="w-16 h-16 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-500" /> : <LucideIcons.Building className="w-16 h-16 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-500" />}
                                </div>
                            )}
                            <div className="p-6 relative bg-card">
                                <h4 className="font-bold text-xl mb-2 text-foreground">{item.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <DetailModal item={selected} isOpen={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
        </section>
    );
}

export function KegiatanPrestasiSection({ kegiatan, prestasi }: { kegiatan: any[], prestasi: any[] }) {
    const [selected, setSelected] = useState<any>(null);
    if ((!kegiatan || kegiatan.length === 0) && (!prestasi || prestasi.length === 0)) return null;

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {kegiatan && kegiatan.length > 0 && (
                    <div className="mb-32">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 bg-purple-500/10 text-purple-600 text-sm font-bold tracking-wider rounded-full mb-4 uppercase">
                                Galeri
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">Kegiatan Sekolah</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {kegiatan.map(item => (
                                <div 
                                    key={item.id} 
                                    onClick={() => setSelected(item)}
                                    className="relative rounded-3xl overflow-hidden group aspect-video shadow-md cursor-pointer"
                                >
                                    {item.image ? (
                                        <img src={`/storage/${item.image}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                                    ) : (
                                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                                            <LucideIcons.Image className="w-12 h-12 text-muted-foreground/40" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="font-bold text-2xl mb-2">{item.title}</h3>
                                        <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed line-clamp-2">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {prestasi && prestasi.length > 0 && (
                    <div id="prestasi" className="relative">
                        <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="text-center mb-16 relative z-10">
                            <span className="inline-block px-4 py-1.5 bg-yellow-500/10 text-yellow-600 text-sm font-bold tracking-wider rounded-full mb-4 uppercase">
                                Pencapaian
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">Prestasi Kami</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                            {prestasi.map(item => (
                                <Link 
                                    key={item.id} 
                                    href={route('prestasi.show', item.id)}
                                    className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full"
                                >
                                    <div className="h-56 overflow-hidden relative">
                                        {item.image ? (
                                            <img src={`/storage/${item.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
                                                <LucideIcons.Trophy className="w-16 h-16 text-yellow-500 group-hover:scale-110 transition-transform" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-yellow-500 text-white p-2 rounded-xl shadow-lg z-10">
                                            <LucideIcons.Trophy className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="font-bold text-2xl mb-4 text-foreground group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-6 flex-1">{item.description}</p>
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                                            Baca Selengkapnya
                                            <LucideIcons.ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <DetailModal item={selected} isOpen={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
        </section>
    );
}

export function GuruSection({ data }: { data: any[] }) {
    const [selected, setSelected] = useState<any>(null);
    if (!data || data.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-b from-secondary/30 to-background relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold tracking-wider rounded-full mb-4 uppercase">
                        Pengajar Profesional
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">Guru & Staf</h2>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 mt-16">
                    {data.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelected(item)}
                            className="bg-card rounded-3xl shadow-lg border text-center group hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 pt-16 relative mt-12 sm:mt-0 cursor-pointer"
                        >
                            {/* Profile Image floating above card */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-xl group-hover:scale-110 transition-transform duration-500 bg-secondary">
                                {item.image ? (
                                    <img src={`/storage/${item.image}`} className="w-full h-full object-cover" alt={item.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                                        <LucideIcons.User className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <div className="p-8 pt-6">
                                <h3 className="font-bold text-xl mb-2 text-foreground">{item.title}</h3>
                                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-3">
                                    {item.attributes?.jabatan || 'Guru'}
                                </div>
                                {item.attributes?.nuptk && (
                                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
                                        <LucideIcons.CreditCard className="w-3 h-3" />
                                        <span>{item.attributes.nuptk}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <DetailModal item={selected} isOpen={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
        </section>
    );
}

export function EkstrakurikulerSectionNew({ data }: { data: any[] }) {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
                },
            );

            cardsRef.current.forEach((card, index) => {
                if (card) {
                    gsap.fromTo(
                        card,
                        { opacity: 0, y: 40, scale: 0.9 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.5,
                            delay: index * 0.08,
                            ease: "back.out(1.5)",
                            scrollTrigger: { trigger: card, start: "top 90%" },
                        },
                    );
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [data]);

    if (!data || data.length === 0) return null;

    const colors = ["bg-orange-500", "bg-pink-500", "bg-purple-500", "bg-amber-500", "bg-red-500", "bg-emerald-500", "bg-blue-500", "bg-teal-500"];

    return (
        <section
            ref={sectionRef}
            id="ekskul"
            className="py-24 md:py-32 bg-secondary/20 relative overflow-hidden"
        >
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary/20 rounded-full" />
                <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-primary/10 rounded-full" />
                <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-primary/10 rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={titleRef} className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                        Kembangkan Bakatmu
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Ekstrakurikuler
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Kembangkan minat dan bakatmu. Prestasi di bidang olahraga & seni
                        bisa mendapat beasiswa!
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.map((item, index) => (
                        <div
                            key={item.id}
                            ref={(el) => {
                                cardsRef.current[index] = el;
                            }}
                            className="bg-card p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-default border border-border hover:border-primary/50"
                        >
                            <div
                                className={`w-14 h-14 ${colors[index % colors.length]} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 overflow-hidden`}
                            >
                                {item.image ? (
                                    <img src={`/storage/${item.image}`} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    item.icon ? <DynamicIcon name={item.icon} className="w-7 h-7 text-white" /> : <LucideIcons.Activity className="w-7 h-7 text-white" />
                                )}
                            </div>
                            <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
