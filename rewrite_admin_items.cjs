const fs = require('fs');
let content = fs.readFileSync('c:/laragon/www/ppdb-smp/resources/js/Pages/Admin/Settings/AdminItems.tsx', 'utf8');

const sizeFormStr = `
	const ukuranForm = useForm({
		nama_ukuran: "",
		tambahan_biaya: "",
	});

	const [editUkuranId, setEditUkuranId] = useState<number | null>(null);

	const handleEditUkuran = (item: any) => {
		setEditUkuranId(item.id);
		ukuranForm.clearErrors();
		ukuranForm.setData({
			nama_ukuran: item.nama_ukuran,
			tambahan_biaya: item.tambahan_biaya.toString(),
		});
	};

	const cancelEditUkuran = () => {
		setEditUkuranId(null);
		ukuranForm.reset();
		ukuranForm.clearErrors();
	};

	const handleUkuranSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editUkuranId) {
			ukuranForm.put(\`/dashboard/setting/ukuran-seragam/\${editUkuranId}\`, {
				onSuccess: () => {
					setEditUkuranId(null);
					ukuranForm.reset();
				},
			});
		} else {
			ukuranForm.post(route("admin.ukuran-seragam.store"), {
				onSuccess: () => ukuranForm.reset(),
			});
		}
	};

	const handleDeleteUkuran = (id: number) => {
		if (confirm("Apakah Anda yakin ingin menghapus ukuran ini?")) {
			router.delete(\`/dashboard/setting/ukuran-seragam/\${id}\`);
		}
	};
`;

content = content.replace('const [editId, setEditId] = useState<number | null>(null);', 'const [editId, setEditId] = useState<number | null>(null);\n' + sizeFormStr);

const sizeJsxStr = `
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
					<Card className="col-span-1 h-fit">
						<CardHeader>
							<CardTitle>{editUkuranId ? "Edit Ukuran Baju" : "Tambah Ukuran Baju"}</CardTitle>
							<CardDescription>
								Kelola daftar ukuran baju beserta biaya tambahannya.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleUkuranSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="nama_ukuran">Nama / Tipe Ukuran</Label>
									<Input
										id="nama_ukuran"
										placeholder="Contoh: XL / JUMBO"
										value={ukuranForm.data.nama_ukuran}
										onChange={(e) => ukuranForm.setData("nama_ukuran", e.target.value)}
										required
									/>
									{ukuranForm.errors.nama_ukuran && <p className="text-red-500 text-xs">{ukuranForm.errors.nama_ukuran}</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="tambahan_biaya">Tambahan Biaya (Rp)</Label>
									<Input
										id="tambahan_biaya"
										type="number"
										placeholder="0 jika tidak ada tambahan"
										value={ukuranForm.data.tambahan_biaya}
										onChange={(e) => ukuranForm.setData("tambahan_biaya", e.target.value)}
										required
									/>
									{ukuranForm.errors.tambahan_biaya && <p className="text-red-500 text-xs">{ukuranForm.errors.tambahan_biaya}</p>}
                                    <p className="text-xs text-muted-foreground">Isi 0 jika ukuran ini adalah ukuran standar tanpa biaya tambahan.</p>
								</div>
								<div className={editUkuranId ? "grid grid-cols-2 gap-2" : "flex gap-2"}>
									{editUkuranId && (
										<Button type="button" variant="outline" className="w-full" onClick={cancelEditUkuran} disabled={ukuranForm.processing}>
											<X className="w-4 h-4 mr-2" /> Batal
										</Button>
									)}
									<Button type="submit" className="w-full" disabled={ukuranForm.processing}>
										{editUkuranId ? <Pencil className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
										{editUkuranId ? "Simpan Perubahan" : "Simpan Ukuran"}
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
											<TableHead>Ukuran</TableHead>
											<TableHead>Tambahan Biaya</TableHead>
											<TableHead className="text-right">Aksi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{!masterUkuranSeragams || masterUkuranSeragams.length === 0 ? (
											<TableRow>
												<TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
													Belum ada data ukuran baju.
												</TableCell>
											</TableRow>
										) : (
											masterUkuranSeragams.map((item) => (
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
																onClick={() => handleEditUkuran(item)}
															>
																<Pencil className="w-4 h-4" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																className="text-red-500 hover:text-red-600 hover:bg-red-50"
																onClick={() => handleDeleteUkuran(item.id)}
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
`;

content = content.replace('</div>\n			</div>\n		</>\n	);\n}', '}</div>\n' + sizeJsxStr + '\n			</div>\n		</>\n	);\n}');

fs.writeFileSync('c:/laragon/www/ppdb-smp/resources/js/Pages/Admin/Settings/AdminItems.tsx', content);

