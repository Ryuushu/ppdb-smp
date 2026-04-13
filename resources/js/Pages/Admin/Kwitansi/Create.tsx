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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, Calculator, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface User {
	id: number;
	name: string;
}



interface Kwitansi {
	id: number;
	jenis_pembayaran: string;
	nominal: number;
	created_at: string;
	deleted_at: string | null;
	penerima: User;
	deleted_by: User | null;
}

interface Peserta {
	id: string;
	no_pendaftaran: string;
	nama_lengkap: string;
	jenis_kelamin: 'l' | 'p';
	kwitansi: Kwitansi[];
	admin_item_extras?: AdminItemExtra[];
}

interface AdminItem {
	id: number;
	name: string;
	amount_male: number;
	amount_female: number;
}

interface AdminItemExtra {
	id: number;
	name: string;
	amount_male: number;
	amount_female: number;
	admin_item_id: number;
	master?: AdminItem;
}

interface Props {
	peserta: Peserta;
	adminItems: AdminItem[];
}

export default function Create({ peserta, adminItems }: Props) {
	const nonDeletedCount = peserta.kwitansi.filter(k => !k.deleted_at).length;
	const INITIAL_J_P = `Cicilan ke-${nonDeletedCount + 1}`;

	const { data, setData, post, processing, errors, reset } = useForm({
		jenis_pembayaran: INITIAL_J_P,
		nominal: "",
		pembayaran_mode: "cicil" as "cicil" | "lunas",
	});

	const [itemInfo, setItemInfo] = useState<{
		price: number;
		paid: number;
		remaining: number;
	} | null>(null);

	const { flash, csrf_token } = usePage<any>().props;

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	// Total from master biaya
	const totalMaster = adminItems.reduce((sum, item) => {
		const price = peserta.jenis_kelamin === "l" ? (item.amount_male ?? 0) : (item.amount_female ?? 0);
		return sum + Number(price);
	}, 0);

	// Total from selected extras
	const selectedExtras = peserta.admin_item_extras || [];
	const totalExtras = selectedExtras.reduce((sum, extra) => {
		const price = peserta.jenis_kelamin === "l" ? (extra.amount_male ?? 0) : (extra.amount_female ?? 0);
		return sum + Number(price);
	}, 0);

	const totalBill = totalMaster + totalExtras;

	const totalTerbayar = peserta.kwitansi
		.filter((k) => !k.deleted_at)
		.reduce((sum, k) => sum + Number(k.nominal ?? 0), 0);

	const sisaTagihan = totalBill - totalTerbayar;
	const progressPercent = totalBill > 0 ? (totalTerbayar / totalBill) * 100 : 0;

	// In total-based installment logic, max is always sisaTagihan
	const maxAllowed = Math.max(0, sisaTagihan);

	// Handle automatic defaults for payment mode
	useEffect(() => {
		if (data.pembayaran_mode === 'cicil') {
			if (!data.jenis_pembayaran || data.jenis_pembayaran === 'Pelunasan Biaya Administrasi') {
				setData('jenis_pembayaran', INITIAL_J_P);
			}
		} else {
			setData('jenis_pembayaran', 'Pelunasan Biaya Administrasi');
			setData('nominal', maxAllowed.toString());
		}
	}, [data.pembayaran_mode]);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();

		// Cek jika nominal melebihi batas sisa tagihan
		if (Number(data.nominal) > maxAllowed) {
			setData("nominal", maxAllowed.toString());
			return;
		}

		post(route("ppdb.kwitansi.tambah", { uuid: peserta.id }), {
			onSuccess: () => reset(),
		});
	};

	const handleDelete = (id: number) => {
		router.delete(route("ppdb.kwitansi.hapus", { id }), {
			preserveScroll: true,
		});
	};

	const initialInstallmentName = () => {
		const nonDeletedCount = peserta.kwitansi.filter(k => !k.deleted_at).length;
		return `Cicilan ke-${nonDeletedCount + 1}`;
	};

	// Build unified invoice items: master biaya + their selected variations
	let remainingBalanceForAllocation = totalTerbayar;

	// 1. Group master items with their extras if selected
	const itemAllocations = adminItems.map((master) => {
		const selectedExtra = peserta.admin_item_extras?.find(e => e.admin_item_id === master.id);
		
		const masterPrice = Number(peserta.jenis_kelamin === "l" ? (master.amount_male ?? 0) : (master.amount_female ?? 0));
		const extraPrice = selectedExtra ? Number(peserta.jenis_kelamin === "l" ? (selectedExtra.amount_male ?? 0) : (selectedExtra.amount_female ?? 0)) : 0;
		const totalRowPrice = masterPrice + extraPrice;

		let paidForItem = 0;
		if (totalRowPrice > 0) {
			if (remainingBalanceForAllocation >= totalRowPrice) {
				paidForItem = totalRowPrice;
				remainingBalanceForAllocation -= totalRowPrice;
			} else {
				paidForItem = remainingBalanceForAllocation;
				remainingBalanceForAllocation = 0;
			}
		}

		const remainder = Math.max(0, totalRowPrice - paidForItem);
		const isPaid = remainder <= 0 && totalRowPrice > 0;
		
		// Informative name
		const displayName = selectedExtra ? `${master.name} (Variasi: ${selectedExtra.name})` : master.name;

		return { 
			id: `master-${master.id}`, 
			name: displayName, 
			price: totalRowPrice, 
			paidForItem, 
			remainder, 
			isPaid, 
			type: selectedExtra ? 'extra' : 'master', // keep type=extra to trigger the dropdown UI
			originalExtraId: selectedExtra?.id,
			masterId: master.id
		};
	});

	// (If there are any extras NOT associated with the master items, we could add them here, 
	// but based on the system design, extras always belong to a master).

	const handleUpdateVariation = (oldExtraId: number, newExtraId: string) => {
		if (newExtraId === "none" || Number(newExtraId) === oldExtraId) return;
		
		router.put(route("ppdb.kwitansi.update-variation", { uuid: peserta.id }), {
			old_extra_id: oldExtraId,
			new_extra_id: Number(newExtraId)
		}, {
			preserveScroll: true,
		});
	};

	return (
		<>
			<Head title="Tambah Kwitansi" />

			<div className="space-y-6 mx-auto max-w-7xl">
				<AlertMessages flash={flash} />

				{/* Ringkasan Pembayaran Global */}
				<div className="gap-6 grid grid-cols-1 md:grid-cols-3">
					<Card className="bg-primary/5 border-primary/20 md:col-span-2">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center text-lg">
								<Calculator className="mr-2 size-5 text-primary" />
								Ringkasan Progres Pembayaran
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex justify-between items-end">
									<div>
										<p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
											Total Terbayar
										</p>
										<p className="text-3xl font-bold text-primary">
											{formatCurrency(totalTerbayar)}
										</p>
									</div>
									<div className="text-right">
										<p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
											Total Tagihan
										</p>
										<p className="text-lg font-semibold">
											{formatCurrency(totalBill)}
										</p>
									</div>
								</div>
								<div className="space-y-1">
									<div className="flex justify-between text-xs font-medium">
										<span>Progres Pelunasan</span>
										<span>{Math.round(progressPercent)}%</span>
									</div>
									<Progress value={progressPercent} className="h-3" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card
						className={
							sisaTagihan <= 0
								? "bg-green-500/10 border-green-500/20"
								: "bg-orange-500/10 border-orange-500/20"
						}
					>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center text-lg">
								<CreditCard className="mr-2 size-5 text-orange-600" />
								Sisa Tagihan
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<p
									className={
										sisaTagihan <= 0
											? "text-3xl font-bold text-green-600"
											: "text-3xl font-bold text-orange-600"
									}
								>
									{formatCurrency(Math.max(0, sisaTagihan))}
								</p>
								{sisaTagihan <= 0 && totalBill > 0 ? (
									<Badge className="bg-green-500">
										<CheckCircle2 className="size-3 mr-1" /> LUNAS
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="text-orange-600 border-orange-200"
									>
										<AlertCircle className="size-3 mr-1" /> BELUM LUNAS
									</Badge>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center">
							<Info className="mr-2 size-5 text-blue-600" />
							Kumpulan Item Invoice (Tagihan)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border overflow-hidden">
							<Table>
								<TableHeader className="bg-muted/50">
									<TableRow>
										<TableHead>Item Biaya</TableHead>
										<TableHead className="text-right">Harga</TableHead>
										<TableHead className="text-right">Terbayar</TableHead>
										<TableHead className="text-right">Sisa</TableHead>
										<TableHead className="text-center">Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{itemAllocations.map((item) => {
										// If it's an extra, we find its parent and sibling variations
										let variationOptions: any[] = [];
										let originalExtraId = item.originalExtraId || 0;
										
										if (item.type === 'extra' && item.masterId) {
											const master = adminItems.find(m => m.id === item.masterId);
											variationOptions = master?.extras || [];
										}

										return (
											<TableRow key={item.id} className={item.type === 'extra' ? 'bg-orange-50/50' : ''}>
												<TableCell className="font-medium p-2">
													<div className="flex flex-col gap-1">
														<div className="flex items-center gap-2">
															<span className="text-sm">{item.name.split(' — ')[0]}</span>
															{item.type === 'extra' && (
																<Badge variant="outline" className="text-[10px] text-orange-600 border-orange-200">Ekstra / Varian</Badge>
															)}
														</div>
														
														{/* Selection for Variations */}
														{item.type === 'extra' && variationOptions.length > 0 && (
															<div className="mt-1">
																<Select 
																	value={String(originalExtraId)} 
																	onValueChange={(val) => handleUpdateVariation(originalExtraId, val)}
																>
																	<SelectTrigger className="h-8 text-[11px] bg-white border-orange-200 focus:ring-orange-200 w-full sm:w-[200px]">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		{variationOptions.map(opt => (
																			<SelectItem key={opt.id} value={String(opt.id)} className="text-xs">
																				{opt.name} 
																				{(peserta.jenis_kelamin === 'l' ? opt.amount_male : opt.amount_female) > 0 && 
																					` (+ ${formatCurrency(peserta.jenis_kelamin === 'l' ? opt.amount_male : opt.amount_female)})`}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															</div>
														)}
													</div>
												</TableCell>
												<TableCell className="text-right font-mono">{formatCurrency(item.price)}</TableCell>
												<TableCell className="text-right font-mono text-green-600">{formatCurrency(item.paidForItem)}</TableCell>
												<TableCell className="text-right font-mono text-orange-600">{formatCurrency(item.remainder)}</TableCell>
												<TableCell className="text-center">
													{item.isPaid ? (
														<Badge className="bg-green-500 hover:bg-green-600">Lunas</Badge>
													) : (
														<Badge variant="outline" className="text-orange-500 border-orange-200">Belum Lunas</Badge>
													)}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				<Card className="lg:min-w-3xl">
					<CardHeader>
						<CardTitle>Kwitansi Peserta</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={submit} className="space-y-4">
							<div className="gap-4 grid grid-cols-1 md:grid-cols-2">
								<div className="space-y-2">
									<Label>No. Pendaftaran</Label>
									<div className="font-bold text-lg">
										{peserta.no_pendaftaran}
									</div>
								</div>
								<div className="space-y-2">
									<Label>Nama Lengkap</Label>
									<div className="font-medium">{peserta.nama_lengkap}</div>
								</div>
							</div>

							<Separator />

							<div className="gap-4 grid grid-cols-1 md:grid-cols-2">
								<div className="space-y-4">


									</div>
								</div>

								<div className="space-y-4">
									<div className="space-y-2">
										<Label>Mode Pembayaran</Label>
										<div className="flex gap-2 p-1 bg-muted rounded-lg border w-fit">
											<button
												type="button"
												className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${data.pembayaran_mode === 'cicil' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:bg-white/50'}`}
												onClick={() => setData(prev => ({ ...prev, pembayaran_mode: 'cicil' }))}
											>
												Cicilan
											</button>
											<button
												type="button"
												className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${data.pembayaran_mode === 'lunas' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:bg-white/50'}`}
												onClick={() => {
													setData(prev => ({ 
														...prev, 
														pembayaran_mode: 'lunas'
													}));
												}}
											>
												Lunas (Full)
											</button>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="jenis_pembayaran">Jenis Pembayaran / Keterangan</Label>
										<Input
											id="jenis_pembayaran"
											value={data.jenis_pembayaran}
											readOnly={data.pembayaran_mode === 'lunas'}
											onChange={(e) =>
												setData("jenis_pembayaran", e.target.value)
											}
											placeholder="Contoh: Daftar Ulang, Seragam"
											required
										/>
										{errors.jenis_pembayaran && (
											<span className="text-destructive text-sm">
												{errors.jenis_pembayaran}
											</span>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="nominal">Jumlah Pembayaran (Rp)</Label>
										<Input
											id="nominal"
											type="number"
											min="1"
											max={maxAllowed}
											value={data.nominal}
											readOnly={data.pembayaran_mode === 'lunas'}
											className={data.pembayaran_mode === 'lunas' ? 'bg-muted font-bold text-lg' : ''}
											onChange={(e) => {
												let val = e.target.value;
												if (Number(val) > maxAllowed) {
													val = maxAllowed.toString();
												}
												setData("nominal", val);
											}}
											placeholder="Contoh: 150000"
											required
										/>
										<p className="text-muted-foreground text-xs">
											*Tanpa titik maupun koma
											<span className="ml-1 text-primary font-medium">
												(Maksimal: {formatCurrency(maxAllowed)})
											</span>
										</p>
									{errors.nominal && (
										<span className="text-destructive text-sm">
											{errors.nominal}
										</span>
									)}
								</div>
							</div>

							<Button type="submit" disabled={processing || sisaTagihan <= 0}>
								{processing ? "Menyimpan..." : "Tambah Kwitansi"}
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card className="lg:min-w-3xl">
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle>Riwayat Pembayaran</CardTitle>
						<div className="flex gap-2">
							<Button
								variant="outline"
								className="hover:bg-background cursor-default"
							>
								Total: {formatCurrency(totalTerbayar)}
							</Button>
							<Button asChild>
								<form
									action={route("ppdb.cetak.kwitansi", { uuid: peserta.id })}
									method="post"
									target="_blank"
								>
									<input type="hidden" name="_token" value={csrf_token} />
									<button type="submit">Cetak Semua</button>
								</form>
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						{peserta.kwitansi.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Jenis Pembayaran</TableHead>
										<TableHead>Jumlah</TableHead>
										<TableHead>Pada Tanggal</TableHead>
										<TableHead>Penerima</TableHead>
										<TableHead>Aksi</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{peserta.kwitansi.map((k) => (
										<TableRow
											key={k.id}
											className={
												k.deleted_at ? "bg-red-500/10 dark:bg-red-900/20" : ""
											}
										>
											<TableCell>{k.jenis_pembayaran}</TableCell>
											<TableCell>{formatCurrency(k.nominal)}</TableCell>
											<TableCell>
												{format(new Date(k.created_at), "dd MMMM yyyy HH:mm")}
											</TableCell>
											<TableCell>
												{k.deleted_at ? (
													<div className="text-destructive">
														<strong>Dihapus</strong>
														<br />
														<span className="text-xs">
															{k.deleted_by?.name}
														</span>
													</div>
												) : (
													<div className="text-green-600 dark:text-green-400">
														<strong>Diterima</strong>
														<br />
														<span className="text-xs">{k.penerima?.name}</span>
													</div>
												)}
											</TableCell>
											<TableCell className="flex gap-2">
												{!k.deleted_at && (
													<>
														<Button asChild size="sm" variant="secondary">
															<form
																action={route("ppdb.cetak.kwitansi.single", {
																	uuid: peserta.id,
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

														<AlertDialog>
															<AlertDialogTrigger asChild>
																<Button size="sm" variant="destructive">
																	Hapus
																</Button>
															</AlertDialogTrigger>
															<AlertDialogContent>
																<AlertDialogHeader>
																	<AlertDialogTitle>
																		Hapus Kwitansi?
																	</AlertDialogTitle>
																	<AlertDialogDescription>
																		Transaksi ini akan ditandai sebagai dihapus.
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter>
																	<AlertDialogCancel>Batal</AlertDialogCancel>
																	<AlertDialogAction
																		onClick={() => handleDelete(k.id)}
																		className="bg-red-600 hover:bg-red-700"
																	>
																		Hapus
																	</AlertDialogAction>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
													</>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<div className="py-4 text-muted-foreground text-center">
								Belum ada kwitansi.
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
