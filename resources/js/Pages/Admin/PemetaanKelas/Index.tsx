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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Settings2, UserCheck, PenSquare, Eye, MonitorCog } from "lucide-react";

interface Peserta {
	id: string;
	nama_lengkap: string;
	no_pendaftaran: string;
	program: { nama: string };
	total_score_mapped: number;
	assigned_class: string;
}

export default function Index({
	gelombang,
	peserta,
	selected_gelombang,
	title,
}: {
	gelombang: any[];
	peserta: Peserta[];
	selected_gelombang: string | number | null;
	title: string;
}) {
	const { flash } = usePage<any>().props;

	const handleGelombangChange = (id: string) => {
		router.get(route("admin.pemetaan-kelas.index"), { gelombang_id: id }, {
            preserveState: true,
            preserveScroll: true,
        });
	};

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
						<div className="max-w-sm mb-6">
							<Label className="mb-2 block">Pilih Gelombang Pendaftaran</Label>
							<Select
								value={selected_gelombang?.toString()}
								onValueChange={handleGelombangChange}
							>
								<SelectTrigger>
									<SelectValue placeholder="Pilih Gelombang" />
								</SelectTrigger>
								<SelectContent>
									{gelombang.map((g) => (
										<SelectItem key={g.id} value={g.id.toString()}>
											{g.nama} ({g.tahun_ajaran})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{!selected_gelombang ? (
							<div className="py-12 text-center border rounded-lg bg-muted/20">
								<MonitorCog className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
								<p className="text-muted-foreground">Pilih gelombang untuk melihat pemetaan siswa.</p>
							</div>
						) : (
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nama Siswa</TableHead>
											<TableHead>Program</TableHead>
											<TableHead className="text-center">Total Skor</TableHead>
											<TableHead className="text-center">Hasil Pemetaan</TableHead>
											<TableHead className="text-right">Aksi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{peserta.length === 0 ? (
											<TableRow>
												<TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
													Tidak ada data siswa pada gelombang ini.
												</TableCell>
											</TableRow>
										) : (
											peserta.map((p) => (
												<TableRow key={p.id}>
													<TableCell className="font-medium">
														{p.nama_lengkap}
														<div className="text-xs text-muted-foreground">{p.no_pendaftaran}</div>
													</TableCell>
													<TableCell>{p.program?.nama}</TableCell>
													<TableCell className="text-center">
														<Badge variant="outline" className="font-mono">
															{p.total_score_mapped.toFixed(2)}
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
																<Link href={route("admin.spk.input_nilai", p.id)}>
																	<PenSquare className="w-4 h-4 mr-1" /> Input Nilai
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
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
			{children}
		</label>
	);
}
