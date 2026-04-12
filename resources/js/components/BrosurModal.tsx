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
}

export function BrosurModal({ isOpen, onClose, gelombang, setting, masterDocuments = [] }: BrosurModalProps) {
	const waNumber = setting?.body?.whatsapp;
	const persyaratan = masterDocuments.length > 0 
        ? masterDocuments.map(doc => doc.name)
        : [
            "Fotocopy Ijazah/SKL (2 Lembar)",
            "Fotocopy Kartu Keluarga (2 Lembar)",
            "Fotocopy Akta Kelahiran (2 Lembar)",
            "Pas Foto 3x4 Background Merah (4 Lembar)"
        ];

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
				<div className="flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]">
					{/* Left Side: Brochure Image */}
					<div className="md:w-1/2 bg-muted relative overflow-hidden group">
						<img 
							src="/img/ppdb-brochure.png" 
							alt="Brosur PPDB MTs Nurul Ulum" 
							className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
						<div className="absolute bottom-6 left-6 right-6 text-white">
							<Badge className="mb-2 bg-primary hover:bg-primary border-none text-white">T.A 2026/2027</Badge>
							<h3 className="text-xl font-bold">Pendaftaran Siswa Baru</h3>
							<p className="text-sm text-white/80">Mari bergabung bersama keluarga besar MTs Nurul Ulum.</p>
						</div>
					</div>

					{/* Right Side: Info & Requirements */}
					<div className="md:w-1/2 flex flex-col bg-background">
						<DialogHeader className="p-6 pb-2">
							<DialogTitle className="text-2xl font-bold flex items-center gap-2">
								<Info className="w-6 h-6 text-primary" />
								Informasi Pendaftaran
							</DialogTitle>
							<DialogDescription>
								Silakan lengkapi berkas dan hubungi panitia untuk pendaftaran.
							</DialogDescription>
						</DialogHeader>

						<ScrollArea className="flex-1 p-6 pt-2">
							<div className="space-y-8">
								{/* Gelombang Section */}
								<div className="space-y-4">
									<h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
										<Calendar className="w-4 h-4" /> Gelombang Pendaftaran
									</h4>
									<div className="space-y-3">
										{gelombang.map((w) => (
											<div key={w.id} className="p-4 rounded-2xl border bg-accent/50 hover:border-primary/30 transition-colors">
												<div className="flex items-center justify-between mb-1">
													<div className="font-bold">{w.nama}</div>
													<Badge variant={w.status === 'buka' ? 'default' : 'secondary'} className="capitalize">
														{w.status.replace('_', ' ')}
													</Badge>
												</div>
												<div className="text-xs text-muted-foreground">
													{formatDateFull(w.tanggal_mulai)} - {formatDateFull(w.tanggal_selesai)}
												</div>
											</div>
										))}
										{gelombang.length === 0 && (
											<p className="text-sm text-muted-foreground italic">Informasi gelombang belum tersedia.</p>
										)}
									</div>
								</div>

								{/* Requirements Section */}
								<div className="space-y-4">
									<h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
										<FileText className="w-4 h-4" /> Persyaratan Dokumen
									</h4>
									<div className="grid grid-cols-1 gap-2">
										{persyaratan.map((p, i) => (
											<div key={i} className="flex items-start gap-3 p-2 group">
												<div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
													<CheckCircle2 className="w-3 h-3" />
												</div>
												<span className="text-sm text-foreground/90">{p}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</ScrollArea>

						<div className="p-6 border-t bg-muted/30">
							<div className="flex flex-col gap-3">
								<Button 
									asChild
									className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 shadow-lg shadow-primary/20"
								>
									<Link href={route('ppdb.register')}>
										<UserPlus className="w-5 h-5 mr-2" /> Daftar Online Sekarang
									</Link>
								</Button>

								{waNumber && (
									<Button 
										variant="outline"
										className="w-full border-green-500 text-green-600 hover:bg-green-50 rounded-xl h-12"
										onClick={() => window.open(`https://wa.me/${waNumber.replace(/\D/g, '')}`, '_blank')}
									>
										<MessageCircle className="w-5 h-5 mr-2" /> Tanya Panitia (WhatsApp)
									</Button>
								)}
								<p className="text-[11px] text-center text-muted-foreground">
									Panitia akan membantu proses pengisian formulir dan verifikasi data di sekolah.
								</p>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
