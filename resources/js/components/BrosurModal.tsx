import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, MessageCircle, FileText, Info, UserPlus } from "lucide-react";
import { Link } from "@inertiajs/react";
import { formatDateFull } from "@/lib/date";

interface Wave {
	id: number;
	nama: string;
	status: string;
	tanggal_mulai: string;
	tanggal_selesai: string;
	kuota: number;
}

interface PpdbSetting {
	body: {
		whatsapp?: string;
		persyaratan?: string[];
	};
}

interface BrosurModalProps {
	isOpen: boolean;
	onClose: () => void;
	gelombang: Wave[];
	setting: PpdbSetting | null;
    masterDocuments?: any[];
    landingSettings?: Record<string, string>;
}

export function BrosurModal({ isOpen, onClose, gelombang, setting, masterDocuments = [], landingSettings = {} }: BrosurModalProps) {
	const waNumber = setting?.body?.whatsapp;
	const persyaratan = masterDocuments.length > 0 
        ? masterDocuments.map(doc => doc.name)
        : [
            "Fotocopy Ijazah/SKL (2 Lembar)",
            "Fotocopy Kartu Keluarga (2 Lembar)",
            "Fotocopy Akta Kelahiran (2 Lembar)",
            "Pas Foto 3x4 Background Merah (4 Lembar)"
        ];

    const brosurImage = landingSettings.brosur_image 
        ? `/storage/${landingSettings.brosur_image}` 
        : "/img/ppdb-brochure.png";

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-[95vw] lg:max-w-7xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-transparent">
				<div className="flex flex-col md:flex-row h-[92vh] md:h-[88vh] bg-background rounded-[2.5rem] overflow-hidden">
					{/* Left Side: Brochure Image (Scrollable with Blurred Dynamic Background) */}
					<div className="md:w-[65%] relative group border-r border-accent/30 overflow-hidden bg-black/95">
                        {/* Dynamic Blurred Background */}
                        <div className="absolute inset-0 opacity-40 blur-3xl scale-110 pointer-events-none">
                            <img 
                                src={brosurImage} 
                                alt="" 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <ScrollArea className="h-full w-full relative z-10">
                            <div className="p-4 md:p-12 flex justify-center items-start min-h-full">
                                <img 
                                    src={brosurImage} 
                                    alt="Brosur PPDB MI Nurul Ulum" 
                                    className="w-full h-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg transition-all duration-1000 group-hover:scale-[1.01]"
                                />
                            </div>
                        </ScrollArea>
						
						<div className="absolute top-8 left-8 pointer-events-none">
							<Badge className="bg-primary/90 backdrop-blur-md hover:bg-primary border-none text-white px-5 py-2 rounded-full text-xs font-bold tracking-widest shadow-xl">
                                {landingSettings.hero_stats_tahun ? `T.A ${landingSettings.hero_stats_tahun}/${parseInt(landingSettings.hero_stats_tahun)+1}` : "T.A 2026/2027"}
                            </Badge>
						</div>
					</div>

					{/* Right Side: Info & Requirements (Scrollable) */}
					<div className="md:w-[35%] flex flex-col bg-background relative">
                        <button 
                            onClick={onClose}
                            className="absolute top-8 right-8 z-50 p-2.5 rounded-full bg-accent/50 hover:bg-accent text-muted-foreground transition-all hover:rotate-90 md:hidden"
                        >
                            <CheckCircle2 className="w-5 h-5 rotate-45" />
                        </button>

						<DialogHeader className="p-10 pb-6 shrink-0">
							<DialogTitle className="text-3xl font-bold flex items-center gap-4 tracking-tight">
								<div className="p-3 rounded-2xl bg-primary/10">
                                    <Info className="w-8 h-8 text-primary" />
                                </div>
								Informasi
							</DialogTitle>
							<DialogDescription className="text-base mt-3 leading-relaxed">
								Lengkapi berkas pendaftaran Anda sesuai persyaratan di bawah ini.
							</DialogDescription>
						</DialogHeader>

						<div className="flex-1 overflow-y-auto px-10 py-2 min-h-0 scrollbar-thin">
							<div className="space-y-12 pb-10">
								{/* Gelombang Section */}
								<div className="space-y-6">
									<h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-2">
										<Calendar className="w-3.5 h-3.5" /> Jadwal Pendaftaran
									</h4>
									<div className="space-y-4">
										{gelombang.map((w) => (
											<div key={w.id} className="p-6 rounded-[1.75rem] border border-accent bg-accent/20 hover:border-primary/40 hover:bg-accent/40 transition-all duration-300 group">
												<div className="flex items-center justify-between mb-3">
													<div className="font-bold text-lg group-hover:text-primary transition-colors">{w.nama}</div>
													<Badge variant={w.status === 'buka' ? 'default' : 'secondary'} className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider">
														{w.status.replace('_', ' ')}
													</Badge>
												</div>
												<div className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
													<Calendar className="w-4 h-4 text-primary/60" />
													{formatDateFull(w.tanggal_mulai)} - {formatDateFull(w.tanggal_selesai)}
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Requirements Section */}
								<div className="space-y-6">
									<h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-2">
										<FileText className="w-3.5 h-3.5" /> Persyaratan
									</h4>
									<div className="grid grid-cols-1 gap-4">
										{persyaratan.map((p, i) => (
											<div key={i} className="flex items-start gap-4 p-2 group">
												<div className="mt-1 w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
													<CheckCircle2 className="w-4 h-4" />
												</div>
												<span className="text-[15px] font-medium text-foreground/70 group-hover:text-foreground transition-colors leading-snug">{p}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className="p-10 border-t bg-accent/5 shrink-0">
							<div className="flex flex-col gap-4">
								<Button 
									asChild
									className="w-full bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] h-14 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
								>
									<Link href={route('ppdb.register')}>
										<UserPlus className="w-5 h-5 mr-3" /> Daftar Sekarang
									</Link>
								</Button>

								{waNumber && (
									<Button 
										variant="outline"
										className="w-full border-green-500/20 text-green-600 hover:bg-green-600 hover:text-white rounded-[1.5rem] h-14 text-base font-semibold transition-all duration-300"
										onClick={() => window.open(`https://wa.me/${waNumber.replace(/\D/g, '')}`, '_blank')}
									>
										<MessageCircle className="w-5 h-5 mr-3" /> Hubungi Panitia
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
