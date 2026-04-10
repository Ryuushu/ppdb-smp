import { AlertMessages } from "@/components/alert-messages";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/date";
import { Head, Link, router, usePage } from "@inertiajs/react";

interface Program {
	id: number;
	nama: string;
}

interface Peserta {
	id: string;
	no_pendaftaran: string;
	nama_lengkap: string;
	jenis_kelamin: string;
	tempat_lahir: string;
	tanggal_lahir: string;
	nik: string;
	alamat_lengkap: string;
	dukuh: string;
	rt: string;
	rw: string;
	desa_kelurahan: string;
	kecamatan: string;
	kabupaten_kota: string;
	provinsi: string;
	kode_pos: string;
	program: Program;
	asal_sekolah: string;
	tahun_lulus: string;
	nisn: string;
	penerima_kip: string; // 'y' or 'n' or null
	no_kip: string;
	no_hp: string;
	bertindik: boolean;
	bertato: boolean;
	nama_ayah: string;
	no_hp_ayah: string;
	pekerjaan_ayah: string;
	nama_ibu: string;
	no_hp_ibu: string;
	pekerjaan_ibu: string;
	akademik: {
		kelas?: string;
		semester?: string;
		peringkat?: string;
		hafidz?: string;
	} | null;
	non_akademik: {
		jenis_lomba?: string;
		juara_ke?: string;
		juara_tingkat?: string;
	} | null;
	rekomendasi_mwc: number; // boolean like
	saran_dari: string;
	diterima: number;
	status_seleksi: string;
	status_daftar_ulang: string;
	skor_spk: string | null;
	ranking: number | null;
	gelombang_id: number | null;
	gelombang?: { nama: string };
	ukuran_seragam?: any;
}

interface Props {
	peserta: Peserta;
}

