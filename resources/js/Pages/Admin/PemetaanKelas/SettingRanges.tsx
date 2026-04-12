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
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Plus, Trash2, ChevronLeft, Pencil, Check, X } from "lucide-react";
import { useState } from "react";

interface ClassRange {
	id: number;
	class_name: string;
	min_score: number;
	max_score: number;
	max_capacity: number;
}

function EditableRow({ range, onDelete }: { range: ClassRange; onDelete: (id: number) => void }) {
	const [editing, setEditing] = useState(false);
	const [form, setForm] = useState({
		class_name: range.class_name,
		min_score: range.min_score.toString(),
		max_score: range.max_score.toString(),
		max_capacity: range.max_capacity?.toString() ?? "30",
	});

	const handleSave = () => {
		router.put(route("admin.pemetaan-kelas.update_range", range.id), form, {
			preserveScroll: true,
			onSuccess: () => setEditing(false),
		});
	};

	const handleCancel = () => {
		setForm({
			class_name: range.class_name,
			min_score: range.min_score.toString(),
			max_score: range.max_score.toString(),
			max_capacity: range.max_capacity?.toString() ?? "30",
		});
		setEditing(false);
	};

	if (editing) {
		return (
			<TableRow>
				<TableCell>
					<Input
						value={form.class_name}
						onChange={(e) => setForm({ ...form, class_name: e.target.value })}
						className="h-8 text-sm"
					/>
				</TableCell>
				<TableCell>
					<div className="flex gap-1 items-center">
						<Input
							type="number"
							value={form.min_score}
							onChange={(e) => setForm({ ...form, min_score: e.target.value })}
							className="h-8 text-sm w-20"
							placeholder="Min"
						/>
						<span className="text-muted-foreground">-</span>
						<Input
							type="number"
							value={form.max_score}
							onChange={(e) => setForm({ ...form, max_score: e.target.value })}
							className="h-8 text-sm w-20"
							placeholder="Max"
						/>
					</div>
				</TableCell>
				<TableCell>
					<Input
						type="number"
						value={form.max_capacity}
						onChange={(e) => setForm({ ...form, max_capacity: e.target.value })}
						className="h-8 text-sm w-20 text-center"
					/>
				</TableCell>
				<TableCell className="text-right">
					<div className="flex justify-end gap-1">
						<Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-50" onClick={handleSave}>
							<Check className="w-4 h-4" />
						</Button>
						<Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleCancel}>
							<X className="w-4 h-4" />
						</Button>
					</div>
				</TableCell>
			</TableRow>
		);
	}

	return (
		<TableRow>
			<TableCell className="font-bold">{range.class_name}</TableCell>
			<TableCell>
				<span className="px-2 py-1 bg-primary/10 text-primary rounded-md font-mono text-sm">
					{range.min_score} - {range.max_score}
				</span>
			</TableCell>
			<TableCell className="text-center font-bold">
				{range.max_capacity ?? '-'}
			</TableCell>
			<TableCell className="text-right">
				<div className="flex justify-end gap-1">
					<Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
						<Pencil className="w-4 h-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-red-500 hover:text-red-600 hover:bg-red-50"
						onClick={() => onDelete(range.id)}
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}

export default function SettingRanges({
	ranges,
	title,
}: {
	ranges: ClassRange[];
	title: string;
}) {
	const { flash } = usePage<any>().props;

	const { data, setData, post, processing, reset, errors } = useForm({
		class_name: "",
		min_score: "",
		max_score: "",
		max_capacity: "30",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("admin.pemetaan-kelas.store_ranges"), {
			onSuccess: () => reset(),
		});
	};

	const handleDelete = (id: number) => {
		if (confirm("Hapus rentang nilai ini?")) {
			router.delete(route("admin.pemetaan-kelas.delete_range", id));
		}
	};

	return (
		<>
			<Head title={title} />
			<div className="space-y-6">
				<AlertMessages flash={flash} />

				<Button variant="ghost" asChild className="mb-4">
					<Link href={route("admin.pemetaan-kelas.index")}>
						<ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Pemetaan Kelas
					</Link>
				</Button>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="col-span-1 h-fit">
						<CardHeader>
							<CardTitle>Tambah Rentang Kelas</CardTitle>
							<CardDescription>
								Tentukan kategori kelas berdasarkan nilai SPK Calistung (0-100).
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="class_name">Nama Kelas</Label>
									<Input
										id="class_name"
										placeholder="Contoh: Kelas A (Unggulan)"
										value={data.class_name}
										onChange={(e) => setData("class_name", e.target.value)}
										required
									/>
									{errors.class_name && <p className="text-red-500 text-xs">{errors.class_name}</p>}
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="min_score">Min Skor SPK</Label>
										<Input
											id="min_score"
											type="number"
											placeholder="70"
											value={data.min_score}
											onChange={(e) => setData("min_score", e.target.value)}
											required
										/>
                                        {errors.min_score && <p className="text-red-500 text-xs">{errors.min_score}</p>}
									</div>
									<div className="space-y-2">
										<Label htmlFor="max_score">Max Skor SPK</Label>
										<Input
											id="max_score"
											type="number"
											placeholder="100"
											value={data.max_score}
											onChange={(e) => setData("max_score", e.target.value)}
											required
										/>
                                        {errors.max_score && <p className="text-red-500 text-xs">{errors.max_score}</p>}
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="max_capacity">Kapasitas Maksimal Kelas</Label>
									<Input
										id="max_capacity"
										type="number"
										placeholder="30"
										value={data.max_capacity}
										onChange={(e) => setData("max_capacity", e.target.value)}
										required
									/>
									{errors.max_capacity && <p className="text-red-500 text-xs">{errors.max_capacity}</p>}
								</div>
								<Button type="submit" className="w-full" disabled={processing}>
									<Plus className="w-4 h-4 mr-2" /> Simpan Rentang
								</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="col-span-1 md:col-span-2">
						<CardHeader>
							<CardTitle>Daftar Rentang Nilai Kelas</CardTitle>
							<CardDescription>Klik ikon pensil untuk mengedit. Semua perubahan langsung tersimpan.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nama Kelas</TableHead>
											<TableHead>Rentang Nilai SPK</TableHead>
											<TableHead className="text-center">Kap. Maks</TableHead>
											<TableHead className="text-right">Aksi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{ranges.length === 0 ? (
											<TableRow>
												<TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
													Belum ada rentang nilai yang dikonfigurasi.
												</TableCell>
											</TableRow>
										) : (
											ranges.map((range) => (
												<EditableRow key={range.id} range={range} onDelete={handleDelete} />
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
