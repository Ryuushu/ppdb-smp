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
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Settings2, UserCheck, PenSquare, Eye, Save, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

function ScoreInput({ pesertaId, initialBaca, initialTulis, initialHitung }: { pesertaId: string, initialBaca: number, initialTulis: number, initialHitung: number }) {
	const [baca, setBaca] = useState(initialBaca?.toString() || "");
	const [tulis, setTulis] = useState(initialTulis?.toString() || "");
	const [hitung, setHitung] = useState(initialHitung?.toString() || "");
	const [isSaving, setIsSaving] = useState(false);

	// Sync local state when server-side props change (after Inertia reload)
	useEffect(() => { setBaca(initialBaca?.toString() || ""); }, [initialBaca]);
	useEffect(() => { setTulis(initialTulis?.toString() || ""); }, [initialTulis]);
	useEffect(() => { setHitung(initialHitung?.toString() || ""); }, [initialHitung]);

	const handleSave = () => {
		// Always save when blur triggered — backend is the source of truth
		setIsSaving(true);
		router.put(route("admin.pemetaan-kelas.save_score", pesertaId), {
			nilai_baca: baca,
			nilai_tulis: tulis,
			nilai_hitung: hitung,
		}, {
			preserveScroll: true,
			onFinish: () => setIsSaving(false)
		});
	};

	return (
		<div className="flex items-center gap-1 justify-center">
			<Input
				type="number" min="0" max="100" step="0.01" value={baca}
				onChange={(e) => setBaca(e.target.value)} onBlur={handleSave} onKeyDown={(e) => e.key === 'Enter' && handleSave()}
				disabled={isSaving} className="w-[60px] text-center font-mono px-1 h-8 text-xs" placeholder="Bca"
			/>
			<Input
				type="number" min="0" max="100" step="0.01" value={tulis}
				onChange={(e) => setTulis(e.target.value)} onBlur={handleSave} onKeyDown={(e) => e.key === 'Enter' && handleSave()}
				disabled={isSaving} className="w-[60px] text-center font-mono px-1 h-8 text-xs" placeholder="Tls"
			/>
			<Input
				type="number" min="0" max="100" step="0.01" value={hitung}
				onChange={(e) => setHitung(e.target.value)} onBlur={handleSave} onKeyDown={(e) => e.key === 'Enter' && handleSave()}
				disabled={isSaving} className="w-[60px] text-center font-mono px-1 h-8 text-xs" placeholder="Htn"
			/>
		</div>
	);
}

interface Peserta {
	id: string;
	nama_lengkap: string;
	no_pendaftaran: string;
	total_score_mapped: number;
	nilai_baca: number;
	nilai_tulis: number;
	nilai_hitung: number;
	assigned_class: string;
}

export default function Index({
	peserta,
	title,
}: {
	peserta: Peserta[];
	title: string;
}) {
	const { flash } = usePage<any>().props;
	const [search, setSearch] = useState("");

	const filteredPeserta = peserta.filter((p) =>
		p.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
		p.no_pendaftaran.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<>
			<Head title={title} />
			<div className="space-y-6">
				<AlertMessages flash={flash} />

				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>{title}</CardTitle>
							<CardDescription>
								Pemetaan rombongan belajar berdasarkan hasil tes seleksi.
							</CardDescription>
						</div>
						<Button variant="outline" asChild>
							<Link href={route("admin.pemetaan-kelas.setting_ranges")}>
								<Settings2 className="w-4 h-4 mr-2" /> Atur Rentang Kelas
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<div className="mb-4 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Cari nama siswa atau no pendaftaran..."
								className="pl-10"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Nama Siswa</TableHead>
										<TableHead className="text-center">Nilai (B|T|H)</TableHead>
										<TableHead className="text-center">Total SPK</TableHead>
										<TableHead className="text-center">Hasil Pemetaan</TableHead>
										<TableHead className="text-right">Aksi</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredPeserta.length === 0 ? (
										<TableRow>
											<TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
												{search ? "Tidak ada siswa yang cocok dengan pencarian." : "Tidak ada data siswa pada gelombang ini."}
											</TableCell>
										</TableRow>
									) : (
										filteredPeserta.map((p) => (
											<TableRow key={p.id}>
												<TableCell className="font-medium">
													{p.nama_lengkap}
													<div className="text-xs text-muted-foreground">{p.no_pendaftaran}</div>
												</TableCell>
												<TableCell className="text-center w-[200px]">
													<ScoreInput pesertaId={p.id} initialBaca={p.nilai_baca} initialTulis={p.nilai_tulis} initialHitung={p.nilai_hitung} />
												</TableCell>
												<TableCell className="text-center">
													<Badge variant="outline" className="font-mono">
														{p.total_score_mapped?.toFixed(2)}
													</Badge>
												</TableCell>
												<TableCell className="text-center">
													<Badge
														className={
															p.assigned_class === 'Belum Terpetakan'
																? "bg-gray-400"
																: "bg-green-600"
														}
													>
														{p.assigned_class}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
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
		</>
	);
}
