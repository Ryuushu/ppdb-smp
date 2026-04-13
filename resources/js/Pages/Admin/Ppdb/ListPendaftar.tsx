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
import { formatDate, formatDateTime } from "@/lib/date";
import { Head, Link, router } from "@inertiajs/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";



interface Peserta {
	id: string;
	no_pendaftaran: string;
	nama_lengkap: string;
	tempat_lahir: string;
	tanggal_lahir: string;
	no_hp: string;



	diterima: number; // 0: proses, 1: diterima, 2: ditolak
	created_at: string;
}

interface Props {
	pesertappdb: {
		data: Peserta[];
		links: any[];
		meta: any;
	};
	tahun: number;
	years: number[];

}

export default function ListPendaftar({
	pesertappdb,
	tahun,
	years,
}: Props) {
	const columns: Column<Peserta>[] = [
		{
			header: "Identitas Peserta",
			className: "min-w-[200px]",
			cell: ({ row }) => (
				<div className="flex flex-col">
					<span className="font-mono text-muted-foreground text-xs">
						{row.original.no_pendaftaran}
					</span>
					<Link
						href={route("ppdb.show.peserta", row.original.id)}
						className="font-bold text-primary hover:underline"
					>
						{row.original.nama_lengkap}
					</Link>
				</div>
			),
		},
		{
			header: "Info Peserta",
			className: "hidden md:table-cell",
			cell: ({ row }) => (
				<div className="flex flex-col text-sm">
					<div className="flex items-center gap-1">
						<span className="text-muted-foreground">TTL:</span>
						<span>
							{row.original.tempat_lahir},{" "}
							{formatDate(row.original.tanggal_lahir)}
						</span>
					</div>
				</div>
			),
		},
		{
			header: "Kontak",
			className: "hidden sm:table-cell",
			cell: ({ row }) => (
				<a
					href={`https://wa.me/${row.original.no_hp}`}
					target="_blank"
					rel="noreferrer"
					className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400 text-sm hover:underline"
				>
					{row.original.no_hp}
				</a>
			),
		},

		{
			header: "Terdaftar",
			className: "hidden lg:table-cell",
			cell: ({ row }) => (
				<span className="text-muted-foreground text-xs">
					{formatDateTime(row.original.created_at)}
				</span>
			),
		},
	];

	const handleYearChange = (year: string) => {
		router.get(
			window.location.pathname,
			{ tahun: year },
			{ preserveState: true }
		);
	};

	return (
		<>
			<Head title="List Peserta SNPMB" />

			<div className="space-y-6">

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
								href={route("export.peserta.ppdb", {
									tahun: tahun,
									all: 1,
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
			</div>
		</>
	);
}
