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

					<Card className="col-span-1 md:col-span-1 h-fit">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Kriteria SPK</CardTitle>
								<Badge variant={totalBobot === 1 ? "default" : "destructive"}>
									Bobot: {totalBobot.toFixed(2)} / 1.00
								</Badge>
							</div>
							<CardDescription>
								Kriteria untuk perhitungan ranking SAW. Total bobot harus 1.00 (100%).
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nama</TableHead>
											<TableHead>Bobot</TableHead>
											<TableHead className="w-[50px]"></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{gelombang.kriteria?.length === 0 ? (
											<TableRow>
												<TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-4">
													Belum ada kriteria.
												</TableCell>
											</TableRow>
										) : (
											gelombang.kriteria?.map((k: any) => (
												<TableRow key={k.id}>
													<TableCell className="py-2">
														<div className="font-medium text-xs">{k.nama}</div>
														<div className="text-[10px] text-muted-foreground capitalize">{k.tipe}</div>
													</TableCell>
													<TableCell className="py-2 text-xs font-mono">{k.bobot}</TableCell>
													<TableCell className="py-2">
														<Button 
															variant="ghost" 
															size="icon" 
															className="h-6 w-6 text-destructive"
															onClick={() => handleDeleteKriteria(k.id)}
														>
															<Trash2 className="h-3 w-3" />
														</Button>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>

							<form onSubmit={handleAddKriteria} className="space-y-3 pt-2 border-t">
								<div className="space-y-1">
									<Label htmlFor="nama" className="text-xs">Nama Kriteria</Label>
									<Input 
										id="nama" 
										size={1} 
										className="h-8 text-xs" 
										placeholder="Contoh: Nilai Rapor" 
										value={kriteriaData.nama}
										onChange={e => setKriteriaData('nama', e.target.value)}
										required
									/>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<div className="space-y-1">
										<Label htmlFor="bobot" className="text-xs">Bobot (0-1)</Label>
										<Input 
											id="bobot" 
											type="number" 
											step="0.01" 
											className="h-8 text-xs" 
											placeholder="0.25" 
											value={kriteriaData.bobot}
											onChange={e => setKriteriaData('bobot', e.target.value)}
											required
										/>
									</div>
									<div className="space-y-1">
										<Label className="text-xs">Tipe</Label>
										<Select 
											value={kriteriaData.tipe} 
											onValueChange={v => setKriteriaData('tipe', v)}
										>
											<SelectTrigger className="h-8 text-xs">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="benefit">Benefit</SelectItem>
												<SelectItem value="cost">Cost</SelectItem>
											</SelectContent>
										</Select>
                                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">
                                            {kriteriaData.tipe === 'benefit' ? 'Benefit: Nilai tinggi lebih baik' : 'Cost: Nilai rendah lebih baik'}
                                        </p>
									</div>
								</div>
                                {kriteriaErrors.bobot && (
                                    <p className="text-xs text-red-500">{kriteriaErrors.bobot}</p>
                                )}
								<Button type="submit" disabled={addingKriteria} className="w-full h-8 text-xs">
									<Plus className="w-3 h-3 mr-1" /> Tambah Kriteria
								</Button>

                                <div className="mt-4 p-2 bg-blue-50 rounded-md border border-blue-100 dark:bg-blue-950 dark:border-blue-900">
                                    <h4 className="text-[11px] font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1">
                                        💡 Panduan Tipe Kriteria
                                    </h4>
                                    <ul className="text-[10px] space-y-1 text-blue-700 dark:text-blue-400">
                                        <li><strong>Benefit:</strong> Semakin tinggi nilainya, semakin besar skornya (Contoh: Nilai Rapor, Hafalan Juz, Sertifikat).</li>
                                        <li><strong>Cost:</strong> Semakin rendah nilainya, semakin besar skornya (Contoh: Jarak Rumah, Penghasilan Orang Tua).</li>
                                    </ul>
                                </div>
							</form>
						</CardContent>
					</Card>

					<Card className="col-span-1 md:col-span-2">
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Peserta Pendaftar</CardTitle>
								<CardDescription>
									Daftar peserta dan ranking SPK
								</CardDescription>
							</div>
							<div className="flex gap-2">
								<Button variant="outline" onClick={hitungRanking} disabled={calculating}>
									<Calculator className="w-4 h-4 mr-2" /> 
									{calculating ? "Menghitung..." : "Hitung Ranking"}
								</Button>
								{gelombang.status === 'tutup' && (
									<Button onClick={umumkanHasil} disabled={announcing} variant="default" className="bg-blue-600 hover:bg-blue-700">
										<Megaphone className="w-4 h-4 mr-2" />
										{announcing ? "Mengumumkan..." : "Umumkan Hasil"}
									</Button>
								)}
							</div>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[80px]">Rank</TableHead>
											<TableHead>No. Urut / Nama</TableHead>
											<TableHead>Program</TableHead>
											<TableHead className="text-center">Skor SPK</TableHead>
											<TableHead className="text-center">Status</TableHead>
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
												.map((p: any) => (
												<TableRow key={p.id}>
													<TableCell className="font-bold text-lg">
														{p.ranking ? `#${p.ranking}` : "-"}
													</TableCell>
													<TableCell className="font-medium">
														{p.nama_lengkap}
														<div className="text-xs text-muted-foreground">
															{p.no_pendaftaran}
														</div>
													</TableCell>
													<TableCell>{p.program?.nama}</TableCell>
													<TableCell className="text-center font-mono">
														{p.skor_spk ? parseFloat(p.skor_spk).toFixed(4) : "Belum dihitung"}
													</TableCell>
													<TableCell className="text-center">
														<Badge variant={p.status_seleksi === 'lolos' ? 'default' : p.status_seleksi === 'tidak_lolos' ? 'destructive' : 'secondary'}>
															{p.status_seleksi}
														</Badge>
													</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-2">
															<Button variant="outline" size="sm" asChild>
																<Link href={route("admin.spk.input_nilai", p.id)}>
																	<PenSquare className="w-4 h-4 mr-1" /> Nilai SPK
																</Link>
															</Button>
															<Button variant="outline" size="sm" asChild>
																<Link href={route("ppdb.show.peserta", p.id)}>
																	<Eye className="w-4 h-4" />
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
