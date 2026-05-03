"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as LucideIcons from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

gsap.registerPlugin(ScrollTrigger);

// Helper to render Lucide Icons dynamically
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const IconComponent = (LucideIcons as any)[name] || LucideIcons.Activity;
    return <IconComponent className={className} />;
};

const DetailModal = ({ item, isOpen, onOpenChange }: { item: any, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!item) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl overflow-hidden p-0 rounded-3xl">
                <div className="relative">
                    {item.image ? (
                        <div className="h-64 w-full overflow-hidden">
                            <img src={`/storage/${item.image}`} className="w-full h-full object-cover" alt={item.title} />
                        </div>
                    ) : (
                        <div className="h-32 bg-primary/10 flex items-center justify-center">
                            {item.icon && <DynamicIcon name={item.icon} className="w-16 h-16 text-primary" />}
                        </div>
                    )}
                </div>
                <div className="p-8">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-3xl font-bold text-foreground">{item.title}</DialogTitle>
                    </DialogHeader>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                        {item.description}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export function ExtracurricularSection({ data }: { data: any[] }) {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [selected, setSelected] = useState<any>(null);

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
                            onClick={() => setSelected(item)}
							className="bg-card p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-border hover:border-primary/50"
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
							<p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
								{item.description}
							</p>
						</div>
					))}
				</div>
			</div>
            <DetailModal item={selected} isOpen={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
		</section>
	);
}
