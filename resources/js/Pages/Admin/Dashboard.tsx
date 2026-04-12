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
	du: { all: number };
	penerimaan: { diterima: number; ditolak: number };
	compareSx: { l: number; p: number };
	compareDx: { l: number; p: number };
	yearDiff: Record<number, { bulan: string; jumlah_pendaftar: number }[]>;
	yearDiffDaftarUlang: Record<
		number,
		{ bulan: string; jumlah_daftar_ulang: number }[]
	>;
	genderOverTime: { bulan: string; laki: number; perempuan: number }[];
	tahun: number;
	lastYear: string;
	oldestYear: number;
	dailyTrends: { tanggal: string; jumlah: number }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard({
	count,
	du,
	penerimaan,
	compareSx,
	compareDx,
	yearDiff,
	yearDiffDaftarUlang,
	genderOverTime,
	tahun,
	lastYear,
	oldestYear,
	dailyTrends,
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

	const genderDuData = [
		{ name: "Laki-laki", value: compareDx.l },
		{ name: "Perempuan", value: compareDx.p },
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

	const yearDiffDuData = months.map((month) => {
		const currentYearData = yearDiffDaftarUlang[tahun]?.find((d) => d.bulan === month);
		const lastYearData = yearDiffDaftarUlang[Number(lastYear)]?.find((d) => d.bulan === month);
		return {
			name: month,
			[`${tahun}`]: currentYearData?.jumlah_daftar_ulang || 0,
			[`${lastYear}`]: lastYearData?.jumlah_daftar_ulang || 0,
		};
	});

	return (
		<>
			<Head title="Dashboard" />

			<div className="space-y-6">
				<div className="flex flex-wrap justify-between items-center gap-4">
					<h1 className="font-bold text-2xl">Dashboard</h1>
					<div className="flex items-center gap-2">
						<Label htmlFor="year-filter">Data Tahun:</Label>
						<Select value={tahun.toString()} onValueChange={handleYearChange}>
							<SelectTrigger className="w-[120px]" id="year-filter">
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
					<div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
						<StatsCard
							title="Total Pendaftar"
							value={count.all}
							icon={Users}
							iconClassName="bg-amber-500"
						/>
						<StatsCard
							title="Laki-laki"
							value={compareSx.l}
							icon={Users}
							iconClassName="bg-blue-500"
						/>
						<StatsCard
							title="Perempuan"
							value={compareSx.p}
							icon={Users}
							iconClassName="bg-pink-500"
						/>
						<StatsCard
							title="Daftar Ulang"
							value={du.all}
							icon={UserCheck}
							iconClassName="bg-emerald-500"
						/>
					</div>
				</section>

				<section>
					<div className="gap-4 grid md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Gender Pendaftar</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={genderData}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value"
										>
											{genderData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Gender Daftar Ulang</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={genderDuData}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value"
										>
											{genderDuData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</section>

				<section>
					<h3 className="mb-4 font-semibold text-xl">Analisis Tren Waktu</h3>
					<div className="gap-4 grid md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Tren Pendaftar Perbulan</CardTitle>
							</CardHeader>
							<CardContent className="px-1">
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={yearDiffData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar dataKey={tahun.toString()} fill="#3b82f6" name={`Tahun ${tahun}`} />
										<Bar dataKey={lastYear} fill="#94a3b8" name={`Tahun ${lastYear}`} />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Tren Daftar Ulang Perbulan</CardTitle>
							</CardHeader>
							<CardContent className="px-1">
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={yearDiffDuData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar dataKey={tahun.toString()} fill="#10b981" name={`Tahun ${tahun}`} />
										<Bar dataKey={lastYear} fill="#94a3b8" name={`Tahun ${lastYear}`} />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</section>

				<section>
					<Card>
						<CardHeader>
							<CardTitle>Komposisi Gender over Time</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={350}>
								<BarChart data={genderOverTime}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="bulan" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey="laki" fill="#3b82f6" name="Laki-laki" stackId="a" />
									<Bar dataKey="perempuan" fill="#ec4899" name="Perempuan" stackId="a" />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
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
}: {
	title: string;
	value: number;
	icon: React.ComponentType<{ className?: string }>;
	iconClassName?: string;
}) {
	return (
		<Card className="py-4">
			<div className="flex items-center px-4 gap-4">
				<div className={cn("p-3 rounded-lg shrink-0", iconClassName)}>
					<Icon className="w-6 h-6 text-white" />
				</div>
				<div>
					<div className="text-2xl font-bold leading-none">{value}</div>
					<div className="text-sm font-medium text-muted-foreground mt-1">
						{title}
					</div>
				</div>
			</div>
		</Card>
	);
}