export default function Show({ peserta }: Props) {
	const { flash } = usePage<any>().props;

	const handleStatusChange = (status: "y" | "n") => {
		router.post(route("ppdb.terima.peserta", { uuid: peserta.id }), { status });
	};

	const handleKonfirmasiDaftarUlang = () => {
		if (confirm(`Konfirmasi daftar ulang untuk ${peserta.nama_lengkap}?`)) {
			router.post(route("ppdb.konfirmasi.daftar_ulang", { uuid: peserta.id }));
		}
	};

	const StatusBadge = ({ status }: { status: number }) => {
		switch (status) {
			case 1:
				return (
					<Badge className="bg-green-500 hover:bg-green-600">Diterima</Badge>
				);
			case 2:
				return <Badge variant="destructive">Ditolak</Badge>;
			default:
				return (
					<Badge
						variant="secondary"
						className="bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20 text-yellow-600 dark:text-yellow-400"
					>
						Proses Seleksi
					</Badge>
				);
		}
	};

	const InfoRow = ({
		label,
		value,
	}: {
		label: string;
		value: React.ReactNode;
	}) => (
		<div className="grid grid-cols-1 md:grid-cols-3 py-2 last:border-0 border-b">
			<div className="font-medium text-muted-foreground">{label}</div>
			<div className="md:col-span-2">{value || "-"}</div>
		</div>
	);

	return (
		<>
			<Head title={peserta.nama_lengkap} />

			<div className="space-y-6 mx-auto max-w-7xl">
				<AlertMessages flash={flash} />

				<Card className="lg:min-w-3xl">
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle>Data Diri Peserta</CardTitle>
						<Button asChild>
							<Link href={route("ppdb.edit.peserta", peserta.id)}>Edit</Link>
						</Button>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<h3 className="mb-3 font-semibold text-lg"># Identitas Diri</h3>
							<InfoRow
								label="No. Pendaftaran"
								value={<strong>{peserta.no_pendaftaran}</strong>}
							/>
							<InfoRow label="Nama Lengkap" value={peserta.nama_lengkap} />
							<InfoRow
								label="Jenis Kelamin"
								value={
									peserta.jenis_kelamin === "l" ? "Laki-laki" : "Perempuan"
								}
							/>
							<InfoRow
								label="Tempat, Tanggal Lahir"
								value={`${peserta.tempat_lahir}, ${formatDate(peserta.tanggal_lahir)}`}
							/>
							<InfoRow label="Asal Sekolah" value={peserta.asal_sekolah} />
							<InfoRow label="Tahun Lulus" value={peserta.tahun_lulus} />
							<InfoRow label="Program Pilihan" value={peserta.program?.nama} />
							<InfoRow label="NIK" value={peserta.nik} />
							<InfoRow label="NISN" value={peserta.nisn} />
							<InfoRow label="Alamat Jalan" value={peserta.alamat_lengkap} />
							<InfoRow label="Dukuh" value={peserta.dukuh} />
							<InfoRow label="RT" value={peserta.rt} />
							<InfoRow label="RW" value={peserta.rw} />
							<InfoRow label="Desa/Kelurahan" value={peserta.desa_kelurahan} />
							<InfoRow label="Kecamatan" value={peserta.kecamatan} />
							<InfoRow label="Kabupaten/Kota" value={peserta.kabupaten_kota} />
							<InfoRow label="Provinsi" value={peserta.provinsi} />
							<InfoRow label="Kode Pos" value={peserta.kode_pos} />
							<InfoRow label="No. HP" value={peserta.no_hp} />
							<InfoRow
								label="Bertindik"
								value={peserta.bertindik ? "Ya" : "Tidak"}
							/>
							<InfoRow
								label="Bertato"
								value={peserta.bertato ? "Ya" : "Tidak"}
							/>
							<InfoRow
								label="Penerima KIP"
								value={
									peserta.penerima_kip === "y"
										? "Penerima KIP"
										: "Bukan penerima KIP"
								}
							/>
							<InfoRow label="No. KIP" value={peserta.no_kip} />
						</div>

						<Separator />

						<div>
							<h3 className="mb-3 font-semibold text-lg">
								# Identitas Orang Tua
							</h3>
							<InfoRow label="Nama Ayah" value={peserta.nama_ayah} />
							<InfoRow label="Pekerjaan Ayah" value={peserta.pekerjaan_ayah} />
							<InfoRow label="No. HP Ayah" value={peserta.no_hp_ayah} />
							<InfoRow label="Nama Ibu" value={peserta.nama_ibu} />
							<InfoRow label="Pekerjaan Ibu" value={peserta.pekerjaan_ibu} />
							<InfoRow label="No. HP Ibu" value={peserta.no_hp_ibu} />
						</div>

						<Separator />

						<div>
							<h3 className="mb-3 font-semibold text-lg"># Status & Seleksi</h3>
							<InfoRow
								label="Gelombang"
								value={peserta.gelombang?.nama}
							/>
							<InfoRow
								label="Status Seleksi (WP/SAW)"
								value={
									<Badge className={`capitalize ${
										peserta.status_seleksi === 'lolos' ? 'bg-green-500' :
										peserta.status_seleksi === 'tidak_lolos' ? 'bg-red-500' :
										'bg-blue-500'
									}`}>
										{peserta.status_seleksi || 'Pending'}
									</Badge>
								}
							/>
							<InfoRow
								label="Ranking / Skor"
								value={peserta.ranking ? `${peserta.ranking} (${parseFloat(peserta.skor_spk || "0").toFixed(4)})` : "-"}
							/>
							<InfoRow
								label="Daftar Ulang"
								value={
									<Badge variant={peserta.status_daftar_ulang === 'sudah' ? 'default' : 'outline'}>
										{peserta.status_daftar_ulang === 'sudah' ? 'SUDAH DAFTAR ULANG' : 'BELUM DAFTAR ULANG'}
									</Badge>
								}
							/>
							<InfoRow label="Saran Dari" value={peserta.saran_dari} />
						</div>

						{peserta.status_daftar_ulang === 'sudah' && (
							<>
								<Separator />
								<div>
									<h3 className="mb-3 font-semibold text-lg"># Ukuran Seragam</h3>
									{peserta.ukuran_seragam ? (
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<div className="p-3 bg-muted rounded-xl">
												<div className="text-xs text-muted-foreground">Baju</div>
												<div className="font-bold">{peserta.ukuran_seragam.baju}</div>
											</div>
											<div className="p-3 bg-muted rounded-xl">
												<div className="text-xs text-muted-foreground">Jas</div>
												<div className="font-bold">{peserta.ukuran_seragam.jas}</div>
											</div>
											<div className="p-3 bg-muted rounded-xl">
												<div className="text-xs text-muted-foreground">Sepatu</div>
												<div className="font-bold">{peserta.ukuran_seragam.sepatu}</div>
											</div>
											<div className="p-3 bg-muted rounded-xl">
												<div className="text-xs text-muted-foreground">Peci</div>
												<div className="font-bold">{peserta.ukuran_seragam.peci}</div>
											</div>
										</div>
									) : (
										<div className="p-4 border border-dashed rounded-xl text-center text-muted-foreground">
											Belum ada data ukuran seragam. <Link href={route("ukuran.seragam.index")} className="text-primary hover:underline">Input Sekarang</Link>
										</div>
									)}
								</div>
							</>
						)}
					</CardContent>
					<CardFooter className="flex flex-col items-start gap-4">
						<div className="flex flex-wrap gap-2">
							{peserta.status_seleksi === 'lolos' && peserta.status_daftar_ulang === 'belum' && (
								<Button 
									onClick={handleKonfirmasiDaftarUlang}
									className="bg-primary text-primary-foreground hover:bg-primary/90"
								>
									Konfirmasi Daftar Ulang
								</Button>
							)}
						</div>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}
