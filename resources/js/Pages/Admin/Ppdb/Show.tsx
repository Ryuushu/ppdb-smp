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
import { FileText, AlertCircle } from "lucide-react";

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

	nisn: string;

	no_hp: string;
    no_hp_pribadi: string;
    asal_sekolah: string;
    npsn_sekolah_asal: string;
    alamat_sekolah_asal: string;
    tahun_lulus: string;
    ekstrakurikuler: string[];

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

                            <InfoRow label="Agama" value={peserta.agama} />
							<InfoRow label="NIK" value={peserta.nik} />
							<InfoRow label="NISN" value={peserta.nisn} />
                            <InfoRow label="Anak Ke" value={`${peserta.anak_ke} dari ${peserta.jumlah_saudara_kandung} bersaudara`} />
                            <InfoRow label="Status Anak" value={peserta.status_anak} />
							<InfoRow label="Alamat Lengkap" value={peserta.alamat_lengkap} />
							<InfoRow label="No. HP Ortu" value={peserta.no_hp} />
                            <InfoRow label="No. HP Pribadi" value={peserta.no_hp_pribadi} />
						</div>

						<Separator />

                        <div>
							<h3 className="mb-3 font-semibold text-lg"># Riwayat Pendidikan</h3>
							<InfoRow label="Asal Sekolah" value={peserta.asal_sekolah} />
							<InfoRow label="NPSN Sekolah" value={peserta.npsn_sekolah_asal} />
							<InfoRow label="Tahun Lulus" value={peserta.tahun_lulus} />
							<InfoRow label="Alamat Sekolah" value={peserta.alamat_sekolah_asal} />
						</div>

						<Separator />

						<div>
							<h3 className="mb-3 font-semibold text-lg">
								# Identitas Orang Tua
							</h3>
							<InfoRow label="Nama Ayah" value={peserta.nama_ayah} />
                            <InfoRow label="NIK Ayah" value={peserta.nik_ayah} />
                            <InfoRow label="Pendidikan Ayah" value={peserta.pendidikan_ayah} />
							<InfoRow label="Pekerjaan Ayah" value={peserta.pekerjaan_ayah} />
							<InfoRow label="No. HP Ayah" value={peserta.no_hp_ayah} />
							<InfoRow label="Nama Ibu" value={peserta.nama_ibu} />
                            <InfoRow label="NIK Ibu" value={peserta.nik_ibu} />
                            <InfoRow label="Pendidikan Ibu" value={peserta.pendidikan_ibu} />
							<InfoRow label="Pekerjaan Ibu" value={peserta.pekerjaan_ibu} />
							<InfoRow label="No. HP Ibu" value={peserta.no_hp_ibu} />
                            <InfoRow 
                                label="Penghasilan Orang Tua" 
                                value={
                                    peserta.penghasilan_ortu === 'K' ? '< 1 Juta' :
                                    peserta.penghasilan_ortu === 'A' ? '1 Juta - 3 Juta' :
                                    peserta.penghasilan_ortu === 'B' ? '3 Juta - 5 Juta' :
                                    peserta.penghasilan_ortu === 'C' ? '> 5 Juta' : 
                                    peserta.penghasilan_ortu
                                } 
                            />
						</div>

                        <Separator />

                        <div>
							<h3 className="mb-3 font-semibold text-lg">
								# Bakat & Minat
							</h3>
							<InfoRow label="Prestasi" value={peserta.prestasi_diraih} />
							<InfoRow label="Pengalaman Terkesan" value={peserta.pengalaman_berkesan} />
							<InfoRow label="Cita-cita" value={peserta.cita_cita} />
							<InfoRow label="Ekstrakurikuler" value={peserta.ekstrakurikuler?.join(", ")} />
						</div>

						

						<div>
							<h3 className="mb-4 font-semibold text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
								# Dokumen Terunggah
							</h3>
							{peserta.documents && peserta.documents.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									{peserta.documents.map((doc: any) => (
                                        <Card key={doc.id} className="overflow-hidden border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="aspect-video bg-muted flex items-center justify-center relative group">
                                                {doc.file_path.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                                    <img 
                                                        src={`/storage/${doc.file_path}`} 
                                                        alt={doc.master_document?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <FileText className="w-10 h-10 text-muted-foreground" />
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                            {doc.file_path.split('.').pop()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button size="sm" variant="secondary" asChild className="h-8">
                                                        <a href={`/storage/${doc.file_path}`} target="_blank" rel="noopener noreferrer">Buka</a>
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-background">
                                                <p className="text-xs font-bold truncate" title={doc.master_document?.name}>
                                                    {doc.master_document?.name}
                                                </p>
                                            </div>
                                        </Card>
                                    ))}
								</div>
							) : (
								<div className="p-10 border-2 border-dashed rounded-2xl text-center text-muted-foreground bg-muted/30">
									<AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
									<p>Tidak ada dokumen yang diunggah.</p>
								</div>
							)}
						</div>

						<Separator />

						{peserta.ukuran_seragam && (
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
						</div>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}
