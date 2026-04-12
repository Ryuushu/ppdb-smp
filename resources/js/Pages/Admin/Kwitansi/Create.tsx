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
import { useState } from "react";
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

interface Program {
	id: number;
	nama: string;
	abbreviation: string;
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
	program: Program;
	kwitansi: Kwitansi[];
}

interface AdminItem {
	id: number;
	name: string;
	amount_male: number;
	amount_female: number;
}

interface Props {
	peserta: Peserta;
	adminItems: AdminItem[];
}

export default function Create({ peserta, adminItems }: Props) {
	const { data, setData, post, processing, errors, reset } = useForm({
		jenis_pembayaran: "",
		nominal: "",
	});

	const [itemInfo, setItemInfo] = useState<{
		price: number;
		paid: number;
		remaining: number;
	} | null>(null);

	const { flash, csrf_token } = usePage<any>().props;

	const submit = (e: React.FormEvent) => {
		e.preventDefault();

		// Cek jika nominal melebihi batas (untuk item yang terdaftar)
		if (maxAllowedForItem !== null && Number(data.nominal) > maxAllowedForItem) {
			setData("nominal", maxAllowedForItem.toString());
			return;
		}

		post(route("ppdb.kwitansi.tambah", { uuid: peserta.id }), {
			onSuccess: () => reset(),
		});
	};

	const handleDelete = (id: number) => {
		router.delete(route("ppdb.kwitansi.hapus", { id }));
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const totalBill = adminItems.reduce((sum, item) => {
		const price =
			peserta.jenis_kelamin === "l"
				? (item.amount_male ?? 0)
				: (item.amount_female ?? 0);
		return sum + Number(price);
	}, 0);

	const totalTerbayar = peserta.kwitansi
		.filter((k) => !k.deleted_at)
		.reduce((sum, k) => sum + Number(k.nominal ?? 0), 0);

	const sisaTagihan = totalBill - totalTerbayar;
	const progressPercent = totalBill > 0 ? (totalTerbayar / totalBill) * 100 : 0;

	// Calculate max allowed for currently selected item name
	const matchingAdminItem = adminItems.find(
		(i) => i.name.toLowerCase() === data.jenis_pembayaran.toLowerCase(),
	);

	const maxAllowedForItem = matchingAdminItem
		? (() => {
				const price =
					peserta.jenis_kelamin === "l"
						? (matchingAdminItem.amount_male ?? 0)
						: (matchingAdminItem.amount_female ?? 0);
				const alreadyPaid = peserta.kwitansi
					.filter(
						(k) =>
							!k.deleted_at &&
							k.jenis_pembayaran.toLowerCase() ===
								matchingAdminItem.name.toLowerCase(),
					)
					.reduce((sum, k) => sum + Number(k.nominal ?? 0), 0);
				return Math.max(0, price - alreadyPaid);
			})()
		: null;

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
									<div className="space-y-2">
										<Label>Pilih Item Biaya (Opsional)</Label>
										<Select
											onValueChange={(value) => {
												const item = adminItems.find(
													(i) => i.id.toString() === value,
												);
												if (item) {
													const itemPrice = Number(
														peserta.jenis_kelamin === "l"
															? (item.amount_male ?? 0)
															: (item.amount_female ?? 0),
													);

													// Hitung berapa yang sudah dibayar untuk item ini (berdasarkan nama)
													const alreadyPaid = peserta.kwitansi
														.filter(
															(k) =>
																!k.deleted_at &&
																k.jenis_pembayaran.toLowerCase() ===
																	item.name.toLowerCase(),
														)
														.reduce(
															(sum, k) => sum + Number(k.nominal ?? 0),
															0,
														);

													const remainder = Math.max(0, itemPrice - alreadyPaid);

													setItemInfo({
														price: itemPrice,
														paid: alreadyPaid,
														remaining: remainder,
													});

													setData({
														...data,
														jenis_pembayaran: item.name,
														nominal: remainder > 0 ? remainder.toString() : itemPrice.toString(),
													});
												}
											}}
										>
											<SelectTrigger>
												<SelectValue placeholder="Pilih biaya yang terdaftar..." />
											</SelectTrigger>
											<SelectContent>
												{adminItems.map((item) => (
													<SelectItem key={item.id} value={item.id.toString()}>
														{item.name} - (P: {formatCurrency(item.amount_male)} / W: {formatCurrency(item.amount_female)})
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{itemInfo && (
											<div className="mt-2 p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-2 shadow-sm animate-in fade-in slide-in-from-top-1">
												<Info className="size-4 text-blue-600 mt-0.5" />
												<div className="text-xs text-blue-700 space-y-1">
													<div className="flex justify-between gap-4">
														<span>Harga Item:</span>
														<span className="font-semibold">{formatCurrency(itemInfo.price)}</span>
													</div>
													<div className="flex justify-between gap-4">
														<span>Sudah Dibayar:</span>
														<span className="font-semibold">{formatCurrency(itemInfo.paid)}</span>
													</div>
													<div className="h-px bg-blue-200 my-1" />
													<div className="flex justify-between gap-4 text-blue-900 font-bold">
														<span>Sisa Tagihan Item:</span>
														<span>{formatCurrency(itemInfo.remaining)}</span>
													</div>
												</div>
											</div>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="jenis_pembayaran">Jenis Pembayaran</Label>
										<Input
											id="jenis_pembayaran"
											value={data.jenis_pembayaran}
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
								</div>
									<div className="space-y-2">
										<Label htmlFor="nominal">Jumlah (Rp)</Label>
										<Input
											id="nominal"
											type="number"
											min="1"
											max={maxAllowedForItem ?? undefined}
											value={data.nominal}
											onChange={(e) => {
												let val = e.target.value;
												if (maxAllowedForItem !== null && Number(val) > maxAllowedForItem) {
													val = maxAllowedForItem.toString();
												}
												setData("nominal", val);
											}}
											placeholder="Contoh: 150000"
											required
										/>
										<p className="text-muted-foreground text-xs">
											*Tanpa titik maupun koma
											{maxAllowedForItem !== null && (
												<span className="ml-1 text-primary font-medium">
													(Maks: {formatCurrency(maxAllowedForItem)})
												</span>
											)}
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
