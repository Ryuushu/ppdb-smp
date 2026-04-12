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
import { Switch } from "@/components/ui/switch";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Plus, Trash2, Pencil, X, FileText, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface MasterDocument {
	id: number;
	name: string;
	slug: string;
	is_required: boolean;
	is_active: boolean;
	description: string | null;
}

export default function MasterDocuments({
	documents,
	title,
}: {
	documents: MasterDocument[];
	title: string;
}) {
	const { flash } = usePage<any>().props;

	const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
		name: "",
		is_required: false,
		is_active: true,
		description: "",
	});

	const [editId, setEditId] = useState<number | null>(null);

	const handleEdit = (doc: MasterDocument) => {
		setEditId(doc.id);
		clearErrors();
		setData({
			name: doc.name,
			is_required: doc.is_required,
			is_active: doc.is_active,
			description: doc.description || "",
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
			put(route("admin.master-documents.update", editId), {
				onSuccess: () => {
					setEditId(null);
					reset();
				},
			});
		} else {
			post(route("admin.master-documents.store"), {
				onSuccess: () => reset(),
			});
		}
	};

	const handleDelete = (id: number) => {
		if (confirm("Apakah Anda yakin ingin menghapus dokumen ini? File yang sudah diupload peserta untuk jenis ini akan ikut terhapus.")) {
			router.delete(route("admin.master-documents.destroy", id));
		}
	};

	return (
		<>
			<Head title={title} />
			<div className="space-y-6 px-4 py-8 max-w-7xl mx-auto">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
					<p className="text-muted-foreground">
						Atur jenis dokumen yang wajib diunggah oleh calon siswa saat pendaftaran.
					</p>
				</div>

				<AlertMessages flash={flash} />

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<Card className="col-span-1 h-fit shadow-md border-primary/10">
						<CardHeader className="bg-primary/5 border-b pb-4">
							<CardTitle className="text-xl flex items-center gap-2">
								{editId ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
								{editId ? "Edit Dokumen" : "Tambah Dokumen"}
							</CardTitle>
							<CardDescription>
								{editId ? "Perbarui konfigurasi dokumen ini." : "Tambahkan syarat dokumen baru."}
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="name" className="text-sm font-semibold">Nama Dokumen</Label>
									<Input
										id="name"
										placeholder="Contoh: Scan Kartu Keluarga"
										value={data.name}
										onChange={(e) => setData("name", e.target.value)}
										className="rounded-lg border-primary/20 focus:border-primary"
										required
									/>
									{errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
								</div>

								<div className="space-y-4 pt-2">
									<div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="space-y-0.5">
											<Label className="text-base">Wajib Diisi</Label>
											<p className="text-xs text-muted-foreground">Apakah dokumen ini mandatory?</p>
										</div>
										<Switch
											checked={data.is_required}
											onCheckedChange={(checked) => setData("is_required", checked)}
										/>
									</div>

									<div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="space-y-0.5">
											<Label className="text-base">Status Aktif</Label>
											<p className="text-xs text-muted-foreground">Tampilkan di form pendaftaran?</p>
										</div>
										<Switch
											checked={data.is_active}
											onCheckedChange={(checked) => setData("is_active", checked)}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description" className="text-sm font-semibold">Keterangan (Opsional)</Label>
									<Textarea
										id="description"
										placeholder="Contoh: Pastikan foto terlihat jelas dan tidak buram"
										value={data.description}
										onChange={(e) => setData("description", e.target.value)}
										className="rounded-lg border-primary/20 focus:border-primary min-h-[100px]"
									/>
									{errors.description && <p className="text-destructive text-xs mt-1">{errors.description}</p>}
								</div>

								<div className="flex flex-col gap-2 pt-2">
									<Button type="submit" className="w-full rounded-lg" disabled={processing}>
										{editId ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
										{editId ? "Simpan Perubahan" : "Simpan Dokumen"}
									</Button>
									{editId && (
										<Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={cancelEdit} disabled={processing}>
											<X className="w-4 h-4 mr-2" /> Batal Edit
										</Button>
									)}
								</div>
							</form>
						</CardContent>
					</Card>

					<Card className="col-span-1 lg:col-span-2 shadow-md border-primary/10 overflow-hidden">
						<CardHeader className="bg-primary/5 border-b">
							<div className="flex items-center justify-between">
								<CardTitle className="text-xl">Daftar Dokumen Master</CardTitle>
								<Badge variant="outline" className="bg-background">{documents.length} Item</Badge>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<Table>
									<TableHeader className="bg-muted/50">
										<TableRow>
											<TableHead className="w-[40%]">Nama Dokumen</TableHead>
											<TableHead className="text-center">Wajib</TableHead>
											<TableHead className="text-center">Status</TableHead>
											<TableHead className="text-right p-4">Aksi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{documents.length === 0 ? (
											<TableRow>
												<TableCell colSpan={4} className="text-center py-12">
													<div className="flex flex-col items-center gap-2 text-muted-foreground">
														<FileText className="w-12 h-12 opacity-20" />
														<p>Belum ada data dokumen.</p>
													</div>
												</TableCell>
											</TableRow>
										) : (
											documents.map((doc) => (
												<TableRow key={doc.id} className="hover:bg-muted/30 transition-colors">
													<TableCell className="py-4">
														<div className="flex flex-col gap-1">
															<span className="font-bold text-foreground">{doc.name}</span>
															<span className="text-[10px] font-mono text-muted-foreground bg-muted w-fit px-1.5 rounded uppercase tracking-tighter">
																Slug: {doc.slug}
															</span>
															{doc.description && (
																<p className="text-xs text-muted-foreground italic mt-1 line-clamp-1">
																	"{doc.description}"
																</p>
															)}
														</div>
													</TableCell>
													<TableCell className="text-center">
														{doc.is_required ? (
															<Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Wajib</Badge>
														) : (
															<Badge variant="secondary" className="bg-gray-100 text-gray-600">Opsional</Badge>
														)}
													</TableCell>
													<TableCell className="text-center">
														{doc.is_active ? (
															<Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Aktif</Badge>
														) : (
															<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Non-aktif</Badge>
														)}
													</TableCell>
													<TableCell className="text-right p-4">
														<div className="flex items-center justify-end gap-2">
															<Button
																variant="outline"
																size="icon"
																className="h-9 w-9 border-blue-200 text-blue-600 hover:bg-blue-50"
																onClick={() => handleEdit(doc)}
															>
																<Pencil className="w-4 h-4" />
															</Button>
															<Button
																variant="outline"
																size="icon"
																className="h-9 w-9 border-red-200 text-red-600 hover:bg-red-50"
																onClick={() => handleDelete(doc.id)}
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
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4 items-start">
                    <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="font-bold text-blue-900">Petunjuk Penggunaan</h4>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Semua dokumen yang berstatus <strong>Aktif</strong> akan otomatis muncul di form pendaftaran siswa pada tahap ke-4 (Dokumen). 
                            Pastikan Anda memberikan nama yang jelas agar siswa tidak bingung saat mengunggah berkas.
                        </p>
                    </div>
                </div>
			</div>
		</>
	);
}
