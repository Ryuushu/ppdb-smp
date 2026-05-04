import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import {
    Film,
    Laptop,
    Leaf,
    Settings,
    UserCheck,
    Users,
    UserX,
    Wifi,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface DashboardProps {
	count: { all: number };
	penerimaan: { diterima: number; ditolak: number };
	compareSx: { l: number; p: number };
	yearDiff: Record<number, { bulan: string; jumlah_pendaftar: number }[]>;
	genderOverTime: { bulan: string; laki: number; perempuan: number }[];
	tahun: number;
	lastYear: string;
	oldestYear: number;
	gelombangStats: { nama: string; jumlah: number; kuota: number }[];
	paymentStats: { lunas: number; nyicil: number; belum_bayar: number };
}

const COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"];
const PAYMENT_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function Dashboard({
	count,
	penerimaan,
	compareSx,
	yearDiff,
	genderOverTime,
	tahun,
	lastYear,
	oldestYear,
	dailyTrends,
	gelombangStats,
	paymentStats,
}: DashboardProps) {
	const currentYear = new Date().getFullYear();
	const yearOptions: number[] = [];
	for (let i = currentYear; i >= oldestYear; i--) {
		yearOptions.push(i);
	}

	const handleYearChange = (value: string) => {
		router.visit(route("dashboard", { tahun: value }), {
			preserveState: true,
			preserveScroll: true,
		});
	};

	const genderData = [
		{ name: "Laki-laki", value: compareSx.l },
		{ name: "Perempuan", value: compareSx.p },
	];

	const paymentData = [
		{ name: "Lunas", value: paymentStats.lunas },
		{ name: "Nyicil", value: paymentStats.nyicil },
		{ name: "Belum Bayar", value: paymentStats.belum_bayar },
	];

	const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

	const yearDiffData = months.map((month) => {
		const currentYearData = yearDiff[tahun]?.find((d) => d.bulan === month);
		const lastYearData = yearDiff[Number(lastYear)]?.find((d) => d.bulan === month);
		return {
			name: month,
			[`${tahun}`]: currentYearData?.jumlah_pendaftar || 0,
			[`${lastYear}`]: lastYearData?.jumlah_pendaftar || 0,
		};
	});

	return (
		<>
			<Head title="Dashboard" />

			<div className="space-y-8">
				<div className="flex flex-wrap justify-between items-center gap-4 bg-white/50 p-4 rounded-xl border border-blue-100 backdrop-blur-sm shadow-sm">
					<div>
						<h1 className="font-bold text-3xl text-blue-900 tracking-tight">Dashboard Admin</h1>
						<p className="text-muted-foreground mt-1">Ringkasan pendaftaran PPDB</p>
					</div>
					<div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
						<Label htmlFor="year-filter" className="font-semibold text-blue-800">Tahun:</Label>
						<Select value={tahun.toString()} onValueChange={handleYearChange}>
							<SelectTrigger className="w-[130px] border-none shadow-none focus:ring-0" id="year-filter">
								<SelectValue placeholder="Pilih Tahun" />
							</SelectTrigger>
							<SelectContent>
								{yearOptions.map((year) => (
									<SelectItem key={year} value={year.toString()}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<section>
					<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
						<StatsCard
							title="Total Pendaftar"
							value={count.all}
							icon={Users}
							iconClassName="bg-blue-600 shadow-blue-200"
							description="Total siswa mendaftar"
						/>
						<StatsCard
							title="Laki-laki"
							value={compareSx.l}
							icon={Users}
							iconClassName="bg-sky-500 shadow-sky-200"
							description="Pendaftar laki-laki"
						/>
						<StatsCard
							title="Perempuan"
							value={compareSx.p}
							icon={Users}
							iconClassName="bg-pink-500 shadow-pink-200"
							description="Pendaftar perempuan"
						/>
						<StatsCard
							title="Status Seleksi"
							value={penerimaan.diterima}
							icon={UserCheck}
							iconClassName="bg-emerald-500 shadow-emerald-200"
							description={`${penerimaan.diterima} Diterima / ${penerimaan.ditolak} Ditolak`}
						/>
					</div>
				</section>

				<section className="space-y-4">
					<h3 className="font-bold text-xl text-blue-900">Statistik Gelombang & Gender</h3>
					<div className="gap-6 grid lg:grid-cols-2">
						<Card className="border-none shadow-md overflow-hidden bg-white/80 backdrop-blur-sm">
							<CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b">
								<CardTitle className="text-blue-800">Komposisi Gelombang</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={gelombangStats} layout="vertical" margin={{ left: 20 }}>
										<CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
										<XAxis type="number" hide />
										<YAxis 
											dataKey="nama" 
											type="category" 
											tick={{ fontSize: 12, fontWeight: 500 }}
											width={80}
										/>
										<Tooltip 
											cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
											contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
										/>
										<Bar 
											dataKey="jumlah" 
											radius={[0, 4, 4, 0]} 
											name="Pendaftar"
										>
											{gelombangStats.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card className="border-none shadow-md overflow-hidden bg-white/80 backdrop-blur-sm">
							<CardHeader className="bg-gradient-to-r from-pink-50 to-transparent border-b">
								<CardTitle className="text-blue-800">Distribusi Gender</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={genderData}
											cx="50%"
											cy="50%"
											innerRadius={70}
											outerRadius={100}
											paddingAngle={8}
											dataKey="value"
										>
											{genderData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
											))}
										</Pie>
										<Tooltip 
											contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
										/>
										<Legend verticalAlign="bottom" height={36}/>
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</section>

				<section className="space-y-4">
					<h3 className="font-bold text-xl text-blue-900">Statistik Pembayaran</h3>
					<div className="gap-6 grid lg:grid-cols-2">
						<Card className="border-none shadow-md overflow-hidden bg-white/80 backdrop-blur-sm">
							<CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent border-b">
								<CardTitle className="text-blue-800">Status Pembayaran</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={paymentData}
											cx="50%"
											cy="50%"
											innerRadius={70}
											outerRadius={100}
											paddingAngle={8}
											dataKey="value"
										>
											{paymentData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} stroke="none" />
											))}
										</Pie>
										<Tooltip 
											contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
										/>
										<Legend verticalAlign="bottom" height={36}/>
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<div className="grid grid-cols-1 gap-4">
							<StatsCard
								title="Lunas"
								value={paymentStats.lunas}
								icon={UserCheck}
								iconClassName="bg-emerald-500 shadow-emerald-200"
								description="Pembayaran selesai"
							/>
							<StatsCard
								title="Mencicil"
								value={paymentStats.nyicil}
								icon={Laptop} // Using Laptop icon as a placeholder for installment
								iconClassName="bg-amber-500 shadow-amber-200"
								description="Pembayaran sebagian"
							/>
							<StatsCard
								title="Belum Bayar"
								value={paymentStats.belum_bayar}
								icon={UserX}
								iconClassName="bg-rose-500 shadow-rose-200"
								description="Belum ada transaksi"
							/>
						</div>
					</div>
				</section>

				<section className="space-y-4">
					<h3 className="font-bold text-xl text-blue-900">Analisis Tren Waktu</h3>
					<div className="gap-6 grid lg:grid-cols-2">
						<Card className="border-none shadow-md overflow-hidden bg-white/80 backdrop-blur-sm">
							<CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b">
								<CardTitle className="text-blue-800">Tren Pendaftar Perbulan</CardTitle>
							</CardHeader>
							<CardContent className="pt-6 px-1">
								<ResponsiveContainer width="100%" height={320}>
									<BarChart data={yearDiffData}>
										<CartesianGrid strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="name" tick={{ fontSize: 12 }} />
										<YAxis tick={{ fontSize: 12 }} />
										<Tooltip 
											contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
										/>
										<Legend />
										<Bar dataKey={tahun.toString()} fill="#3b82f6" name={`Tahun ${tahun}`} radius={[4, 4, 0, 0]} />
										<Bar dataKey={lastYear} fill="#94a3b8" name={`Tahun ${lastYear}`} radius={[4, 4, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card className="border-none shadow-md overflow-hidden bg-white/80 backdrop-blur-sm">
							<CardHeader className="bg-gradient-to-r from-purple-50 to-transparent border-b">
								<CardTitle className="text-blue-800">Komposisi Gender over Time</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								<ResponsiveContainer width="100%" height={320}>
									<BarChart data={genderOverTime}>
										<CartesianGrid strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
										<YAxis tick={{ fontSize: 12 }} />
										<Tooltip 
											contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
										/>
										<Legend />
										<Bar dataKey="laki" fill="#3b82f6" name="Laki-laki" stackId="a" radius={[0, 0, 0, 0]} />
										<Bar dataKey="perempuan" fill="#ec4899" name="Perempuan" stackId="a" radius={[4, 4, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</section>
			</div>
		</>
	);
}

function StatsCard({
	title,
	value,
	icon: Icon,
	iconClassName,
	description,
}: {
	title: string;
	value: number;
	icon: React.ComponentType<{ className?: string }>;
	iconClassName?: string;
	description?: string;
}) {
	return (
		<Card className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
			<div className="flex items-center p-5 gap-4">
				<div className={cn("p-4 rounded-2xl shrink-0 shadow-lg", iconClassName)}>
					<Icon className="w-6 h-6 text-white" />
				</div>
				<div className="flex-1 overflow-hidden">
					<div className="text-3xl font-bold leading-tight text-blue-950">{value.toLocaleString()}</div>
					<div className="text-sm font-semibold text-blue-800/70 truncate uppercase tracking-wider">
						{title}
					</div>
					{description && (
						<p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
					)}
				</div>
			</div>
		</Card>
	);
}
