import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Trophy, Users, Search, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Participant {
	id: string;
	ranking: number;
	nama_lengkap: string;
	no_pendaftaran: string;

	skor_spk: string;
	status_seleksi: string;
}

interface Wave {
	id: number;
	nama: string;
	status: string;
	tahun_ajaran: string;
}

export default function Ranking({
	gelombangList,
	selectedGelombang,
	peserta,
	title
}: {
	gelombangList: Wave[];
	selectedGelombang: Wave | null;
	peserta: Participant[];
	title: string;
}) {
	const [search, setSearch] = useState("");

	const handleWaveChange = (id: string) => {
		router.get(route('ppdb.ranking'), { gelombang_id: id }, {
			preserveState: false,
			preserveScroll: true,
		});
	};

	const filteredPeserta = peserta.filter(p => 
		p.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
		p.no_pendaftaran.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<>
			<Head title={`${title} | SNPMB MI Nurul Ulum`} />
			<Navbar />
			<main className="min-h-screen bg-gradient-to-b from-secondary via-background to-accent pt-24 pb-16">
				<div className="container mx-auto px-4 max-w-5xl">
					<div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
						<div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
							<Trophy className="w-8 h-8 text-primary" />
						</div>
						<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Ranking Live</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Pantau peringkat Anda secara real-time berdasarkan hasil seleksi sistem pendukung keputusan (SPK).
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						{/* Sidebar filter */}
						<div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
							<Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
								<CardHeader className="bg-primary text-primary-foreground">
									<CardTitle className="text-lg">Filter Gelombang</CardTitle>
								</CardHeader>
								<CardContent className="p-6">
									<div className="space-y-4">
										<div>
											<label className="text-sm font-medium mb-1.5 block">Pilih Gelombang</label>
											<Select 
												value={selectedGelombang ? String(selectedGelombang.id) : ""} 
												onValueChange={handleWaveChange}
											>
												<SelectTrigger className="rounded-xl h-11">
													<SelectValue placeholder="Pilih Gelombang" />
												</SelectTrigger>
												<SelectContent className="rounded-xl">
													{gelombangList.map(w => (
														<SelectItem key={w.id} value={String(w.id)}>
															{w.nama} ({w.tahun_ajaran})
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										
										{selectedGelombang && (
											<div className="p-4 bg-muted rounded-2xl space-y-2">
												<div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Status Gelombang</div>
												<div className="flex items-center gap-2">
													<div className={`w-2 h-2 rounded-full ${
														selectedGelombang.status === 'buka' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
													}`} />
													<span className="capitalize font-medium">{selectedGelombang.status.replace('_', ' ')}</span>
												</div>
											</div>
										)}
									</div>
								</CardContent>
							</Card>

							<div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
								<div className="flex items-center gap-3 mb-3">
									<AlertCircle className="w-5 h-5 text-primary" />
									<h3 className="font-bold text-primary">Informasi</h3>
								</div>
								<p className="text-sm text-balance leading-relaxed">
									Ranking ini bersifat sementara dan dapat berubah seiring masuknya data pendaftar baru hingga periode pendaftaran ditutup secara resmi.
								</p>
							</div>
						</div>

						{/* Main Content */}
						<div className="lg:col-span-3 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
							<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
								<div className="relative w-full md:max-w-xs">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input 
										placeholder="Cari nama atau no. daftar..." 
										className="pl-10 rounded-xl h-11 bg-background border-muted shadow-sm focus-visible:ring-primary"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
									/>
								</div>
								
								{selectedGelombang && (
									<Badge variant="outline" className="px-4 py-1.5 rounded-full bg-background/50 backdrop-blur-sm">
										<Users className="w-4 h-4 mr-2" />
										Total {peserta.length} Peserta Berperingkat
									</Badge>
								)}
							</div>

							<Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
								<CardContent className="p-0">
									<div className="overflow-x-auto">
										<Table>
											<TableHeader className="bg-muted/50">
												<TableRow className="hover:bg-transparent border-0">
													<TableHead className="w-[80px] text-center font-bold">POS</TableHead>
													<TableHead className="font-bold">PESERTA</TableHead>

													<TableHead className="text-center font-bold">SKOR SPK</TableHead>
													<TableHead className="text-center font-bold">HASIL</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{filteredPeserta.length === 0 ? (
													<TableRow>
														<TableCell colSpan={5} className="py-20 text-center">
															<div className="flex flex-col items-center justify-center opacity-50">
																<div className="p-4 bg-muted rounded-full mb-4">
																	<Users className="w-12 h-12" />
																</div>
																<p className="text-lg">Data ranking belum tersedia atau tidak ditemukan.</p>
															</div>
														</TableCell>
													</TableRow>
												) : (
													filteredPeserta.map((p, index) => (
														<TableRow key={p.id} className="hover:bg-primary/5 transition-colors border-muted/50">
															<TableCell className="text-center">
																<div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-sm font-bold ${
																	p.ranking === 1 ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-200' :
																	p.ranking === 2 ? 'bg-slate-300 text-slate-800 ring-2 ring-slate-100' :
																	p.ranking === 3 ? 'bg-orange-300 text-orange-900 ring-2 ring-orange-100' :
																	'bg-muted text-muted-foreground'
																}`}>
																	{p.ranking}
																</div>
															</TableCell>
															<TableCell>
																<div className="font-bold text-foreground">{p.nama_lengkap}</div>
																<div className="text-xs font-mono text-muted-foreground uppercase">{p.no_pendaftaran}</div>
															</TableCell>

															<TableCell className="text-center font-mono font-medium">
																{parseFloat(p.skor_spk).toFixed(4)}
															</TableCell>
															<TableCell className="text-center">
																<Badge className={`rounded-full px-3 capitalize ${
																	p.status_seleksi === 'lolos' ? 'bg-green-500 hover:bg-green-600' :
																	p.status_seleksi === 'tidak_lolos' ? 'bg-red-500 hover:bg-red-600' :
																	p.status_seleksi === 'cadangan' ? 'bg-yellow-500 hover:bg-yellow-600' :
																	'bg-blue-500 hover:bg-blue-600'
																}`}>
																	{p.status_seleksi}
																</Badge>
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
				</div>
			</main>
			<Footer />
		</>
	);
}
