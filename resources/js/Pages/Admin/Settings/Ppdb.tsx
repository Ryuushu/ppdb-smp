import { AlertMessages } from "@/components/alert-messages";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, useForm, usePage } from "@inertiajs/react";

interface PpdbSetting {
	id: number;
	body: {
		batas_akhir_ppdb: string;
		no_surat: string;
		hasil_seleksi: string;
		whatsapp: string;
		persyaratan: string[];
	};
}

interface Props {
	setting: PpdbSetting;
}

export default function Ppdb({ setting }: Props) {
	const { data, setData, put, processing, errors } = useForm({
		batas_akhir_ppdb: setting?.body?.batas_akhir_ppdb || "",
		no_surat: setting?.body?.no_surat || "",
		hasil_seleksi: setting?.body?.hasil_seleksi || "",
		whatsapp: setting?.body?.whatsapp || "",
		persyaratan: setting?.body?.persyaratan || [],
	});

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		put(route("snpmb.set.batas.akhir"));
	};

	const { flash } = usePage<any>().props;

	// Helper to format date for display (visual confirmation for user)
	const formatDate = (dateString: string) => {
		if (!dateString) return "-";
		try {
			// Check if format is dd-mm-yyyy (from inputmask)
			// The inputmask format is dd-mm-yyyy, but we might save it as such or parse it.
			// Assuming it's saved as string dd-mm-yyyy for now based on the previous controller logic.
			// Wait, the previous view used Carbon parse.
			// If the input is dd-mm-yyyy, Carbon might struggle if not configured for standard format.
			// Let's assume input is standard text for now.
			return dateString;
		} catch (e) {
			return dateString;
		}
	};

	return (
		<>
			<Head title="Pengaturan SNPMB" />

			<div className="space-y-6 mx-auto max-w-7xl">
				<AlertMessages flash={flash} />

				<Card className="lg:min-w-3xl">
					<CardHeader>
						<CardTitle>Pengaturan SNPMB</CardTitle>
						<CardDescription>
							Atur batas akhir pendaftaran, nomor surat, dan tanggal pengumuman.
						</CardDescription>
					</CardHeader>
					<form onSubmit={submit}>
						<CardContent className="space-y-4">
							<div className="gap-4 grid grid-cols-2 bg-muted mb-4 p-4 rounded">
								<div>
									<strong className="block font-medium text-sm">
										No. Surat
									</strong>
									<span className="text-sm">{data.no_surat || "-"}</span>
								</div>
								<div>
									<strong className="block font-medium text-sm">
								Batas Akhir SNPMB
									</strong>
									<span className="text-sm">
										{data.batas_akhir_ppdb || "-"}
									</span>
								</div>
								<div>
									<strong className="block font-medium text-sm">
										Pengumuman Seleksi
									</strong>
									<span className="text-sm">{data.hasil_seleksi || "-"}</span>
								</div>
								<div>
									<strong className="block font-medium text-sm">
										WhatsApp Panitia
									</strong>
									<span className="text-sm">{data.whatsapp || "-"}</span>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="no_surat">No. Surat</Label>
								<Input
									id="no_surat"
									value={data.no_surat}
									onChange={(e) => setData("no_surat", e.target.value)}
									placeholder="No. Surat"
									required
								/>
								{errors.no_surat && (
									<div className="text-destructive text-sm">
										{errors.no_surat}
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="batas_akhir_ppdb">
									Batas Akhir SNPMB (dd-mm-yyyy)
								</Label>
								<Input
									id="batas_akhir_ppdb"
									value={data.batas_akhir_ppdb}
									onChange={(e) => setData("batas_akhir_ppdb", e.target.value)}
									placeholder="dd-mm-yyyy"
									required
								/>
								{errors.batas_akhir_ppdb && (
									<div className="text-red-500 text-sm">
										{errors.batas_akhir_ppdb}
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="hasil_seleksi">
									Pengumuman Hasil Seleksi (dd-mm-yyyy)
								</Label>
								<Input
									id="hasil_seleksi"
									value={data.hasil_seleksi}
									onChange={(e) => setData("hasil_seleksi", e.target.value)}
									placeholder="dd-mm-yyyy"
									required
								/>
								{errors.hasil_seleksi && (
									<div className="text-red-500 text-sm">
										{errors.hasil_seleksi}
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="whatsapp">Nomor WhatsApp Panitia (Contoh: 628123456789)</Label>
								<Input
									id="whatsapp"
									value={data.whatsapp}
									onChange={(e) => setData("whatsapp", e.target.value)}
									placeholder="628..."
								/>
							</div>

							<div className="space-y-4 pt-4 border-t">
								<div className="flex items-center justify-between">
									<Label>Daftar Persyaratan Dokumen</Label>
									<Button 
										type="button" 
										variant="outline" 
										size="sm"
										onClick={() => setData('persyaratan', [...data.persyaratan, ""])}
									>
										Tambah Dokumen
									</Button>
								</div>
								<div className="space-y-2">
									{data.persyaratan.map((item, index) => (
										<div key={index} className="flex gap-2">
											<Input 
												value={item}
												onChange={e => {
													const newPersyaratan = [...data.persyaratan];
													newPersyaratan[index] = e.target.value;
													setData('persyaratan', newPersyaratan);
												}}
												placeholder="Contoh: Fotocopy Kartu Keluarga"
											/>
											<Button 
												type="button" 
												variant="ghost" 
												size="icon"
												className="text-red-500"
												onClick={() => {
													const newPersyaratan = data.persyaratan.filter((_, i) => i !== index);
													setData('persyaratan', newPersyaratan);
												}}
											>
												&times;
											</Button>
										</div>
									))}
									{data.persyaratan.length === 0 && (
										<p className="text-xs text-muted-foreground italic">Belum ada persyaratan yang ditambahkan.</p>
									)}
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit" disabled={processing}>
								{processing ? "Menyimpan..." : "Atur"}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</>
	);
}
