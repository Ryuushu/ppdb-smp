import { AlertMessages } from "@/components/alert-messages";
import { type Column, DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formatDate, formatDateFull } from "@/lib/date";
import { Head, Link, router, usePage } from "@inertiajs/react";
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
	tanggal_lahir: string; // ISO date string
	no_hp: string;
	asal_sekolah: string;
	program: Program;
}

interface PaginationLink {
	url: string | null;
	label: string;
	active: boolean;
}

interface Settings {
	no_surat: string;
	batas_akhir_ppdb: string | null;
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
	title: string;
	printSingleRoute: string; // Route name, e.g. 'ppdb.cetak.surat'
	printAllRoute: string; // Route name, e.g. 'ppdb.cetak.surat.semua'
	showSettings: boolean;
	settings?: Settings;
}

export default function Index({
	pesertappdb,
	tahun,
	years,
	program,
	title,
	printSingleRoute,
	printAllRoute,
	showSettings,
	settings,
}: Props) {
	const { flash, csrf_token } = usePage<any>().props;

	const columns: Column<Peserta>[] = [
		{
			header: "Identitas Peserta",
			className: "min-w-[200px]",
			cell: ({ row }) => (
				<div className="flex flex-col">
					<span className="text-xs text-muted-foreground font-mono">
						{row.original.no_pendaftaran}
					</span>
					<Link
						href={route("ppdb.show.peserta", row.original.id)}
						className="text-primary hover:underline font-bold"
					>
						{row.original.nama_lengkap}
					</Link>
					<span className="text-xs sm:hidden text-muted-foreground mt-1">
						{row.original.program?.nama || "-"}
					</span>
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
					<div className="flex items-center gap-1">
						<span className="text-muted-foreground">Asal:</span>
						<span className="truncate max-w-[150px]">
							{row.original.asal_sekolah}
						</span>
					</div>
				</div>
			),
		},
		{
			header: "Program",
			className: "hidden sm:table-cell",
			cell: ({ row }) => (
				<div className="text-sm font-medium">
					{row.original.program?.abbreviation ||
						row.original.program?.nama ||
						"-"}
				</div>
			),
		},
		{
			id: "actions",
			header: "Aksi",
			cell: ({ row }) => (
				<form action={route(printSingleRoute, row.original.id)} method="POST">
					<input type="hidden" name="_token" value={csrf_token} />
					<Button type="submit" size="sm">
						Cetak
					</Button>
				</form>
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
        // Safe check in case route().current() returns undefined
        const currentRoute = route().current() || "";
        router.get(route(currentRoute, { program: prog }), { tahun }, { preserveState: true });
	};

	const handlePrintAll = (e: React.FormEvent) => {
		// Since we need to submit a POST request to open in new tab (maybe?), strict HTML form is better for this than Inertia router which expects JSON/XHR usually unless we use window.open
		// In the original blade:
		// <form action="{{ route('ppdb.cetak.surat.semua', ['jurusan' => $jurusan]) }}" method="POST">
		// So we should replicate that behavior using a real form or helper.
		// We can render a real form hidden or just use the onSubmit to create one.
		// Or actually just put a form around the button.
	};

	return (
		<>
			<Head title={title} />

			<div className="space-y-6">
				<AlertMessages flash={flash} />

				{showSettings && settings && (
					<Card>
						<CardHeader>
							<CardTitle>Pengaturan Surat</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<div className="font-bold">No. Surat:</div>
								<div>{settings.no_surat}</div>
							</div>
							<div>
								<div className="font-bold">Batas Akhir SPMB:</div>
								<div>
									{settings.batas_akhir_ppdb
										? formatDateFull(settings.batas_akhir_ppdb)
										: "-"}
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button asChild>
								<Link href={route("snpmb.set.batas.akhir")}>Atur</Link>
							</Button>
						</CardFooter>
					</Card>
				)}

				<Card className="p-4">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-bold">{title}</h3>
						<div className="flex items-center gap-2">
							<form
								action={route(printAllRoute, { program: program || "semua" })}
								method="POST"
								target="_blank"
							>
								<input
									type="hidden"
									name="_token"
									value={(usePage().props as any).csrf_token}
								/>
								<Button type="submit">
									<span className="mr-2">Cetak Semua</span>
								</Button>
							</form>
						</div>
					</div>

                    <Tabs value={String(program || "semua")} onValueChange={handleProgramChange}>
                        <TabsList className="mb-4">
                            {programItems.filter(p => p.id !== "2" || Number(tahun) < 2025).map((p) => (
                                <TabsTrigger key={p.id} value={p.id}>
                                    {p.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

					<div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
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
					</div>

					<DataTable
						columns={columns}
						data={pesertappdb.data}
						pagination={{ links: pesertappdb.links }}
						searchEndpoint={window.location.pathname}
						searchPlaceholder="Cari nama, no pend..."
						additionalParams={{ program }}
					/>
				</Card>
			</div>
		</>
	);
}
