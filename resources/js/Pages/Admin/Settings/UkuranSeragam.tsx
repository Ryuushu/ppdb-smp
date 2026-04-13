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
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useState } from "react";

interface UkuranSeragam {
	id: number;
	nama_ukuran: string;
	tambahan_biaya: number;
}

export default function UkuranSeragam({
	items,
	title,
}: {
	items: UkuranSeragam[];
	title: string;
}) {
	const { flash } = usePage<any>().props;

	const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
		nama_ukuran: "",
		tambahan_biaya: "",
	});

	const [editId, setEditId] = useState<number | null>(null);

	const handleEdit = (item: UkuranSeragam) => {
		setEditId(item.id);
		clearErrors();
		setData({
			nama_ukuran: item.nama_ukuran,
			tambahan_biaya: item.tambahan_biaya.toString(),
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
			put(route("admin.ukuran-seragam.update", editId), {
				onSuccess: () => {
					setEditId(null);
					reset();
				},
			});
		} else {
			post(route("admin.ukuran-seragam.store"), {
				onSuccess: () => reset(),
			});
		}
	};

	const handleDelete = (id: number) => {
		if (confirm("Apakah Anda yakin ingin menghapus ukuran ini?")) {
			router.delete(route("admin.ukuran-seragam.destroy", id));
		}
	};

	return (
		<>
			<Head title={title} />
			<div className="space-y-6 flex flex-col md:mr-10 items-center max-w-full">
				<AlertMessages flash={flash} />

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
					<Card className="col-span-1 h-fit">
						<CardHeader>
							<CardTitle>{editId ? "Edit Ukuran Baju" : "Tambah Ukuran Baju"}</CardTitle>
							<CardDescription>
								{editId ? "Perbarui detail ukuran baju ini." : "Tambahkan ukuran baju beserta biayanya (0 jika tidak ada tambahan)."}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="nama_ukuran">Nama Ukuran</Label>
									<Input
										id="nama_ukuran"
										placeholder="Contoh: L, XL, XXL"
										value={data.nama_ukuran}
										onChange={(e) => setData("nama_ukuran", e.target.value)}
										required
									/>
									{errors.nama_ukuran && <p className="text-red-500 text-xs">{errors.nama_ukuran}</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="tambahan_biaya">Tambahan Biaya (Rp)</Label>
									<Input
										id="tambahan_biaya"
										type="number"
										placeholder="0"
										value={data.tambahan_biaya}
										onChange={(e) => setData("tambahan_biaya", e.target.value)}
										required
									/>
									{errors.tambahan_biaya && <p className="text-red-500 text-xs">{errors.tambahan_biaya}</p>}
								</div>
								<div className={editId ? "grid grid-cols-2 gap-2" : "flex gap-2"}>
									{editId && (
										<Button type="button" variant="outline" className="w-full" onClick={cancelEdit} disabled={processing}>
											<X className="w-4 h-4 mr-2" /> Batal
										</Button>
									)}
									<Button type="submit" className="w-full" disabled={processing}>
										{editId ? <Pencil className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
										{editId ? "Simpan Perubahan" : "Simpan Ukuran"}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					<Card className="col-span-1 md:col-span-2">
						<CardHeader>
							<CardTitle>Daftar Ukuran & Biaya Tambahan</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nama Ukuran</TableHead>
											<TableHead>Tambahan Biaya</TableHead>
											<TableHead className="text-right">Aksi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{items.length === 0 ? (
											<TableRow>
												<TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
													Belum ada data ukuran baju.
												</TableCell>
											</TableRow>
										) : (
											items.map((item) => (
												<TableRow key={item.id}>
													<TableCell className="font-medium">{item.nama_ukuran}</TableCell>
													<TableCell>
														{new Intl.NumberFormat("id-ID", {
															style: "currency",
															currency: "IDR",
															maximumFractionDigits: 0,
														}).format(item.tambahan_biaya)}
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
