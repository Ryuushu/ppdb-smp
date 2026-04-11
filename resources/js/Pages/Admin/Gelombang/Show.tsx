import { AlertMessages } from "@/components/alert-messages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { ChevronLeft, Calculator, PenSquare, Eye, Megaphone, Plus, Trash2 } from "lucide-react";
import { formatDateFull } from "@/lib/date";

export default function Show({
	gelombang,
	title,
}: {
	gelombang: any;
	title: string;
}) {
	const { flash } = usePage<any>().props;

	// Form for updating status
	const { data: statusData, setData: setStatusData, put: putStatus, processing: changingStatus } = useForm({
		status: gelombang.status,
	});

	// Form for hitting SPK computation
	const { post: postSPK, processing: calculating } = useForm();

	// Form for hitting announcement
	const { post: postUmumkan, processing: announcing } = useForm();

	// Form for adding criteria
	const { data: kriteriaData, setData: setKriteriaData, post: postKriteria, processing: addingKriteria, reset: resetKriteria, errors: kriteriaErrors } = useForm({
		nama: '',
		bobot: '',
		tipe: 'benefit',
	});

	const handleAddKriteria = (e: React.FormEvent) => {
		e.preventDefault();
		postKriteria(route("admin.gelombang.store_kriteria", gelombang.id), {
			onSuccess: () => resetKriteria(),
		});
	};

	const handleDeleteKriteria = (id: number) => {
		if (confirm('Hapus kriteria ini?')) {
			router.delete(route("admin.gelombang.delete_kriteria", id));
		}
	};

	const totalBobot = gelombang.kriteria?.reduce((acc: number, curr: any) => acc + parseFloat(curr.bobot), 0) || 0;

	const handleStatusChange = (newStatus: string) => {
		setStatusData('status', newStatus);
		router.put(route("admin.gelombang.update_status", gelombang.id), { status: newStatus }, {
            preserveScroll: true,
            preserveState: true,
        });
	};

	const hitungRanking = () => {
		if (confirm('Apakah Anda yakin ingin menghitung ulang ranking SPK? Tindakan ini akan memperbarui posisi semua peserta di gelombang ini.')) {
			postSPK(route("admin.spk.hitung_ranking", gelombang.id));
		}
	};

	const umumkanHasil = () => {
		if (confirm('Apakah Anda yakin ingin mengumumkan hasil seleksi? Sistem akan otomatis menentukan siswa yang LOLOS berdasarkan kuota dan ranking saat ini.')) {
			postUmumkan(route("admin.gelombang.umumkan", gelombang.id));
		}
	};

	const statusColors: Record<string, string> = {
		draft: "bg-gray-500",
		buka: "bg-green-500",
		tutup: "bg-red-500",
		pengumuman: "bg-blue-500",
		daftar_ulang: "bg-yellow-500",
		selesai: "bg-purple-500",
	};

	return (
		<>
			<Head title={title} />
			<div className="space-y-6">
				<AlertMessages flash={flash} />

				<Button variant="ghost" asChild className="mb-4">
					<Link href={route("admin.gelombang.index")}>
						<ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Gelombang
					</Link>
				</Button>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="col-span-1 md:col-span-1 h-fit">
						<CardHeader>
							<CardTitle>Informasi Gelombang</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<div className="font-bold text-sm text-muted-foreground">Status Saat Ini</div>
								<Badge className={`mt-1 ${statusColors[gelombang.status] || "bg-gray-500"}`}>
									{gelombang.status.replace("_", " ").toUpperCase()}
								</Badge>
							</div>
							
							<div>
								<div className="font-bold text-sm text-muted-foreground">Aksi Pergantian Status</div>
								<div className="flex flex-wrap gap-2 mt-2">
									{['draft', 'buka', 'tutup', 'pengumuman', 'daftar_ulang', 'selesai'].map(st => (
										<Button 
											key={st} 
											size="sm" 
											variant={gelombang.status === st ? "default" : "outline"}
											onClick={() => handleStatusChange(st)}
										>
											{st.replace("_", " ")}
										</Button>
									))}
								</div>
								<p className="text-xs text-muted-foreground mt-2">
									Ubah status sesuai dengan tahapan pendaftaran saat ini. Ranking SPK akan muncul di halaman pendaftar jika status sudah "tutup" atau "pengumuman".
								</p>
							</div>

							<div className="pt-4 border-t">
								<div className="font-bold text-sm text-muted-foreground">Tipe</div>
								<div className="capitalize">{gelombang.tipe}</div>
							</div>
							<div>
								<div className="font-bold text-sm text-muted-foreground">Tahun Ajaran</div>
								<div>{gelombang.tahun_ajaran}</div>
							</div>
							<div>
								<div className="font-bold text-sm text-muted-foreground">Periode Pendaftaran</div>
								<div>{formatDateFull(gelombang.tanggal_mulai)} s.d {formatDateFull(gelombang.tanggal_selesai)}</div>
							</div>
							<div>
								<div className="font-bold text-sm text-muted-foreground">Kuota Diterima</div>
								<div className="text-2xl font-bold text-primary">{gelombang.kuota} Siswa</div>
							</div>
						</CardContent>
					</Card>

					{/* Kriteria SPK section removed as per refactor */}

					<Card className="col-span-1 md:col-span-2">
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Peserta Pendaftar</CardTitle>
								<CardDescription>
									Daftar peserta yang mendaftar pada gelombang ini
								</CardDescription>
							</div>
							<div className="flex gap-2">
								{/* Ranking and Announcement buttons removed for selection phase */}
							</div>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[80px]">No</TableHead>
											<TableHead>No. Urut / Nama</TableHead>
											<TableHead>Program</TableHead>
											<TableHead className="text-center">Asal Sekolah</TableHead>
											<TableHead className="text-right">Aksi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{gelombang.peserta.length === 0 ? (
											<TableRow>
												<TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
													Belum ada peserta yang mendaftar.
												</TableCell>
											</TableRow>
										) : (
											// Urutkan peserta berdasarkan ranking
											[...gelombang.peserta]
												.sort((a, b) => {
													if (a.ranking && b.ranking) return a.ranking - b.ranking;
													if (a.ranking) return -1;
													if (b.ranking) return 1;
													return 0; // Keduanya null
												})
												.map((p: any, index: number) => (
												<TableRow key={p.id}>
													<TableCell className="font-bold">
														{index + 1}
													</TableCell>
													<TableCell className="font-medium">
														{p.nama_lengkap}
														<div className="text-xs text-muted-foreground">
															{p.no_pendaftaran}
														</div>
													</TableCell>
													<TableCell>{p.program?.nama}</TableCell>
													<TableCell className="text-center">
														{p.asal_sekolah}
													</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-2">
															<Button variant="outline" size="sm" asChild>
																<Link href={route("ppdb.show.peserta", p.id)}>
																	<Eye className="w-4 h-4 mr-1" /> Identitas
																</Link>
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
