import { AlertMessages } from "@/components/alert-messages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";

export default function Create({ title }: { title: string }) {
	const { flash } = usePage<any>().props;
    const today = new Date().toISOString().split('T')[0];
	const { data, setData, post, processing, errors } = useForm({
		nama: "",
		deskripsi: "",
		kuota: 100,
		tanggal_mulai: "",
		tanggal_selesai: "",
		tanggal_pengumuman: "",
		tahun_ajaran: new Date().getFullYear() + "/" + (new Date().getFullYear() + 1),
	});

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("admin.gelombang.store"));
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

				<Card className="max-w-3xl">
					<CardHeader>
						<CardTitle>{title}</CardTitle>
					</CardHeader>
					<form onSubmit={submit}>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="nama">Nama Gelombang</Label>
									<Input
										id="nama"
										value={data.nama}
										onChange={(e) => setData("nama", e.target.value)}
										placeholder="Contoh: Gelombang Prestasi 1"
										required
									/>
									{errors.nama && (
										<p className="text-sm text-red-500">{errors.nama}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
									<Input
										id="tahun_ajaran"
										value={data.tahun_ajaran}
										onChange={(e) => setData("tahun_ajaran", e.target.value)}
										placeholder="Contoh: 2026/2027"
										required
									/>
									{errors.tahun_ajaran && (
										<p className="text-sm text-red-500">{errors.tahun_ajaran}</p>
									)}
								</div>



								<div className="space-y-2">
									<Label htmlFor="kuota">Kuota Diterima</Label>
									<Input
										id="kuota"
										type="number"
										min="1"
										value={data.kuota}
										onChange={(e) => setData("kuota", parseInt(e.target.value) || 0)}
										required
									/>
									{errors.kuota && (
										<p className="text-sm text-red-500">{errors.kuota}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="tanggal_mulai">Tanggal Mulai Pendaftaran</Label>
									<Input
										id="tanggal_mulai"
										type="date"
										value={data.tanggal_mulai}
										onChange={(e) => setData("tanggal_mulai", e.target.value)}
                                        min={today}
										required
									/>
									{errors.tanggal_mulai && (
										<p className="text-sm text-red-500">{errors.tanggal_mulai}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="tanggal_selesai">Tanggal Penutupan Pendaftaran</Label>
									<Input
										id="tanggal_selesai"
										type="date"
										value={data.tanggal_selesai}
										onChange={(e) => setData("tanggal_selesai", e.target.value)}
                                        min={data.tanggal_mulai || today}
										required
									/>
									{errors.tanggal_selesai && (
										<p className="text-sm text-red-500">{errors.tanggal_selesai}</p>
									)}
								</div>

								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="tanggal_pengumuman">
										Tanggal Pengumuman (Opsional)
									</Label>
									<Input
										id="tanggal_pengumuman"
										type="date"
										value={data.tanggal_pengumuman}
										onChange={(e) => setData("tanggal_pengumuman", e.target.value)}
                                        min={data.tanggal_selesai || today}
									/>
									<p className="text-xs text-muted-foreground">
										Dapat diisi nanti atau akan otomatis diisi jika dibiarkan kosong.
									</p>
									{errors.tanggal_pengumuman && (
										<p className="text-sm text-red-500">{errors.tanggal_pengumuman}</p>
									)}
								</div>

								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="deskripsi">Deskripsi & Syarat pendaftaran</Label>
									<Textarea
										id="deskripsi"
										value={data.deskripsi}
										onChange={(e) => setData("deskripsi", e.target.value)}
										placeholder="Tuliskan syarat khusus gelombang ini..."
										className="min-h-[150px]"
									/>
									{errors.deskripsi && (
										<p className="text-sm text-red-500">{errors.deskripsi}</p>
									)}
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit" disabled={processing} className="w-full">
								{processing ? "Menyimpan..." : "Simpan Gelombang Baru"}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</>
	);
}
