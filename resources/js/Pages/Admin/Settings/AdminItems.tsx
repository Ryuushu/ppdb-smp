import { AlertMessages } from "@/components/alert-messages";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Plus, Trash2, Receipt, Pencil, Layers, ChevronRight } from "lucide-react";
import { useState } from "react";

interface AdminItemExtra {
	id: number;
	name: string;
	amount_male: number;
	amount_female: number;
	admin_item_id: number;
}

interface AdminItem {
	id: number;
	name: string;
	amount_male: number;
	amount_female: number;
	description: string | null;
	extras?: AdminItemExtra[];
}

export default function AdminItems({
	items,
	baseItems,
	title,
}: {
	items: AdminItem[];
	baseItems: AdminItem[];
	title: string;
}) {
	const { flash } = usePage<any>().props;

	// ===== FORM MASTER =====
	const masterForm = useForm({
		name: "",
		amount_male: "",
		amount_female: "",
		description: "",
		is_extra: false,
		parent_id: "",
	});
	const [masterSyncGender, setMasterSyncGender] = useState(false);
	const [masterEditId, setMasterEditId] = useState<number | null>(null);

	const handleEditMaster = (item: AdminItem) => {
		setMasterEditId(item.id);
		masterForm.clearErrors();
		masterForm.setData({
			name: item.name,
			amount_male: item.amount_male.toString(),
			amount_female: item.amount_female.toString(),
			description: item.description || "",
			is_extra: false,
			parent_id: "",
		});
		setMasterSyncGender(item.amount_male === item.amount_female);
	};

	const cancelMasterEdit = () => {
		setMasterEditId(null);
		masterForm.reset();
		masterForm.clearErrors();
		setMasterSyncGender(false);
	};

	const handleMasterSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (masterEditId) {
			masterForm.put(route("admin.admin-items.update", masterEditId), {
				onSuccess: () => { setMasterEditId(null); masterForm.reset(); },
			});
		} else {
			masterForm.post(route("admin.admin-items.store"), {
				onSuccess: () => masterForm.reset(),
			});
		}
	};

	// ===== FORM EXTRA =====
	const extraForm = useForm({
		name: "",
		amount_male: "",
		amount_female: "",
		description: "",
		is_extra: true,
		parent_id: "" as string | number,
	});
	const [extraEditId, setExtraEditId] = useState<number | null>(null);
	const [extraSyncGender, setExtraSyncGender] = useState(false);

	const handleEditExtra = (extra: AdminItemExtra, parentId: number) => {
		setExtraEditId(extra.id);
		extraForm.clearErrors();
		extraForm.setData({
			name: extra.name,
			amount_male: extra.amount_male.toString(),
			amount_female: extra.amount_female.toString(),
			description: "",
			is_extra: true,
			parent_id: parentId,
		});
		setExtraSyncGender(extra.amount_male === extra.amount_female);
	};

	const cancelExtraEdit = () => {
		setExtraEditId(null);
		extraForm.reset();
		extraForm.clearErrors();
		setExtraSyncGender(false);
	};

	const handleExtraSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (extraEditId) {
			extraForm.put(route("admin.admin-items.update", extraEditId), {
				onSuccess: () => { setExtraEditId(null); extraForm.reset(); },
			});
		} else {
			extraForm.post(route("admin.admin-items.store"), {
				onSuccess: () => extraForm.reset(),
			});
		}
	};

	const [selectedMasterIds, setSelectedMasterIds] = useState<number[]>([]);
	const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>([]);

	const handleBulkDelete = (type: "master" | "extra", all = false) => {
		const ids = type === "master" 
			? (all ? items.map(i => i.id) : selectedMasterIds)
			: (all ? allExtras.map(e => e.id) : selectedExtraIds);

		if (ids.length === 0) return;

		if (confirm(`Apakah Anda yakin ingin menghapus ${all ? "SEMUA" : ids.length} data terpilih?`)) {
			router.post(route("admin.admin-items.bulk-destroy"), {
				ids,
				type
			}, {
				onSuccess: () => {
					if (type === "master") setSelectedMasterIds([]);
					else setSelectedExtraIds([]);
				}
			});
		}
	};

	// ===== SHARED =====
	const handleDelete = (id: number, isExtra: boolean = false) => {
		if (confirm("Apakah Anda yakin ingin menghapus biaya ini?")) {
			router.delete(route("admin.admin-items.destroy", id), {
				data: { is_extra: isExtra },
			});
		}
	};

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

	const allExtras = items.flatMap((item) =>
		(item.extras || []).map((extra) => ({ ...extra, parentName: item.name, parentId: item.id }))
	);

	return (
		<>
			<Head title={title} />
			<div className="space-y-8">
				<AlertMessages flash={flash} />

				{/* ============================================================ */}
				{/* SECTION 1: MASTER BIAYA                                      */}
				{/* ============================================================ */}
				<div>
					<div className="flex items-center gap-2 mb-4">
						<Receipt className="w-5 h-5 text-primary" />
						<h2 className="text-xl font-bold text-foreground">Master Biaya</h2>
						<Badge variant="secondary" className="ml-auto text-xs">{items.length} item</Badge>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
						{/* Form Tambah Master */}
						<Card className="lg:col-span-1 h-fit border-primary/20 bg-primary/5">
							<CardHeader className="pb-4">
								<CardTitle className="text-base flex items-center gap-2">
									<Plus className="w-4 h-4" />
									{masterEditId ? "Edit Master" : "Tambah Master"}
								</CardTitle>
								<CardDescription className="text-xs">
									{masterEditId ? "Perbarui detail biaya utama." : "Tambahkan biaya utama baru."}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleMasterSubmit} className="space-y-3">
									<div className="space-y-1.5">
										<Label htmlFor="master_name" className="text-xs">Nama Biaya</Label>
										<Input
											id="master_name"
											placeholder="Contoh: Seragam"
											value={masterForm.data.name}
											onChange={(e) => masterForm.setData("name", e.target.value)}
											required
											className="bg-background h-9 text-sm"
										/>
										{masterForm.errors.name && <p className="text-red-500 text-xs">{masterForm.errors.name}</p>}
									</div>

									<div className="space-y-1.5">
										<Label className="text-xs">Biaya (Rp)</Label>
										<div className="grid grid-cols-2 gap-2">
											<Input
												type="number"
												placeholder="Laki-laki"
												value={masterForm.data.amount_male}
												onChange={(e) => {
													const val = e.target.value;
													masterForm.setData((d) => ({
														...d,
														amount_male: val,
														amount_female: masterSyncGender ? val : d.amount_female,
													}));
												}}
												required
												className="bg-background h-9 text-sm"
											/>
											<Input
												type="number"
												placeholder="Perempuan"
												value={masterForm.data.amount_female}
												onChange={(e) => {
													const val = e.target.value;
													masterForm.setData("amount_female", val);
													if (masterSyncGender && val !== masterForm.data.amount_male) setMasterSyncGender(false);
												}}
												required
												className="bg-background h-9 text-sm"
											/>
										</div>
										<div className="flex items-center space-x-2 pt-0.5">
											<Checkbox
												id="master_sync"
												checked={masterSyncGender}
												onCheckedChange={(c) => {
													setMasterSyncGender(c as boolean);
													if (c) masterForm.setData("amount_female", masterForm.data.amount_male);
												}}
											/>
											<Label htmlFor="master_sync" className="cursor-pointer text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
												Sama untuk semua gender
											</Label>
										</div>
									</div>

									<div className="space-y-1.5">
										<Label htmlFor="master_desc" className="text-xs">Keterangan (Opsional)</Label>
										<Textarea
											id="master_desc"
											placeholder="..."
											value={masterForm.data.description}
											onChange={(e) => masterForm.setData("description", e.target.value)}
											className="bg-background min-h-[50px] text-sm"
										/>
									</div>

									<div className="flex gap-2 pt-1">
										{masterEditId && (
											<Button type="button" variant="outline" size="sm" className="flex-1" onClick={cancelMasterEdit} disabled={masterForm.processing}>
												Batal
											</Button>
										)}
										<Button type="submit" size="sm" className="flex-1" disabled={masterForm.processing}>
											{masterEditId ? "Update" : "Simpan"}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>

						{/* Tabel Master */}
						<Card className="lg:col-span-3">
							<CardHeader className="pb-3 border-b bg-muted/20">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
									<CardTitle className="text-sm font-bold">Daftar Master Biaya</CardTitle>
									<div className="flex gap-2 w-full sm:w-auto">
										<Button 
											variant="destructive" 
											size="xs" 
											className="h-7 text-[10px] px-2"
											disabled={selectedMasterIds.length === 0}
											onClick={() => handleBulkDelete("master")}
										>
											<Trash2 className="w-3 h-3 mr-1" /> Hapus Terpilih ({selectedMasterIds.length})
										</Button>
										<Button 
											variant="outline" 
											size="xs" 
											className="h-7 text-[10px] px-2 text-red-600 border-red-200 hover:bg-red-50"
											onClick={() => handleBulkDelete("master", true)}
										>
											Hapus Semua
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-0">
								<div className="rounded-b-xl overflow-hidden">
									<Table>
										<TableHeader className="bg-muted/50">
											<TableRow>
												<TableHead className="w-[40px] px-2">
													<Checkbox 
														checked={items.length > 0 && selectedMasterIds.length === items.length}
														onCheckedChange={(checked) => {
															if (checked) setSelectedMasterIds(items.map(i => i.id));
															else setSelectedMasterIds([]);
														}}
													/>
												</TableHead>
												<TableHead className="w-[40px]">#</TableHead>
												<TableHead>Nama Biaya</TableHead>
												<TableHead>Biaya Laki-laki</TableHead>
												<TableHead>Biaya Perempuan</TableHead>
												<TableHead>Keterangan</TableHead>
												<TableHead>Jml. Ekstra</TableHead>
												<TableHead className="text-right">Aksi</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{items.length === 0 ? (
												<TableRow>
													<TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
														<Receipt className="w-12 h-12 mx-auto mb-2 opacity-10" />
														<p>Belum ada data master biaya.</p>
													</TableCell>
												</TableRow>
											) : (
												items.map((item, index) => (
													<TableRow key={item.id} className="hover:bg-muted/30">
														<TableCell className="px-2">
															<Checkbox 
																checked={selectedMasterIds.includes(item.id)}
																onCheckedChange={(checked) => {
																	if (checked) setSelectedMasterIds(prev => [...prev, item.id]);
																	else setSelectedMasterIds(prev => prev.filter(id => id !== item.id));
																}}
															/>
														</TableCell>
														<TableCell className="font-medium text-xs text-muted-foreground">{index + 1}</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<div className="w-2 h-2 rounded-full bg-primary" />
																<span className="font-semibold">{item.name}</span>
															</div>
														</TableCell>
														<TableCell>
															<span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold">
																{formatCurrency(item.amount_male)}
															</span>
														</TableCell>
														<TableCell>
															<span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full font-bold">
																{formatCurrency(item.amount_female)}
															</span>
														</TableCell>
														<TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
															{item.description || "-"}
														</TableCell>
														<TableCell>
															<Badge variant="outline" className="text-xs">
																{item.extras?.length || 0} ekstra
															</Badge>
														</TableCell>
														<TableCell className="text-right">
															<div className="flex items-center justify-end gap-1">
																<Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600" onClick={() => handleEditMaster(item)}>
																	<Pencil className="w-4 h-4" />
																</Button>
																<Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id, false)}>
																	<Trash2 className="w-4 h-4" />
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
				</div>

				{/* ============================================================ */}
				{/* SECTION 2: EXTRA BIAYA                                       */}
				{/* ============================================================ */}
				<div>
					<div className="flex items-center gap-2 mb-4">
						<Layers className="w-5 h-5 text-orange-500" />
						<h2 className="text-xl font-bold text-foreground">Extra Biaya</h2>
						<Badge variant="secondary" className="ml-auto text-xs">{allExtras.length} item</Badge>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
						{/* Form Tambah Extra */}
						<Card className="lg:col-span-1 h-fit border-orange-500/20 bg-orange-500/5">
							<CardHeader className="pb-4">
								<CardTitle className="text-base flex items-center gap-2">
									<Plus className="w-4 h-4" />
									{extraEditId ? "Edit Ekstra" : "Tambah Ekstra"}
								</CardTitle>
								<CardDescription className="text-xs">
									{extraEditId ? "Perbarui detail biaya ekstra." : "Tambahkan biaya ekstra/variasi baru. Pisahkan dengan koma (S, M, L) untuk tambah masal."}
								</CardDescription>
							</CardHeader>
							<CardContent>
								{!extraEditId && (
									<div className="mb-4 space-y-2">
										<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Preset Cepat</p>
										<div className="flex flex-wrap gap-1.5">
											<Button 
												type="button" 
												variant="outline" 
												size="sm" 
												className="h-7 text-[10px] px-2 border-orange-200 text-orange-700 bg-orange-100/50 hover:bg-orange-100"
												onClick={() => extraForm.setData("name", "S, M, L, XL, XXL")}
											>
												Ukuran Standar (S, M, L, XL, XXL)
											</Button>
											<Button 
												type="button" 
												variant="outline" 
												size="sm" 
												className="h-7 text-[10px] px-2 border-orange-200 text-orange-700 bg-orange-100/50 hover:bg-orange-100"
												onClick={() => extraForm.setData("name", "S, M, L, XL")}
											>
												S s/d XL
											</Button>
										</div>
									</div>
								)}
								<form onSubmit={handleExtraSubmit} className="space-y-3">
									<div className="space-y-1.5">
										<Label htmlFor="extra_parent" className="text-xs">Pilih Biaya Utama (Induk)</Label>
										<Select
											value={extraForm.data.parent_id?.toString() || ""}
											onValueChange={(val) => extraForm.setData("parent_id", val)}
										>
											<SelectTrigger className="bg-background h-9 text-sm">
												<SelectValue placeholder="Pilih Master Biaya..." />
											</SelectTrigger>
											<SelectContent>
												{items.map((item) => (
													<SelectItem key={item.id} value={item.id.toString()}>
														{item.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{extraForm.errors.parent_id && <p className="text-red-500 text-xs">{extraForm.errors.parent_id}</p>}
									</div>

									<div className="space-y-1.5">
										<Label htmlFor="extra_name" className="text-xs">Nama Ekstra (Pisahkan dengan koma untuk tambah masal)</Label>
										<Input
											id="extra_name"
											placeholder="Contoh: S, M, L, XL"
											value={extraForm.data.name}
											onChange={(e) => extraForm.setData("name", e.target.value)}
											required
											className="bg-background h-9 text-sm"
										/>
										{extraForm.errors.name && <p className="text-red-500 text-xs">{extraForm.errors.name}</p>}
									</div>

									<div className="space-y-1.5">
										<Label className="text-xs">Biaya (Rp)</Label>
										<div className="grid grid-cols-2 gap-2">
											<Input
												type="number"
												placeholder="Laki-laki"
												value={extraForm.data.amount_male}
												onChange={(e) => {
													const val = e.target.value;
													extraForm.setData((d) => ({
														...d,
														amount_male: val,
														amount_female: extraSyncGender ? val : d.amount_female,
													}));
												}}
												required
												className="bg-background h-9 text-sm"
											/>
											<Input
												type="number"
												placeholder="Perempuan"
												value={extraForm.data.amount_female}
												onChange={(e) => {
													const val = e.target.value;
													extraForm.setData("amount_female", val);
													if (extraSyncGender && val !== extraForm.data.amount_male) setExtraSyncGender(false);
												}}
												required
												className="bg-background h-9 text-sm"
											/>
										</div>
										<div className="flex items-center space-x-2 pt-0.5">
											<Checkbox
												id="extra_sync"
												checked={extraSyncGender}
												onCheckedChange={(c) => {
													setExtraSyncGender(c as boolean);
													if (c) extraForm.setData("amount_female", extraForm.data.amount_male);
												}}
											/>
											<Label htmlFor="extra_sync" className="cursor-pointer text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
												Sama untuk semua gender
											</Label>
										</div>
									</div>

									<div className="flex gap-2 pt-1">
										{extraEditId && (
											<Button type="button" variant="outline" size="sm" className="flex-1" onClick={cancelExtraEdit} disabled={extraForm.processing}>
												Batal
											</Button>
										)}
										<Button type="submit" size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={extraForm.processing}>
											{extraEditId ? "Update" : "Simpan"}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>

						{/* Tabel Extra */}
						<Card className="lg:col-span-3">
							<CardHeader className="pb-3 border-b bg-muted/20">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
									<CardTitle className="text-sm font-bold">Daftar Variasi / Ekstra</CardTitle>
									<div className="flex gap-2 w-full sm:w-auto">
										<Button 
											variant="destructive" 
											size="xs" 
											className="h-7 text-[10px] px-2"
											disabled={selectedExtraIds.length === 0}
											onClick={() => handleBulkDelete("extra")}
										>
											<Trash2 className="w-3 h-3 mr-1" /> Hapus Terpilih ({selectedExtraIds.length})
										</Button>
										<Button 
											variant="outline" 
											size="xs" 
											className="h-7 text-[10px] px-2 text-red-600 border-red-100 hover:bg-red-50"
											onClick={() => handleBulkDelete("extra", true)}
										>
											Hapus Semua
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-0">
								<div className="rounded-b-xl overflow-hidden">
									<Table>
										<TableHeader className="bg-muted/50">
											<TableRow>
												<TableHead className="w-[40px] px-2">
													<Checkbox 
														checked={allExtras.length > 0 && selectedExtraIds.length === allExtras.length}
														onCheckedChange={(checked) => {
															if (checked) setSelectedExtraIds(allExtras.map(e => e.id));
															else setSelectedExtraIds([]);
														}}
													/>
												</TableHead>
												<TableHead className="w-[40px]">#</TableHead>
												<TableHead>Induk (Master)</TableHead>
												<TableHead>Nama Ekstra</TableHead>
												<TableHead>Biaya Laki-laki</TableHead>
												<TableHead>Biaya Perempuan</TableHead>
												<TableHead className="text-right">Aksi</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{allExtras.length === 0 ? (
												<TableRow>
													<TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
														<Layers className="w-12 h-12 mx-auto mb-2 opacity-10" />
														<p>Belum ada data biaya ekstra.</p>
														<p className="text-xs mt-1">Pilih master biaya di form samping lalu buat variasi.</p>
													</TableCell>
												</TableRow>
											) : (
												allExtras.map((extra, index) => (
													<TableRow key={`extra-${extra.id}`} className="hover:bg-muted/30">
														<TableCell className="px-2">
															<Checkbox 
																checked={selectedExtraIds.includes(extra.id)}
																onCheckedChange={(checked) => {
																	if (checked) setSelectedExtraIds(prev => [...prev, extra.id]);
																	else setSelectedExtraIds(prev => prev.filter(id => id !== extra.id));
																}}
															/>
														</TableCell>
														<TableCell className="font-medium text-xs text-muted-foreground">{index + 1}</TableCell>
														<TableCell>
															<Badge variant="outline" className="font-medium text-xs">
																{extra.parentName}
															</Badge>
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<ChevronRight className="w-3 h-3 text-muted-foreground" />
																<span className="font-semibold text-sm">{extra.name}</span>
															</div>
														</TableCell>
														<TableCell>
															<span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold">
																{formatCurrency(extra.amount_male)}
															</span>
														</TableCell>
														<TableCell>
															<span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full font-bold">
																{formatCurrency(extra.amount_female)}
															</span>
														</TableCell>
														<TableCell className="text-right">
															<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
																<Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500" onClick={() => handleEditExtra(extra, extra.parentId)}>
																	<Pencil className="w-3 h-3" />
																</Button>
																<Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => handleDelete(extra.id, true)}>
																	<Trash2 className="w-3 h-3" />
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
				</div>

			</div>
		</>
	);
}