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
		no_surat: string;
		whatsapp: string;
		fonnte_token: string;
		jatuh_tempo_cicilan: string;
		pesan_tagihan: string;
		pesan_kelulusan: string;
	};
}

interface Props {
	setting: PpdbSetting;
}

export default function Ppdb({ setting }: Props) {
	const { data, setData, put, processing, errors } = useForm({
		no_surat: setting?.body?.no_surat || "",
		whatsapp: setting?.body?.whatsapp || "",
		fonnte_token: setting?.body?.fonnte_token || "",
		jatuh_tempo_cicilan: setting?.body?.jatuh_tempo_cicilan || "",
		pesan_tagihan: setting?.body?.pesan_tagihan || "",
		pesan_kelulusan: setting?.body?.pesan_kelulusan || "",
	});

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		put(route("snpmb.set.batas.akhir.update"));
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
								<Label htmlFor="whatsapp">Nomor WhatsApp Panitia (Contoh: 628123456789)</Label>
								<Input
									id="whatsapp"
									value={data.whatsapp}
									onChange={(e) => setData("whatsapp", e.target.value)}
									placeholder="628..."
								/>
							</div>

                            <div className="border-t pt-4 mt-6">
                                <h3 className="text-lg font-medium mb-4">Integrasi WhatsApp Fonnte</h3>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fonnte_token">Fonnte API Token</Label>
                                        <Input
                                            id="fonnte_token"
                                            value={data.fonnte_token}
                                            onChange={(e) => setData("fonnte_token", e.target.value)}
                                            placeholder="Masukkan token dari fonnte.com"
                                            type="password"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="jatuh_tempo_cicilan">Jatuh Tempo Cicilan (dd-mm-yyyy)</Label>
                                        <Input
                                            id="jatuh_tempo_cicilan"
                                            value={data.jatuh_tempo_cicilan}
                                            onChange={(e) => setData("jatuh_tempo_cicilan", e.target.value)}
                                            placeholder="dd-mm-yyyy"
                                        />
                                        <p className="text-xs text-muted-foreground">Tanggal batas akhir pembayaran cicilan sebelum dianggap telat.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pesan_tagihan">Template Pesan WhatsApp</Label>
                                        <textarea
                                            id="pesan_tagihan"
                                            value={data.pesan_tagihan}
                                            onChange={(e) => setData("pesan_tagihan", e.target.value)}
                                            placeholder="Halo {nama}, tagihan Anda sebesar {tagihan} belum lunas..."
                                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <p>Gunakan placeholder berikut:</p>
                                            <ul className="list-disc list-inside">
                                                <li><code>{'{nama}'}</code> - Nama Lengkap Siswa</li>
                                                <li><code>{'{no_pendaftaran}'}</code> - Nomor Pendaftaran</li>
                                                <li><code>{'{tagihan}'}</code> - Sisa Tagihan</li>
                                                <li><code>{'{total_tagihan}'}</code> - Total Biaya</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pesan_kelulusan">Template Bukti Terima (WhatsApp Kelulusan)</Label>
                                        <textarea
                                            id="pesan_kelulusan"
                                            value={data.pesan_kelulusan}
                                            onChange={(e) => setData("pesan_kelulusan", e.target.value)}
                                            placeholder="Selamat {nama}! Anda dinyatakan LULUS seleksi PPDB..."
                                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <p>Gunakan placeholder berikut:</p>
                                            <ul className="list-disc list-inside">
                                                <li><code>{'{nama}'}</code> - Nama Lengkap Siswa</li>
                                                <li><code>{'{no_pendaftaran}'}</code> - Nomor Pendaftaran</li>
                                                <li><code>{'{gelombang}'}</code> - Nama Gelombang</li>
                                            </ul>
                                        </div>
                                    </div>
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
