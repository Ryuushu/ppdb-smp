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
import { Plus, Trash2, Receipt } from "lucide-react";

interface AdminItem {
	id: number;
	name: string;
	amount: number;
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

	const { data, setData, post, processing, reset, errors } = useForm({
		name: "",
		amount: "",
		description: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("admin.admin-items.store"), {
			onSuccess: () => reset(),
		});
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
							<CardTitle>Tambah Biaya</CardTitle>
							<CardDescription>
								Tambahkan item biaya administrasi baru.
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
								<div className="space-y-2">
									<Label htmlFor="amount">Nominal (Rp)</Label>
									<Input
										id="amount"
										type="number"
										placeholder="50000"
										value={data.amount}
										onChange={(e) => setData("amount", e.target.value)}
										required
									/>
									{errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
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
								<Button type="submit" className="w-full" disabled={processing}>
									<Plus className="w-4 h-4 mr-2" /> Simpan Biaya
								</Button>
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
											<TableHead>Nominal</TableHead>
											<TableHead>Keterangan</TableHead>
											<TableHead className="text-right">Aksi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{items.length === 0 ? (
											<TableRow>
												<TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
														}).format(item.amount)}
													</TableCell>
													<TableCell className="text-xs text-muted-foreground">
														{item.description || "-"}
													</TableCell>
													<TableCell className="text-right">
														<Button
															variant="ghost"
															size="icon"
															className="text-red-500 hover:text-red-600 hover:bg-red-50"
															onClick={() => handleDelete(item.id)}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
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
