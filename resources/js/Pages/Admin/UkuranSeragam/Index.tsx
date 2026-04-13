import { AlertMessages } from "@/components/alert-messages";
import { type Column, DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";



interface UkuranSeragam {
	id: number;
	master_ukuran_seragam_id: number | null;
	master_ukuran: {
		id: number;
		nama_ukuran: string;
		tambahan_biaya: number;
	} | null;
}

interface Peserta {
	id: string;
	no_pendaftaran: string;
	nama_lengkap: string;
	jenis_kelamin: "l" | "p";
	status_pembayaran: string;
	ukuran_seragam: UkuranSeragam | null;
}

interface PaginationLink {
	url: string | null;
	label: string;
	active: boolean;
}

interface Props {
	pesertappdb: {
		data: Peserta[];
		links: PaginationLink[];
		current_page: number;
		last_page: number;
		total: number;
	};
	tahun: number;
	years: number[];
	masterUkuranSeragams: any[];
}

export default function Index({ pesertappdb, tahun, years, masterUkuranSeragams }: Props) {
	const { flash } = usePage<any>().props;

	// Edit Modal State
	const [selectedPeserta, setSelectedPeserta] = useState<Peserta | null>(null);
	const [open, setOpen] = useState(false);

	const {
		data: formData,
		setData,
		post,
		processing,
		errors,
		reset,
	} = useForm({
		uuid: "",
		master_ukuran_seragam_id: "",
	});

	const handleEdit = (peserta: Peserta) => {
		setSelectedPeserta(peserta);
		setData({
			uuid: peserta.id,
			master_ukuran_seragam_id: peserta.ukuran_seragam?.master_ukuran_seragam_id ? String(peserta.ukuran_seragam?.master_ukuran_seragam_id) : "",
		});
		setOpen(true);
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("ppdb.ubah.seragam"), {
			onSuccess: () => {
				setOpen(false);
				reset();
			},
		});
	};

	const columns: Column<Peserta>[] = [
		{
			accessorKey: "no_pendaftaran",
			header: "No. Pendaftaran",
			cell: ({ row }) => (
				<div>
					<div className="font-medium text-primary">
						{row.getValue("no_pendaftaran")}
					</div>
				</div>
			),
		},
		{
			accessorKey: "nama_lengkap",
			header: "Nama Lengkap",
			cell: ({ row }) => (
				<Link
					href={route("ppdb.show.peserta", row.original.id)}
					className="font-medium hover:underline"
				>
					{row.getValue("nama_lengkap")}
				</Link>
			),
		},
		{
			accessorKey: "jenis_kelamin",
			header: "L/P",
			cell: ({ row }) => (
				<Badge variant="outline">
					{row.getValue("jenis_kelamin") === "l" ? "L" : "P"}
				</Badge>
			),
		},
		{
			id: "baju",
			header: "Ukuran Baju",
			cell: ({ row }) => row.original.ukuran_seragam?.master_ukuran?.nama_ukuran || "-",
		},
		
		{
			id: "actions",
			header: "Aksi",
			cell: ({ row }) => (
				<Button size="sm" onClick={() => handleEdit(row.original)}>
					Ubah
				</Button>
			),
		},
	];

	const handleYearChange = (year: string) => {
		router.get(
			route("ppdb.seragam.show.program"),
			{ tahun: year },
			{ preserveState: true }
		);
	};

	return (
		<>
			<Head title="Ukuran Seragam Siswa" />

			<div className="space-y-6">
				<AlertMessages flash={flash} />



				<div className="flex sm:flex-row flex-col justify-between gap-4">
					<div className="w-full sm:w-1/4">
						<Select value={String(tahun)} onValueChange={handleYearChange}>
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

					<div className="flex items-center gap-2">
						<Button asChild>
							<a
								href={route("export.seragam", {
									tahun: tahun,
								})}
							>
								Export Excel
							</a>
						</Button>
					</div>
				</div>

				<DataTable
					columns={columns}
					data={pesertappdb.data}
					pagination={{ links: pesertappdb.links }}
					searchPlaceholder="Cari nama, no pend..."
				/>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>Ubah Ukuran Seragam</DialogTitle>
							<DialogDescription>
								{selectedPeserta?.nama_lengkap}
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={submit} className="space-y-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="master_ukuran_seragam_id">Pilih Ukuran Baju</Label>
									<Select
										value={formData.master_ukuran_seragam_id}
										onValueChange={(v) => setData("master_ukuran_seragam_id", v)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Pilih Ukuran Seragam" />
										</SelectTrigger>
										<SelectContent>
											{masterUkuranSeragams.map((u) => (
												<SelectItem key={u.id} value={String(u.id)}>
													Ukuran {u.nama_ukuran} {u.tambahan_biaya > 0 ? `(+ Rp. ${u.tambahan_biaya.toLocaleString('id-ID')})` : ''}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.master_ukuran_seragam_id && <p className="text-red-500 text-xs">{errors.master_ukuran_seragam_id}</p>}
								</div>
							</div>

							<DialogFooter>
								<Button type="submit" disabled={processing}>
									Simpan Perubahan
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
}
