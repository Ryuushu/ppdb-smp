import { useState, useEffect } from "react";
import { InertiaPagination as Pagination } from "@/components/inertia-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { CheckCircle2, AlertCircle, Wallet, Search } from "lucide-react";

interface User {
	id: number;
	name: string;
}

interface Peserta {
	id: string;
	no_pendaftaran: string;
	nama_lengkap: string;
	program: { nama: string };
	total_bill: number;
	total_paid: number;
	is_lunas: boolean;
}

interface Kwitansi {
	id: number;
	jenis_pembayaran: string;
	nominal: number;
	created_at: string;
	deleted_at: string | null;
	penerima: User;
	deleted_by: User | null;
	peserta_ppdb: Peserta;
}

interface PaginationData {
	data: Kwitansi[];
	links: any[];
	current_page: number;
	last_page: number;
	total: number;
}

interface JenisPembayaran {
	[key: string]: {
		count: number;
		total: number;
	};
}

interface Props {
	kwitansiesHistory: PaginationData;
	installmentData: {
		data: Peserta[];
		links: any[];
	};
	danaKelola: number;
	jenisPembayaran: JenisPembayaran;
	totalBillMale: number;
	totalBillFemale: number;
	tahun: number;
	years: number[];
	status: string | null;
	program: string | null;
	tab: string;
	search: string | null;
}

