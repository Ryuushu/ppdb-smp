import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Shirt, Filter, User, Calendar } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Extra {
    id: number;
    name: string;
    amount_male: number;
    amount_female: number;
    master?: {
        name: string;
    }
}

interface Peserta {
	id: string;
	no_pendaftaran: string;
	nama_lengkap: string;
    jenis_kelamin: 'l' | 'p' | 'L' | 'P';
    admin_item_extras: Extra[];
}

interface Props {
	peserta: Peserta[];
	search: string | null;
	status: string | null;
}

export default function RekapSeragam({
	peserta,
	search,
	status,
}: Props) {
	const [searchQuery, setSearchQuery] = useState(search || "");

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (searchQuery !== (search || "")) {
				handleFilterChange({ search: searchQuery });
			}
		}, 500);
		return () => clearTimeout(timeout);
	}, [searchQuery]);

	const handleFilterChange = (params: any) => {
		router.get(
			route("ppdb.rekap.seragam"),
			{
				search: searchQuery,
				...params,
			},
			{ preserveState: true, preserveScroll: true },
		);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(amount);
	};

    // Grouping stats
    const statsBySize: Record<string, number> = {};
    peserta.forEach(p => {
        p.admin_item_extras.forEach(extra => {
            const size = extra.name;
            statsBySize[size] = (statsBySize[size] || 0) + 1;
        });
    });

	return (
		<>
			<Head title="Rekap Seragam Siswa" />

			<div className="space-y-6">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <User className="size-4 text-primary" /> Total Siswa Berukuran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{peserta.length}</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Shirt className="size-4 text-orange-500" /> Ringkasan Ukuran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {Object.entries(statsBySize).sort().map(([size, count]) => (
                                    <div key={size} className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full border">
                                        <span className="font-bold text-primary">{size}</span>: 
                                        <span className="text-sm font-medium">{count} Siswa</span>
                                    </div>
                                ))}
                                {Object.keys(statsBySize).length === 0 && <span className="text-xs text-muted-foreground italic">Belum ada data variasi terpilih.</span>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

				<Card>
					<CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 border-b pb-4 mb-4">
						<div>
							<CardTitle className="text-lg">Detail Pilihan Siswa</CardTitle>
							<p className="text-xs text-muted-foreground mt-1 lowercase">
								Daftar siswa yang telah memilih variasi tambahan (Seragam, Jas, dll).
							</p>
						</div>
						<div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
							<div className="relative w-full sm:w-64">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Cari nama atau no pendaftaran..."
									className="pl-8 bg-background border-primary/20"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
                            <Button variant="outline" size="sm" className="h-10 text-xs px-4 border-primary/20">
                                <Filter className="size-3 mr-2" /> Filter
                            </Button>
						</div>
					</CardHeader>
					<CardContent className="p-0 sm:p-6">
						<div className="rounded-xl border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[180px]">No. Pendaftaran</TableHead>
                                        <TableHead>Nama Peserta</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Pilihan Variasi (Ukuran)</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {peserta.length > 0 ? (
                                        peserta.map((p) => (
                                            <TableRow key={p.id} className="hover:bg-muted/30 group">
                                                <TableCell className="font-mono text-xs">{p.no_pendaftaran}</TableCell>
                                                <TableCell className="font-semibold">{p.nama_lengkap}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={p.jenis_kelamin.toLowerCase() === 'l' ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-pink-600 border-pink-200 bg-pink-50'}>
                                                        {p.jenis_kelamin.toLowerCase() === 'l' ? 'Laki-laki' : 'Perempuan'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {p.admin_item_extras.map(extra => (
                                                            <div key={extra.id} className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
                                                                <span className="text-[10px] opacity-70 italic">{extra.master?.name || 'Ekstra'}:</span>
                                                                <span className="font-bold">{extra.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button asChild variant="ghost" size="xs" className="h-8 text-[10px] sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link href={route("ppdb.kwitansi.tambah", { uuid: p.id })}>
                                                           Detail/Bayar
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                                                <Shirt className="size-16 mx-auto mb-4 opacity-5" />
                                                <p className="font-medium">Tidak ada data siswa ditemukan.</p>
                                                <p className="text-xs">Pastikan siswa sudah memilih variasi ukuran saat mendaftar.</p>
                                            </TableCell>
                                        </TableRow>
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
