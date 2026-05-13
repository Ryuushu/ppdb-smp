"use client";

import { Link } from "@inertiajs/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    ArrowUp,
    Clock,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Youtube,
} from "lucide-react";
import { useEffect, useRef } from "react";

const TikTokIcon = (props: any) => (
    <svg 
        {...props}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
	{ label: "Beranda", href: "#beranda" },
	{ label: "Fasilitas", href: "#fasilitas" },
	{ label: "Ekstrakurikuler", href: "#ekskul" },
];


export function Footer({ landingSettings = {} }: { landingSettings?: Record<string, string> }) {
	const footerRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

    const contactInfo = [
        {
            icon: MapPin,
            text: landingSettings.footer_address || "Krajan Lama, Cindogo, Tapen, Kabupaten Bondowoso, Jawa Timur 68283",
        },
        { 
            icon: Phone, 
            text: landingSettings.footer_phone || "+62 812 2000 1409" 
        },
        { 
            icon: Mail, 
            text: landingSettings.footer_email || "minurululumcindogo@gmail.co" 
        },
        { 
            icon: Clock, 
            text: landingSettings.footer_hours || "Senin - Sabtu: 07:00 - 15:00" 
        },
    ];

    const socialLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            href: landingSettings.footer_facebook || "https://www.facebook.com/",
        },
        {
            name: "Instagram",
            icon: Instagram,
            href: landingSettings.footer_instagram || "https://www.instagram.com/",
        },
        {
            name: "TikTok",
            icon: TikTokIcon,
            href: landingSettings.footer_tiktok || "https://www.tiktok.com/",
        },
    ];

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Check if footer is already in viewport (for short pages like success state)
			const footerRect = footerRef.current?.getBoundingClientRect();
			const isAlreadyVisible =
				footerRect && footerRect.top < window.innerHeight;

			if (isAlreadyVisible) {
				// Footer is already visible, just show it immediately
				gsap.set(contentRef.current, { opacity: 1, y: 0 });
			} else {
				// Footer not yet visible, animate on scroll
				gsap.fromTo(
					contentRef.current,
					{ opacity: 0, y: 40 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						scrollTrigger: {
							trigger: footerRef.current,
							start: "top 90%",
						},
					},
				);
			}
		}, footerRef);

		return () => ctx.revert();
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer ref={footerRef} className="relative bg-foreground text-background">
			<button
				type="button"
				onClick={scrollToTop}
				className="-top-6 left-1/2 absolute flex justify-center items-center bg-primary shadow-lg hover:shadow-xl rounded-full w-12 h-12 hover:scale-110 transition-all -translate-x-1/2 duration-300"
				aria-label="Scroll to top"
			>
				<ArrowUp className="w-5 h-5 text-primary-foreground" />
			</button>

			<div
				ref={contentRef}
				className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl"
			>
				<div className="gap-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
					<div className="space-y-6">
						<Link href="/" className="flex items-center gap-3 group">
							<div className="bg-white p-2 rounded-xl w-12 h-12 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
								<img
									src="/img/logo-1.png"
									alt="MI Nurul Ulum Logo"
									className="w-full h-full object-contain"
								/>
							</div>
							<span className="font-bold text-white text-xl tracking-tight">
								MI NURUL ULUM
							</span>
						</Link>
						<p className="text-background/70 text-sm leading-relaxed">
							Membentuk generasi Qur'ani yang cerdas, berakhlak mulia, dan siap
							menghadapi tantangan zaman dengan pendidikan yang berkualitas di
							Kab. Bondowoso.
						</p>
						<div className="flex gap-3">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex justify-center items-center bg-background/10 hover:bg-primary rounded-xl w-10 h-10 hover:scale-110 transition-all duration-300"
									aria-label={social.name}
								>
									<social.icon className="w-5 h-5" />
								</a>
							))}
						</div>
					</div>

					<div>
						<h4 className="mb-6 font-bold text-background text-lg">
							Link Cepat
						</h4>
						<ul className="space-y-3">
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="inline-block text-background/70 hover:text-primary text-sm transition-all hover:translate-x-1 duration-300"
									>
										{link.label}
									</Link>
								</li>
							))}
                            <li key="register">
								<Link
									href={route('ppdb.register')}
									className="inline-block text-background/70 hover:text-primary text-sm transition-all hover:translate-x-1 duration-300"
								>
									Daftar Online
								</Link>
							</li>
						</ul>
					</div>

					<div className="lg:col-span-1">
						<h4 className="mb-6 font-bold text-background text-lg">Lokasi Kami</h4>
                        <div className="rounded-2xl overflow-hidden border border-background/10 h-48 bg-background/5">
                            {landingSettings.footer_map_iframe ? (
                                <div 
                                    className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full border-none"
                                    dangerouslySetInnerHTML={{ __html: landingSettings.footer_map_iframe }} 
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-background/40 text-xs italic p-4 text-center">
                                    Peta belum diatur di dashboard admin.
                                </div>
                            )}
                        </div>
					</div>

					<div>
						<h4 className="mb-6 font-bold text-background text-lg">Kontak</h4>
						<ul className="space-y-4">
							{contactInfo.map((item) => (
								<li key={item.text} className="group flex items-start gap-3">
									<div className="flex justify-center items-center bg-primary/20 group-hover:bg-primary rounded-lg w-8 h-8 group-hover:scale-110 transition-all duration-300 shrink-0">
										<item.icon className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
									</div>
									<span className="text-background/70 text-sm">
										{item.text}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-12 pt-8 border-background/10 border-t">
					<div className="flex md:flex-row flex-col justify-between items-center gap-4">
						<p className="text-background/60 text-sm">
							&copy; {new Date().getFullYear()} MI NURUL ULUM CINDOGO. Hak
							Cipta Dilindungi.
						</p>
						<p className="text-background/60 text-sm">
							SPMB Tahun Ajaran {new Date().getFullYear()}/{new Date().getFullYear() + 1}
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
