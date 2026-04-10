import { AlertMessages } from "@/components/alert-messages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

interface Program {
	id: number;
	nama: string;
}

interface Gelombang {
	id: number;
	nama: string;
}

interface Props {
	program: Program[];
	gelombang: Gelombang[];
}

const steps = [
	{ id: 1, title: "Identitas Diri" },
	{ id: 2, title: "Identitas Orang Tua" },
];

export default function Create({ program, gelombang }: Props) {
	const { data, setData, post, processing, errors } = useForm({
		// Identitas Diri
		gelombang_id: gelombang.length > 0 ? String(gelombang[0].id) : "",
		nama_lengkap: "",
		jenis_kelamin: "l",
		tempat_lahir: "",
		tanggal_lahir: "", // dd-mm-yyyy expected by controller/logic? controller validates date but format depends on inputmask
		nik: "",
		alamat_lengkap: "",
		dukuh: "",
		rt: "",
		rw: "",
		desa_kelurahan: "",
		kecamatan: "",
		kabupaten_kota: "",
		provinsi: "",
		kode_pos: "",
		pilihan_jurusan: "",
		asal_sekolah: "",
		tahun_lulus: "",
		nisn: "",
		penerima_kip: false,
		no_kip: "",
		no_hp: "",
		bertindik: false,
		bertato: false,

		// Orang Tua
		nama_ayah: "",
		no_ayah: "",
		pekerjaan_ayah: "",
		nama_ibu: "",
		no_ibu: "",
		pekerjaan_ibu: "",
	});

	const [currentStep, setCurrentStep] = useState(1);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("ppdb.tambah.pendaftar"));
	};

	const nextStep = (e: React.MouseEvent) => {
		e.preventDefault();
		setCurrentStep((prev) => Math.min(prev + 1, 2));
	};

	const prevStep = (e: React.MouseEvent) => {
		e.preventDefault();
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const { flash } = usePage<any>().props;

	return (
		<>
			<Head title="Tambah Peserta SNPMB" />

			<div className="max-w-4xl mx-auto space-y-6">
				<AlertMessages flash={flash} />

				{/* Stepper Header */}
				<div className="flex items-center justify-between mb-8">
					{steps.map((step, index) => (
						<div
							key={step.id}
							className="flex flex-col items-center w-full relative"
						>
							<div
								className={cn(
									"w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-colors",
									currentStep >= step.id
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground",
								)}
							>
								{step.id}
							</div>
							<span
								className={cn(
									"text-sm mt-2 transition-colors",
									currentStep >= step.id
										? "text-primary font-medium"
										: "text-muted-foreground",
								)}
							>
								{step.title}
							</span>

							{index < steps.length - 1 && (
								<div
									className={cn(
										"absolute top-5 left-1/2 w-full h-[2px] -translate-y-1/2 z-0",
										currentStep > step.id ? "bg-primary" : "bg-muted",
									)}
								/>
							)}
						</div>
					))}
				</div>

				<Card>
					<form onSubmit={submit}>
						<CardContent className="space-y-6 py-6">
							{/* Step 1: Identitas Diri */}
							<div className={currentStep === 1 ? "block space-y-4" : "hidden"}>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="gelombang_id">Gelombang Pendaftaran *</Label>
										<Select
											value={data.gelombang_id}
											onValueChange={(v) => setData("gelombang_id", v)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Pilih Gelombang" />
											</SelectTrigger>
											<SelectContent>
												{gelombang.map((g) => (
													<SelectItem key={g.id} value={String(g.id)}>
														{g.nama} ({g.tahun_ajaran})
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.gelombang_id && (
											<span className="text-destructive text-sm">
												{errors.gelombang_id}
											</span>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
										<Input
											id="nama_lengkap"
											value={data.nama_lengkap}
											onChange={(e) => setData("nama_lengkap", e.target.value)}
											placeholder="Masukkan nama lengkap sesuai ijazah"
											required
										/>
										{errors.nama_lengkap && (
											<span className="text-destructive text-sm">
												{errors.nama_lengkap}
											</span>
										)}
									</div>

									<div className="space-y-2">
										<Label>Jenis Kelamin *</Label>
										<RadioGroup
											value={data.jenis_kelamin}
											onValueChange={(v) => setData("jenis_kelamin", v)}
											className="flex space-x-4"
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="l" id="l" />
												<Label htmlFor="l">Laki-laki</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="p" id="p" />
												<Label htmlFor="p">Perempuan</Label>
											</div>
										</RadioGroup>
									</div>

									<div className="space-y-2">
										<Label htmlFor="tempat_lahir">Tempat Lahir *</Label>
										<Input
											id="tempat_lahir"
											value={data.tempat_lahir}
											onChange={(e) => setData("tempat_lahir", e.target.value)}
											placeholder="Contoh: Karanganyar"
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
										<Input
											id="tanggal_lahir"
											type="date"
											value={data.tanggal_lahir}
											onChange={(e) => setData("tanggal_lahir", e.target.value)}
											required
										/>
										{errors.tanggal_lahir && (
											<span className="text-destructive text-sm">
												{errors.tanggal_lahir}
											</span>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="nik">NIK *</Label>
										<Input
											id="nik"
											value={data.nik}
											onChange={(e) => setData("nik", e.target.value)}
											placeholder="Masukkan 16 digit NIK"
											minLength={16}
											maxLength={16}
											pattern="[0-9]{16}"
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="no_hp">No. HP (Whatsapp) *</Label>
										<Input
											id="no_hp"
											type="number"
											value={data.no_hp}
											onChange={(e) => setData("no_hp", e.target.value)}
											placeholder="Contoh: 08xxxxxxxxxx"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="alamat_lengkap">Alamat Jalan</Label>
									<Textarea
										id="alamat_lengkap"
										placeholder="Contoh: Jl. Kutilang No. 12 atau Jl. Diponegoro No. 25"
										value={data.alamat_lengkap}
										onChange={(e) => setData("alamat_lengkap", e.target.value)}
									/>
									<p className="text-muted-foreground text-xs">
										Isi nama jalan/gang saja. Jika tidak diisi, akan otomatis digabungkan dari Dukuh, RT/RW, Desa, Kecamatan, Kabupaten, dan Provinsi.
									</p>
								</div>

								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<Input
										placeholder="Dukuh"
										value={data.dukuh}
										onChange={(e) => setData("dukuh", e.target.value)}
									/>
									<Input
										placeholder="RT"
										value={data.rt}
										onChange={(e) => setData("rt", e.target.value)}
									/>
									<Input
										placeholder="RW"
										value={data.rw}
										onChange={(e) => setData("rw", e.target.value)}
									/>
									<Input
										placeholder="Desa/Kelurahan"
										value={data.desa_kelurahan}
										onChange={(e) => setData("desa_kelurahan", e.target.value)}
									/>
									<Input
										placeholder="Kecamatan"
										value={data.kecamatan}
										onChange={(e) => setData("kecamatan", e.target.value)}
									/>
									<Input
										placeholder="Kab/Kota"
										value={data.kabupaten_kota}
										onChange={(e) => setData("kabupaten_kota", e.target.value)}
									/>
									<Input
										placeholder="Provinsi"
										value={data.provinsi}
										onChange={(e) => setData("provinsi", e.target.value)}
									/>
									<Input
										placeholder="Kode Pos"
										value={data.kode_pos}
										onChange={(e) => setData("kode_pos", e.target.value)}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="pilihan_jurusan">Program Pilihan *</Label>
									<Select
										value={data.pilihan_jurusan}
										onValueChange={(v) => setData("pilihan_jurusan", v)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Pilih Program" />
										</SelectTrigger>
										<SelectContent>
											{program.map((j) => (
												<SelectItem key={j.id} value={String(j.id)}>
													{j.nama}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.pilihan_jurusan && (
										<span className="text-red-500 text-sm">
											{errors.pilihan_jurusan}
										</span>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="asal_sekolah">Asal Sekolah *</Label>
										<Input
											id="asal_sekolah"
											value={data.asal_sekolah}
											onChange={(e) => setData("asal_sekolah", e.target.value)}
											placeholder="Contoh: SMP N 1 Karanganyar"
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="tahun_lulus">Tahun Lulus *</Label>
										<Select
											value={data.tahun_lulus}
											onValueChange={(v) => setData("tahun_lulus", v)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Tahun Lulus" />
											</SelectTrigger>
											<SelectContent>
												{Array.from(
													{ length: 8 },
													(_, i) => new Date().getFullYear() - i,
												).map((y) => (
													<SelectItem key={y} value={String(y)}>
														{y}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="nisn">NISN</Label>
										<Input
											id="nisn"
											value={data.nisn}
											onChange={(e) => setData("nisn", e.target.value)}
											placeholder="Masukkan 10 digit NISN"
										/>
									</div>

									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Checkbox
												id="penerima_kip"
												checked={data.penerima_kip}
												onCheckedChange={(c) => setData("penerima_kip", !!c)}
											/>
											<Label htmlFor="penerima_kip">Penerima KIP</Label>
										</div>
										{data.penerima_kip && (
											<Input
												placeholder="No. KIP"
												value={data.no_kip}
												onChange={(e) => setData("no_kip", e.target.value)}
											/>
										)}
									</div>

									<div className="space-y-2 md:col-span-2">
										<div className="flex flex-wrap items-center gap-6">
											<div className="flex items-center space-x-2">
												<Checkbox
													id="bertindik"
													checked={data.bertindik}
													onCheckedChange={(c) => setData("bertindik", !!c)}
												/>
												<Label htmlFor="bertindik">Bertindik</Label>
											</div>
											<div className="flex items-center space-x-2">
												<Checkbox
													id="bertato"
													checked={data.bertato}
													onCheckedChange={(c) => setData("bertato", !!c)}
												/>
												<Label htmlFor="bertato">Bertato</Label>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Step 2: Identitas Orang Tua */}
							<div className={currentStep === 2 ? "block space-y-4" : "hidden"}>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="nama_ayah">Nama Ayah *</Label>
										<Input
											id="nama_ayah"
											value={data.nama_ayah}
											onChange={(e) => setData("nama_ayah", e.target.value)}
											placeholder="Nama lengkap ayah"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="no_ayah">No. HP Ayah</Label>
										<Input
											id="no_ayah"
											value={data.no_ayah}
											onChange={(e) => setData("no_ayah", e.target.value)}
											placeholder="Contoh: 08xxxxxxxxxx"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="pekerjaan_ayah">Pekerjaan Ayah</Label>
										<Input
											id="pekerjaan_ayah"
											value={data.pekerjaan_ayah}
											onChange={(e) =>
												setData("pekerjaan_ayah", e.target.value)
											}
											placeholder="Contoh: Wiraswasta, Petani, PNS"
										/>
									</div>

									<div className="col-span-2 border-t my-4"></div>

									<div className="space-y-2">
										<Label htmlFor="nama_ibu">Nama Ibu *</Label>
										<Input
											id="nama_ibu"
											value={data.nama_ibu}
											onChange={(e) => setData("nama_ibu", e.target.value)}
											placeholder="Nama lengkap ibu kandung"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="no_ibu">No. HP Ibu</Label>
										<Input
											id="no_ibu"
											value={data.no_ibu}
											onChange={(e) => setData("no_ibu", e.target.value)}
											placeholder="Contoh: 08xxxxxxxxxx"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="pekerjaan_ibu">Pekerjaan Ibu</Label>
										<Input
											id="pekerjaan_ibu"
											value={data.pekerjaan_ibu}
											onChange={(e) => setData("pekerjaan_ibu", e.target.value)}
											placeholder="Contoh: Ibu rumah tangga, Guru"
										/>
									</div>
								</div>
						</div>
					</CardContent>
					<CardFooter className="flex justify-between">
						{currentStep > 1 && (
							<Button variant="outline" onClick={prevStep}>
								Kembali
							</Button>
						)}
						{currentStep === 1 && <div></div>}
						{currentStep < 2 ? (
							<Button onClick={nextStep}>Lanjut</Button>
						) : (
							<Button type="submit" disabled={processing}>
								{processing ? "Menyimpan..." : "Submit"}
							</Button>
						)}
					</CardFooter>
					</form>
				</Card>
			</div>
		</>
	);
}
