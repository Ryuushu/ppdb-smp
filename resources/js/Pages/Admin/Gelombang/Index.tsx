import { AlertMessages } from "@/components/alert-messages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { CalendarPlus, Eye, PenIcon, Trash2 } from "lucide-react";
import { formatDateFull } from "@/lib/date";

interface Gelombang {
	id: number;
	nama: string;
	kuota: number;
	tanggal_mulai: string;
	tanggal_selesai: string;
	status: string;
	tahun_ajaran: string;
	peserta_count: number;
}

const statusColors: Record<string, string> = {
	draft: "bg-gray-500",
	buka: "bg-green-500",
	tutup: "bg-red-500",
	pengumuman: "bg-blue-500",
	daftar_ulang: "bg-yellow-500",
	selesai: "bg-purple-500",
};

export default function Index({
	gelombang,
	title,
}: {
	gelombang: Gelombang[];
	title: string;
}) {
	const { flash } = usePage<any>().props;

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus gelombang ${nama}? Seluruh data kriteria dan peserta yang terkait akan ikut terhapus.`)) {
            router.delete(route('admin.gelombang.destroy', id));
        }
    }

	return (
		<>
			<Head title={title} />
			<div className="space-y-6">
				<AlertMessages flash={flash} />

				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>{title}</CardTitle>
						<Button asChild>
							<Link href={route("admin.gelombang.create")}>
								<CalendarPlus className="w-4 h-4 mr-2" /> Tambah Gelombang
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Nama Gelombang</TableHead>
										<TableHead>Periode</TableHead>
										<TableHead>Kuota</TableHead>
										<TableHead>Pendaftar</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Aksi</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{gelombang.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
												Belum ada data gelombang.
											</TableCell>
										</TableRow>
									) : (
										gelombang.map((g) => (
											<TableRow key={g.id}>
												<TableCell className="font-medium">
													{g.nama}
													<div className="text-xs text-muted-foreground">
														{g.tahun_ajaran}
													</div>
												</TableCell>
												<TableCell className="text-sm">
													{formatDateFull(g.tanggal_mulai)} -{" "}
													{formatDateFull(g.tanggal_selesai)}
												</TableCell>
												<TableCell>{g.kuota}</TableCell>
												<TableCell>{g.peserta_count}</TableCell>
												<TableCell>
													<Badge className={statusColors[g.status] || "bg-gray-500"}>
														{g.status.replace("_", " ").toUpperCase()}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex gap-2">
														<Button variant="outline" size="sm" asChild>
															<Link href={route("admin.gelombang.show", g.id)}>
																<Eye className="w-4 h-4 mr-1" /> Detail
															</Link>
														</Button>
														<Button variant="outline" size="sm" asChild>
															<Link href={route("admin.gelombang.edit", g.id)}>
																<PenIcon className="w-4 h-4" />
															</Link>
														</Button>
														<Button variant="outline" size="sm" onClick={() => handleDelete(g.id, g.nama)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
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
		</>
	);
}