export default function Rekap({
	kwitansiesHistory,
	installmentData,
	danaKelola,
	jenisPembayaran,
	tahun,
	years,
	status,
	program,
	tab,
	search,
}: Props) {
	const { csrf_token } = usePage<any>().props;
	const [searchQuery, setSearchQuery] = useState(search || "");

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (searchQuery !== (search || "")) {
				handleFilterChange({ search: searchQuery, page: 1 });
			}
		}, 500);
		return () => clearTimeout(timeout);
	}, [searchQuery]);

	const handleFilterChange = (params: any) => {
		router.get(
			route("ppdb.rekap.kwitansi"),
			{
				tahun,
				status,
				program,
				tab,
				search: searchQuery,
				...params,
			},
			{ preserveState: true, preserveScroll: true },
		);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	return (
		<>
			<Head title="Rekap Kwitansi" />

			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
					<div className="w-full sm:w-1/4">
						<Select
							value={String(tahun)}
							onValueChange={(val) => handleFilterChange({ tahun: val })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Pilih Tahun" />
							</SelectTrigger>
							<SelectContent>
								{years.map((y) => (
									<SelectItem key={y} value={String(y)}>
										{y}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
						{/* Program Filter */}
						<Select
							value={program || "semua"}
							onValueChange={(val) => handleFilterChange({ program: val })}
						>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Semua Program" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="semua">Semua Program</SelectItem>
								<SelectItem value="1">Reguler</SelectItem>
								<SelectItem value="2">Tahfidz</SelectItem>
								<SelectItem value="3">Unggulan</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<Tabs
					value={tab}
					onValueChange={(val) => handleFilterChange({ tab: val })}
					className="w-full"
				>
					<TabsList className="mb-4">
						<TabsTrigger value="ringkasan">
							<Wallet className="size-4 mr-2" /> Ringkasan Dana
						</TabsTrigger>
						<TabsTrigger value="installment">
							<AlertCircle className="size-4 mr-2" /> Status Cicilan Siswa
						</TabsTrigger>
					</TabsList>

					<TabsContent value="ringkasan" className="space-y-6">
						<div className="gap-4 grid grid-cols-1 md:grid-cols-2">
							<Card className="bg-orange-500/10 border-orange-500/20">
								<CardHeader>
									<CardTitle className="text-orange-600 dark:text-orange-400 text-lg">
										Dana Masuk
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-orange-700 dark:text-orange-300 text-3xl">
										{formatCurrency(danaKelola)}
									</div>
								</CardContent>
							</Card>
							<Card className="bg-blue-500/10 border-blue-500/20">
								<CardHeader>
									<CardTitle className="text-blue-600 dark:text-blue-400 text-lg">
										Jumlah Kwitansi
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-blue-700 dark:text-blue-300 text-3xl">
										{Object.values(jenisPembayaran).reduce(
											(sum, item) => sum + item.count,
											0,
										)}
									</div>
								</CardContent>
							</Card>
						</div>

						<div className="gap-6 grid grid-cols-1">
							<Card>
								<CardHeader className="flex flex-row justify-between items-center">
									<CardTitle>Jenis Dana Kelola</CardTitle>
									<Button asChild variant="outline" size="sm">
										<a
											href={`${route("ppdb.rekap.kwitansi-dana")}?tahun=${tahun}`}
											target="_blank"
										>
											Export .xlsx
										</a>
									</Button>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Jenis Pembayaran</TableHead>
												<TableHead>Total Dana</TableHead>
												<TableHead>Jumlah Kwitansi</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{Object.entries(jenisPembayaran).length > 0 ? (
												Object.entries(jenisPembayaran).map(([jenis, data]) => (
													<TableRow key={jenis}>
														<TableCell>{jenis}</TableCell>
														<TableCell>{formatCurrency(data.total)}</TableCell>
														<TableCell>{data.count}</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell colSpan={3} className="text-center">
														Tidak ada data
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row justify-between items-center">
									<CardTitle>Riwayat Kwitansi Terakhir</CardTitle>
									<Button asChild variant="outline" size="sm">
										<a
											href={`${route("ppdb.rekap.kwitansi-riwayat")}?tahun=${tahun}`}
											target="_blank"
										>
											Export .xlsx
										</a>
									</Button>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>No. Peserta</TableHead>
												<TableHead>Nama</TableHead>
												<TableHead>Jenis Pembayaran</TableHead>
												<TableHead>Jumlah</TableHead>
												<TableHead>Tanggal</TableHead>
												<TableHead>Aksi</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{kwitansiesHistory.data.length > 0 ? (
												kwitansiesHistory.data.map((k) => (
													<TableRow
														key={k.id}
														className={
															k.deleted_at ? "bg-red-500/10 dark:bg-red-900/20" : ""
														}
													>
														<TableCell>{k.peserta_ppdb?.no_pendaftaran}</TableCell>
														<TableCell>{k.peserta_ppdb?.nama_lengkap}</TableCell>
														<TableCell>{k.jenis_pembayaran}</TableCell>
														<TableCell>{formatCurrency(k.nominal)}</TableCell>
														<TableCell>
															{format(new Date(k.created_at), "dd/MM/yy HH:mm")}
														</TableCell>
														<TableCell>
															<Button asChild size="sm" variant="secondary">
																<form
																	action={route("ppdb.cetak.kwitansi.single", {
																		uuid: k.peserta_ppdb.id,
																		id: k.id,
																	})}
																	method="post"
																	target="_blank"
																>
																	<input
																		type="hidden"
																		name="_token"
																		value={csrf_token}
																	/>
																	<button type="submit">Cetak</button>
																</form>
															</Button>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell colSpan={6} className="text-center">
														Belum ada kwitansi
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
									<div className="mt-4">
										<Pagination links={kwitansiesHistory.links} />
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="installment">
						<Card>
							<CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
								<div>
									<CardTitle>Status Cicilan Siswa</CardTitle>
									<p className="text-sm text-muted-foreground mt-1">
										Monitoring tagihan administrasi per siswa.
									</p>
								</div>
								<div className="flex flex-col sm:flex-row gap-4 items-center">
									<div className="relative w-full sm:w-64">
										<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="search"
											placeholder="Cari nama atau no pendaftaran..."
											className="pl-8 bg-white dark:bg-black"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
										/>
									</div>
									<div className="flex gap-2">
										<Button
											variant={status === "belum_lunas" ? "default" : "outline"}
											size="sm"
											onClick={() => handleFilterChange({ status: "belum_lunas" })}
										>
											Belum Lunas
										</Button>
										<Button
											variant={status === "lunas" ? "default" : "outline"}
											size="sm"
											onClick={() => handleFilterChange({ status: "lunas" })}
										>
											Lunas
										</Button>
										<Button
											variant={!status || status === "semua" ? "secondary" : "ghost"}
											size="sm"
											onClick={() => handleFilterChange({ status: "semua" })}
										>
											Semua
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Peserta</TableHead>
											<TableHead>Program</TableHead>
											<TableHead>Total Tagihan</TableHead>
											<TableHead>Sudah Bayar</TableHead>
											<TableHead>Progres</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Aksi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{installmentData.data.length > 0 ? (
											installmentData.data.map((p) => {
												const percent =
													p.total_bill > 0
														? (p.total_paid / p.total_bill) * 100
														: 0;
												return (
													<TableRow key={p.id}>
														<TableCell>
															<div className="flex flex-col">
																<span className="font-bold">{p.nama_lengkap}</span>
																<span className="text-xs text-muted-foreground">{p.no_pendaftaran}</span>
															</div>
														</TableCell>
														<TableCell>{p.program.nama}</TableCell>
														<TableCell>{formatCurrency(p.total_bill)}</TableCell>
														<TableCell className="font-medium text-blue-600">
															{formatCurrency(p.total_paid)}
														</TableCell>
														<TableCell className="w-[150px]">
															<div className="flex flex-col gap-1">
																<Progress value={percent} className="h-2" />
																<span className="text-[10px] text-right">{Math.round(percent)}%</span>
															</div>
														</TableCell>
														<TableCell>
															{p.is_lunas ? (
																<Badge className="bg-green-500 hover:bg-green-600">
																	<CheckCircle2 className="size-3 mr-1" /> Lunas
																</Badge>
															) : (
																<Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
																	<AlertCircle className="size-3 mr-1" /> Belum Lunas
																</Badge>
															)}
														</TableCell>
														<TableCell className="text-right">
															<Button asChild variant="ghost" size="sm">
																<Link href={route("ppdb.kwitansi.tambah", { uuid: p.id })}>
																	Bayar/Detail
																</Link>
															</Button>
														</TableCell>
													</TableRow>
												);
											})
										) : (
											<TableRow>
												<TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
													Tidak ada data siswa ditemukan.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
								<div className="mt-4">
									<Pagination links={installmentData.links} />
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
}
