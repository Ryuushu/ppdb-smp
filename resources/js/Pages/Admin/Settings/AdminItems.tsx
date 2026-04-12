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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Plus, Trash2, Receipt, Pencil, X } from "lucide-react";
import { useState } from "react";

interface AdminItem {
	id: number;
	name: string;
	amount_male: number;
	amount_female: number;
	description: string | null;
}

export default function AdminItems({
	items,
	title,
}: {
	items: AdminItem[];
	title: string;
}) {
	const { flash } = usePage<any>().props;

	const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
		name: "",
		amount_male: "",
		amount_female: "",
		description: "",
	});

	const [editId, setEditId] = useState<number | null>(null);

	const handleEdit = (item: AdminItem) => {
		setEditId(item.id);
		clearErrors();
		setData({
			name: item.name,
			amount_male: item.amount_male.toString(),
			amount_female: item.amount_female.toString(),
			description: item.description || "",
		});
	};

	const cancelEdit = () => {
		setEditId(null);
		reset();
		clearErrors();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editId) {
			put(route("admin.admin-items.update", editId), {
				onSuccess: () => {
					setEditId(null);
					reset();
				},
			});
		} else {
			post(route("admin.admin-items.store"), {
				onSuccess: () => reset(),
			});
		}
	};

	const handleDelete = (id: number) => {
		if (confirm("Apakah Anda yakin ingin menghapus biaya ini?")) {
			router.delete(route("admin.admin-items.destroy", id));
		}
	};

	return (
		<>
			<Head title={title} />
			<div className="space-y-6">
				<AlertMessages flash={flash} />

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="col-span-1 h-fit">
						<CardHeader>
							<CardTitle>{editId ? "Edit Biaya" : "Tambah Biaya"}</CardTitle>
							<CardDescription>
								{editId ? "Perbarui detail biaya administrasi ini." : "Tambahkan item biaya administrasi baru."}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Nama Biaya</Label>
									<Input
										id="name"
										placeholder="Contoh: Biaya Pendaftaran"
										value={data.name}
										onChange={(e) => setData("name", e.target.value)}
										required
									/>
									{errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="amount_male">Pria (Rp)</Label>
										<Input
											id="amount_male"
											type="number"
											placeholder="Pria"
											value={data.amount_male}
											onChange={(e) => setData("amount_male", e.target.value)}
											required
										/>
										{errors.amount_male && <p className="text-red-500 text-xs">{errors.amount_male}</p>}
									</div>
									<div className="space-y-2">
										<Label htmlFor="amount_female">Wanita (Rp)</Label>
										<Input
											id="amount_female"
											type="number"
											placeholder="Wanita"
											value={data.amount_female}
											onChange={(e) => setData("amount_female", e.target.value)}
											required
										/>
										{errors.amount_female && <p className="text-red-500 text-xs">{errors.amount_female}</p>}
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="description">Keterangan (Opsional)</Label>
									<Textarea
										id="description"
										placeholder="Penjelasan singkat mengenai biaya ini"
										value={data.description}
										onChange={(e) => setData("description", e.target.value)}
									/>
									{errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
								</div>
								<div className={editId ? "grid grid-cols-2 gap-2" : "flex gap-2"}>
									{editId && (
										<Button type="button" variant="outline" className="w-full" onClick={cancelEdit} disabled={processing}>
											<X className="w-4 h-4 mr-2" /> Batal
										</Button>
									)}
									<Button type="submit" className="w-full" disabled={processing}>
										{editId ? <Pencil className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
										{editId ? "Simpan Perubahan" : "Simpan Biaya"}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					<Card className="col-span-1 md:col-span-2">
						<CardHeader>
							<CardTitle>Daftar Biaya Administrasi</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nama Biaya</TableHead>
											<TableHead>Pria</TableHead>
											<TableHead>Wanita</TableHead>
											<TableHead>Keterangan</TableHead>
											<TableHead className="text-right">Aksi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{items.length === 0 ? (
											<TableRow>
												<TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
													Belum ada data biaya administrasi.
												</TableCell>
											</TableRow>
										) : (
											items.map((item) => (
												<TableRow key={item.id}>
													<TableCell className="font-medium">{item.name}</TableCell>
													<TableCell>
														{new Intl.NumberFormat("id-ID", {
															style: "currency",
															currency: "IDR",
															maximumFractionDigits: 0,
														}).format(item.amount_male)}
													</TableCell>
													<TableCell>
														{new Intl.NumberFormat("id-ID", {
															style: "currency",
															currency: "IDR",
															maximumFractionDigits: 0,
														}).format(item.amount_female)}
													</TableCell>
													<TableCell className="text-xs text-muted-foreground">
														{item.description || "-"}
													</TableCell>
													<TableCell className="text-right">
														<div className="flex items-center justify-end gap-1">
															<Button
																variant="ghost"
																size="icon"
																className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
																onClick={() => handleEdit(item)}
															>
																<Pencil className="w-4 h-4" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																className="text-red-500 hover:text-red-600 hover:bg-red-50"
																onClick={() => handleDelete(item.id)}
															>
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
		</>
	);
}
