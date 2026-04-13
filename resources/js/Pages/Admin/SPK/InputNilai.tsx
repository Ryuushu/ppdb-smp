import { AlertMessages } from "@/components/alert-messages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ChevronLeft, Save, IdCard, FileText, CheckCircle2 } from "lucide-react";

export default function InputNilai({
	peserta,
	kriteria,
	nilai_existing,
	title,
}: {
	peserta: any;
	kriteria: any[];
	nilai_existing: Record<string, any>;
	title: string;
}) {
	const { flash } = usePage<any>().props;

	// Inisialisasi state form dengan nilai yang sudah ada (jika ada), atau 0
	const initialData: Record<string, string | number> = {};
	kriteria.forEach(k => {
		initialData[`nilai_${k.id}`] = nilai_existing[k.id] ? nilai_existing[k.id].nilai : 0;
	});

	const { data, setData, post, processing, errors } = useForm(initialData);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("admin.spk.store_nilai", peserta.id));
	};

	return (
		<>
			<Head title={title} />
			<div className="space-y-6">
				<AlertMessages flash={flash} />

				<Button variant="ghost" asChild className="mb-4">
					<Link href={route("admin.gelombang.show", peserta.gelombang_id)}>
						<ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke {peserta.gelombang?.nama || 'Gelombang'}
					</Link>
				</Button>

				{flash.success && (
					<div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
						<div className="flex flex-col md:flex-row items-center justify-between gap-6">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
									<CheckCircle2 className="w-6 h-6" />
								</div>
								<div>
									<h3 className="font-bold text-green-900 text-lg">Input Nilai Berhasil</h3>
									<p className="text-green-700 text-sm">Data telah tersimpan di sistem. Silakan cetak dokumen peserta di bawah ini.</p>
								</div>
							</div>
							<div className="flex flex-wrap gap-3 w-full md:w-auto">
								<form action={route('ppdb.cetak.kartu', peserta.id)} method="POST" target="_blank" className="flex-1 md:flex-none">
									<input type="hidden" name="_token" value={(usePage().props as any).csrf_token} />
									<Button type="submit" variant="default" className="w-full bg-blue-600 hover:bg-blue-700 h-11 px-6 rounded-xl shadow-lg shadow-blue-200">
										<IdCard className="w-4 h-4 mr-2" /> Cetak Kartu Pendaftaran
									</Button>
								</form>
								<form action={route('ppdb.cetak.formulir', peserta.id)} method="POST" target="_blank" className="flex-1 md:flex-none">
									<input type="hidden" name="_token" value={(usePage().props as any).csrf_token} />
									<Button type="submit" variant="outline" className="w-full h-11 px-6 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50">
										<FileText className="w-4 h-4 mr-2" /> Cetak Formulir (F1)
									</Button>
								</form>
							</div>
						</div>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="col-span-1 h-fit">
						<CardHeader>
							<CardTitle>Profil Peserta</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<div className="font-bold text-sm text-muted-foreground">Nama Peserta</div>
								<div className="text-lg font-bold">{peserta.nama_lengkap}</div>
							</div>
							<div>
								<div className="font-bold text-sm text-muted-foreground">No Pendaftaran</div>
								<div className="font-mono">{peserta.no_pendaftaran}</div>
							</div>

							<div className="pt-4 border-t">
								<div className="font-bold text-sm text-muted-foreground">Gelombang</div>
								<div>{peserta.gelombang?.nama} ({peserta.gelombang?.tipe})</div>
							</div>
						</CardContent>
					</Card>


					{kriteria.length > 0 && (
						<Card className="col-span-1 md:col-span-2">
							<CardHeader>
								<CardTitle>Form Input Nilai Kriteria</CardTitle>
								<CardDescription>
									Masukkan nilai mentah untuk masing-masing kriteria. Sistem SPK (SAW) akan melakukan normalisasi dan perkalian bobot secara otomatis setelah disimpan.
									<br />
									<span className="text-[10px] text-muted-foreground italic">
										Tips: Benefit (Nilai Tinggi = Bagus), Cost (Nilai Rendah = Bagus).
									</span>
								</CardDescription>
							</CardHeader>
							<form onSubmit={submit}>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
									{kriteria.map(k => (
										<div key={k.id} className="space-y-2">
											<Label htmlFor={`nilai_${k.id}`} className="flex justify-between">
												<span>{k.nama}</span>
												<span className="text-xs text-muted-foreground">
													Bobot: {parseFloat(k.bobot).toFixed(2)} ({k.tipe})
												</span>
											</Label>
											<Input
												id={`nilai_${k.id}`}
												type="number"
												step="0.01"
												min="0"
												max="100"
												value={data[`nilai_${k.id}`]}
												onChange={(e) => setData(`nilai_${k.id}`, parseFloat(e.target.value) || 0)}
												required
											/>
											{/* Menampilkan pesan error jika ada menggunakan key dinamis */}
											{Object.keys(errors).includes(`nilai_${k.id}`) && (
												<p className="text-sm text-red-500">
													{errors[`nilai_${k.id}` as keyof typeof errors]}
												</p>
											)}
										</div>
									))}
								</div>
							</CardContent>
							<CardFooter className="flex justify-end gap-2">
								<Button type="submit" disabled={processing}>
									<Save className="w-4 h-4 mr-2" />
									{processing ? "Menyimpan dan Menghitung..." : "Simpan dan Hitung SPK"}
								</Button>
							</CardFooter>
						</form>
					</Card>
					)}
				</div>
			</div>
		</>
	);
}
