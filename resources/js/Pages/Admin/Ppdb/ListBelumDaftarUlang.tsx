import { type Column, DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Head, Link, router } from "@inertiajs/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const programItems = [
	{ id: "semua", name: "Semua Peserta" },
	{ id: "1", name: "Reguler" },
	{ id: "2", name: "Tahfidz" },
	{ id: "3", name: "Unggulan" },
];

interface Program {
	id: number;
	nama: string;
	abbreviation: string;
}

interface Peserta {
	id: string;
	no_pendaftaran: string;
	nama_lengkap: string;
	tempat_lahir: string;
	tanggal_lahir: string;
	no_hp: string;
	asal_sekolah: string;
	program: Program;
	created_at: string;
	diterima: number;
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
	program: string | null;
}

export default function ListBelumDaftarUlang({
	pesertappdb,
	tahun,
	years,
	program,
}: Props) {
	const columns: Column<Peserta>[] = [
		{
			accessorKey: "no_pendaftaran",
			header: "No. Pendaftaran",
			cell: ({ row }) => (
				<Link
					href={route("ppdb.show.peserta", row.original.id)}
					className="font-medium text-primary hover:underline"
				>
					{row.getValue("no_pendaftaran")}
				</Link>
			),
		},
		{
			accessorKey: "nama_lengkap",
			header: "Nama Lengkap",
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue("nama_lengkap")}</div>
			),
		},
		{
			header: "Program",
			cell: ({ row }) => (
				<div className="font-medium text-sm">
					{row.original.program?.abbreviation ||
						row.original.program?.nama ||
						"-"}
				</div>
			),
		},
		{
			accessorKey: "asal_sekolah",
			header: "Asal Sekolah",
			cell: ({ row }) => (
				<div
					className="max-w-[200px] text-muted-foreground text-sm truncate"
					title={row.original.asal_sekolah}
				>
					{row.original.asal_sekolah}
				</div>
			),
		},
		{
			accessorKey: "no_hp",
			header: "No. HP",
			cell: ({ row }) => (
				<a
					href={`https://wa.me/${row.original.no_hp}`}
					target="_blank"
					rel="noreferrer"
					className="font-medium text-green-600 dark:text-green-400 hover:underline"
				>
					{row.getValue("no_hp")}
				</a>
			),
		},
		{
			accessorKey: "diterima",
			header: "Status",
			cell: ({ row }) => {
				const status = row.getValue("diterima");
				if (status === 1) {
					return (
						<Badge className="bg-green-500 hover:bg-green-600">Diterima</Badge>
					);
				} else if (status === 2) {
					return <Badge variant="destructive">Ditolak</Badge>;
				} else {
					return (
						<Badge
							variant="secondary"
							className="bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20 text-yellow-600 dark:text-yellow-400"
						>
							Belum Diverifikasi
						</Badge>
					);
				}
			},
		},
		{
			id: "actions",
			header: "Aksi",
			cell: ({ row }) => (
				<Button asChild size="sm" variant="outline">
					<Link href={route("ppdb.show.peserta", row.original.id)}>Lihat</Link>
				</Button>
			),
		},
	];

	const handleYearChange = (year: string) => {
		router.get(
			window.location.pathname,
			{ tahun: year, program: program || "semua" },
			{ preserveState: true }
		);
	};

	const handleProgramChange = (prog: string) => {
        router.get(route("ppdb.belum.daftar.ulang.list", { program: prog }), { tahun }, { preserveState: true });
	};

	return (
		<>
			<Head title="List Peserta Belum Daftar Ulang" />

			<div className="space-y-6">
                <Tabs value={String(program || "semua")} onValueChange={handleProgramChange}>
                    <TabsList className="mb-2">
                        {programItems.filter(p => p.id !== "2" || Number(tahun) < 2025).map((p) => (
                            <TabsTrigger key={p.id} value={p.id}>
                                {p.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

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
								href={route("export.belum.daftar.ulang", {
									tahun: tahun,
									program: program || "",
								})}
							>
								Export Excel
							</a>
						</Button>
					</div>
				</div>

				<div className="bg-blue-500/10 p-4 border-blue-500 border-l-4 rounded text-blue-700 dark:text-blue-400 text-sm">
					<p className="font-bold">Info!</p>
					<p>
						Peserta yang belum melakukan pembayaran daftar ulang akan tampil
						disini. Jika peserta belum tampil, silahkan melakukan proses daftar
						ulang di menu kwitansi.
					</p>
				</div>

				<DataTable
					columns={columns}
					data={pesertappdb.data}
					pagination={{ links: pesertappdb.links }}
					searchPlaceholder="Cari nama, no pend, asal sekolah..."
					additionalParams={{ program }}
				/>
			</div>
		</>
	);
}
