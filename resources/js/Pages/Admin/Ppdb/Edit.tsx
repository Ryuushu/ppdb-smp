import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AlertMessages } from "@/components/alert-messages";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { formatDateShort } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";



interface Peserta {
	id: string; // UUID
	tahun_ajaran: string;
	nama_lengkap: string;
	jenis_kelamin: string;
	tempat_lahir: string;
	tanggal_lahir: string;
	nik: string;
	nisn: string;
	agama: string;
	alamat_lengkap: string;
	dukuh: string;
	rt: string;
	rw: string;
	desa_kelurahan: string;
	kecamatan: string;
	kabupaten_kota: string;
	provinsi: string;
	kode_pos: string;
	
	// Additional identity
	jumlah_saudara_kandung: number;
	anak_ke: number;
	status_anak: string;
	no_kip: string;
	no_kip_kks_pkh: string;
	no_hp: string;
	no_hp_pribadi: string;
	bertindik: boolean;
	bertato: boolean;

	// Riwayat
	pernah_paud: boolean;
	pernah_tk: boolean;
	asal_sekolah: string;
	npsn_sekolah_asal: string;
	alamat_sekolah_asal: string;
	tahun_lulus: string;

	// Bakat
	prestasi_diraih: string;
	pengalaman_berkesan: string;
	cita_cita: string;
	ekstrakurikuler: string[];

	// Orang Tua
	nama_ayah: string;
	nik_ayah: string;
	pendidikan_ayah: string;
	no_hp_ayah: string;
	pekerjaan_ayah: string;
	nama_ibu: string;
	nik_ibu: string;
	pendidikan_ibu: string;
	no_hp_ibu: string;
	pekerjaan_ibu: string;
	penghasilan_ortu: string;

	// Documents
	documents: any[];

	rekomendasi_mwc: number; // boolean like
	saran_dari: string;
}

interface Props {
	peserta: Peserta;
    masterDocuments: any[];
}

const steps = [
	{ id: 1, title: "Identitas Diri" },
	{ id: 2, title: "Identitas Orang Tua" },
    { id: 3, title: "Riwayat & Bakat" },
    { id: 4, title: "Dokumen" },
];

export default function Edit({ peserta, masterDocuments }: Props) {
	const { data, setData, put, processing, errors } = useForm({
		// Identitas Diri
		nama_lengkap: peserta.nama_lengkap || "",
		jenis_kelamin: peserta.jenis_kelamin || "l",
		tempat_lahir: peserta.tempat_lahir || "",
		tanggal_lahir: peserta.tanggal_lahir
			? format(new Date(peserta.tanggal_lahir), "yyyy-MM-dd")
			: "",
		nik: peserta.nik || "",
		alamat_lengkap: peserta.alamat_lengkap || "",
		dukuh: peserta.dukuh || "",
		rt: peserta.rt || "",
		rw: peserta.rw || "",
		desa_kelurahan: peserta.desa_kelurahan || "",
		kecamatan: peserta.kecamatan || "",
		kabupaten_kota: peserta.kabupaten_kota || "",
		provinsi: peserta.provinsi || "",
		kode_pos: peserta.kode_pos || "",

		nisn: peserta.nisn || "",
        agama: peserta.agama || "",
        jumlah_saudara_kandung: peserta.jumlah_saudara_kandung || "",
        anak_ke: peserta.anak_ke || "",
        status_anak: peserta.status_anak || "Kandung",
		no_hp: peserta.no_hp || "",
        no_hp_pribadi: peserta.no_hp_pribadi || "",
		bertindik: !!peserta.bertindik,
		bertato: !!peserta.bertato,

		// Orang Tua
		nama_ayah: peserta.nama_ayah || "",
        nik_ayah: peserta.nik_ayah || "",
		no_ayah: peserta.no_hp_ayah || "",
        pendidikan_ayah: peserta.pendidikan_ayah || "",
		pekerjaan_ayah: peserta.pekerjaan_ayah || "",
		nama_ibu: peserta.nama_ibu || "",
        nik_ibu: peserta.nik_ibu || "",
		no_ibu: peserta.no_hp_ibu || "",
        pendidikan_ibu: peserta.pendidikan_ibu || "",
		pekerjaan_ibu: peserta.pekerjaan_ibu || "",
        penghasilan_ortu: peserta.penghasilan_ortu || "",
        no_kip_kks_pkh: peserta.no_kip_kks_pkh || "",

        // Riwayat & Bakat
        asal_sekolah: peserta.asal_sekolah || "",
        npsn_sekolah_asal: peserta.npsn_sekolah_asal || "",
        alamat_sekolah_asal: peserta.alamat_sekolah_asal || "",
        tahun_lulus: peserta.tahun_lulus || "",
        pernah_paud: !!peserta.pernah_paud,
        pernah_tk: !!peserta.pernah_tk,
        prestasi_diraih: peserta.prestasi_diraih || "",
        pengalaman_berkesan: peserta.pengalaman_berkesan || "",
        cita_cita: peserta.cita_cita || "",
        ekstrakurikuler: peserta.ekstrakurikuler || [],

        // Dynamic documents
        ...masterDocuments.reduce((acc, doc) => ({ ...acc, [doc.slug]: null }), {}),
	});

	const [currentStep, setCurrentStep] = useState(1);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		put(route("ppdb.edit.peserta", peserta.id));
	};

	const handleDelete = () => {
		router.delete(route("ppdb.delete.peserta", peserta.id));
	};

	const nextStep = (e: React.MouseEvent) => {
		e.preventDefault();
		setCurrentStep((prev) => Math.min(prev + 1, 4));
	};

	const prevStep = (e: React.MouseEvent) => {
		e.preventDefault();
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const { flash } = usePage<any>().props;

	return (
		<>
			<Head title="Edit Peserta SNPMB" />

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
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Data Diri Pendaftar</CardTitle>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive" size="sm">
									Hapus Peserta
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Hapus Peserta?</AlertDialogTitle>
									<AlertDialogDescription>
										Peserta akan dihapus dari pendaftar SNPMB. Tindakan ini tidak
										dapat dibatalkan.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Batal</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDelete}
										className="bg-red-600 hover:bg-red-700"
									>
										Hapus
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</CardHeader>
					<form onSubmit={submit}>
						<CardContent className="space-y-6 py-6">
							{/* Step 1: Identitas Diri */}
							<div className={currentStep === 1 ? "block space-y-4" : "hidden"}>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
										<Input
											id="nama_lengkap"
											value={data.nama_lengkap}
											onChange={(e) => setData("nama_lengkap", e.target.value)}
											placeholder="Masukkan nama lengkap sesuai ijazah"
											minLength={3}
											maxLength={100}
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
										<Label htmlFor="agama">Agama *</Label>
										<Input
											id="agama"
											value={data.agama}
											onChange={(e) => setData("agama", e.target.value)}
											placeholder="Contoh: Islam"
											required
										/>
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
										<Label htmlFor="no_hp">No. HP Orang Tua / Wali *</Label>
										<Input
											id="no_hp"
											type="tel"
											value={data.no_hp}
											onChange={(e) => setData("no_hp", e.target.value)}
											placeholder="Contoh: 08xxxxxxxxxx"
											minLength={10}
											maxLength={15}
											required
										/>
									</div>
                                    <div className="space-y-2">
										<Label htmlFor="no_hp_pribadi">No. HP Pribadi (Jika ada)</Label>
										<Input
											id="no_hp_pribadi"
											type="tel"
											value={data.no_hp_pribadi}
											onChange={(e) => setData("no_hp_pribadi", e.target.value)}
											placeholder="Contoh: 08xxxxxxxxxx"
										/>
									</div>
                                    <div className="space-y-2">
										<Label htmlFor="jumlah_saudara_kandung">Jumlah Saudara Kandung *</Label>
										<Input
											id="jumlah_saudara_kandung"
                                            type="number"
											value={data.jumlah_saudara_kandung}
											onChange={(e) => setData("jumlah_saudara_kandung", e.target.value)}
											required
										/>
									</div>
                                    <div className="space-y-2">
										<Label htmlFor="anak_ke">Anak Ke *</Label>
										<Input
											id="anak_ke"
                                            type="number"
											value={data.anak_ke}
											onChange={(e) => setData("anak_ke", e.target.value)}
											required
										/>
									</div>
                                    <div className="space-y-2">
										<Label htmlFor="status_anak">Status Anak *</Label>
										<Select value={data.status_anak} onValueChange={(v) => setData("status_anak", v)}>
                                            <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Kandung">Kandung</SelectItem>
                                                <SelectItem value="Angkat">Angkat</SelectItem>
                                                <SelectItem value="Tiri">Tiri</SelectItem>
                                            </SelectContent>
                                        </Select>
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

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="nisn">NISN</Label>
										<Input
											id="nisn"
											value={data.nisn}
											onChange={(e) => setData("nisn", e.target.value)}
											placeholder="Masukkan 10 digit NISN"
											minLength={10}
											maxLength={10}
										/>
									</div>

									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Checkbox
												id="penerima_kip"
												checked={!!data.no_kip_kks_pkh}
												onCheckedChange={(c) => !c && setData("no_kip_kks_pkh", "")}
											/>
											<Label htmlFor="penerima_kip">Penerima PKH/KIP/KKS</Label>
										</div>
										{!!data.no_kip_kks_pkh || (
											<Input
												placeholder="No. PKH/KIP/KKS"
												value={data.no_kip_kks_pkh}
												onChange={(e) => setData("no_kip_kks_pkh", e.target.value)}
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
										<Label htmlFor="nik_ayah">NIK Ayah</Label>
										<Input
											id="nik_ayah"
											value={data.nik_ayah}
											onChange={(e) => setData("nik_ayah", e.target.value)}
											placeholder="16 digit NIK"
										/>
									</div>
                                    <div className="space-y-2">
										<Label htmlFor="pendidikan_ayah">Pendidikan Terakhir Ayah</Label>
										<Input
											id="pendidikan_ayah"
											value={data.pendidikan_ayah}
											onChange={(e) => setData("pendidikan_ayah", e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="no_ayah">No. HP Ayah</Label>
										<Input
											id="no_ayah"
											type="tel"
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

									<div className="col-span-1 md:col-span-2 border-t my-4"></div>

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
										<Label htmlFor="nik_ibu">NIK Ibu</Label>
										<Input
											id="nik_ibu"
											value={data.nik_ibu}
											onChange={(e) => setData("nik_ibu", e.target.value)}
										/>
									</div>
                                    <div className="space-y-2">
										<Label htmlFor="pendidikan_ibu">Pendidikan Terakhir Ibu</Label>
										<Input
											id="pendidikan_ibu"
											value={data.pendidikan_ibu}
											onChange={(e) => setData("pendidikan_ibu", e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="no_ibu">No. HP Ibu</Label>
										<Input
											id="no_ibu"
											type="tel"
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
                                    <div className="space-y-2">
										<Label htmlFor="penghasilan_ortu">Penghasilan Orang Tua</Label>
										<Select value={data.penghasilan_ortu} onValueChange={(v) => setData("penghasilan_ortu", v)}>
                                            <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="K">{"< 1 Juta"}</SelectItem>
                                                <SelectItem value="A">1 Juta - 3 Juta</SelectItem>
                                                <SelectItem value="B">3 Juta - 5 Juta</SelectItem>
                                                <SelectItem value="C">{"> 5 Juta"}</SelectItem>
                                            </SelectContent>
                                        </Select>
									</div>
								</div>
							</div>

							{/* Step 3: Riwayat & Bakat */}
							<div className={currentStep === 3 ? "block space-y-6" : "hidden"}>
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">Sekolah Sebelumnya</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="asal_sekolah">Nama Sekolah Asal</Label>
                                            <Input
                                                id="asal_sekolah"
                                                value={data.asal_sekolah}
                                                onChange={(e) => setData("asal_sekolah", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="npsn_sekolah_asal">NPSN Sekolah</Label>
                                            <Input
                                                id="npsn_sekolah_asal"
                                                value={data.npsn_sekolah_asal}
                                                onChange={(e) => setData("npsn_sekolah_asal", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tahun_lulus">Tahun Lulus</Label>
                                            <Input
                                                id="tahun_lulus"
                                                value={data.tahun_lulus}
                                                onChange={(e) => setData("tahun_lulus", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="alamat_sekolah_asal">Alamat Sekolah Asal</Label>
                                            <Input
                                                id="alamat_sekolah_asal"
                                                value={data.alamat_sekolah_asal}
                                                onChange={(e) => setData("alamat_sekolah_asal", e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-6 py-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="pernah_paud"
                                                    checked={data.pernah_paud}
                                                    onCheckedChange={(c) => setData("pernah_paud", !!c)}
                                                />
                                                <Label htmlFor="pernah_paud">Pernah PAUD</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="pernah_tk"
                                                    checked={data.pernah_tk}
                                                    onCheckedChange={(c) => setData("pernah_tk", !!c)}
                                                />
                                                <Label htmlFor="pernah_tk">Pernah TK</Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold text-lg mb-4">Bakat & Minat</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="prestasi_diraih">Prestasi yang Pernah Diraih</Label>
                                            <Textarea
                                                id="prestasi_diraih"
                                                value={data.prestasi_diraih}
                                                onChange={(e) => setData("prestasi_diraih", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="pengalaman_berkesan">Pengalaman Terkesan</Label>
                                            <Textarea
                                                id="pengalaman_berkesan"
                                                value={data.pengalaman_berkesan}
                                                onChange={(e) => setData("pengalaman_berkesan", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cita_cita">Cita-cita</Label>
                                            <Input
                                                id="cita_cita"
                                                value={data.cita_cita}
                                                onChange={(e) => setData("cita_cita", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Ekstrakurikuler yang Ingin Diikuti</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                                {["Pramuka", "PBB", "Kaligrafi", "Tilawah", "Seni Hadrah"].map((item) => (
                                                    <div key={item} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`extra-${item}`}
                                                            checked={data.ekstrakurikuler.includes(item)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setData("ekstrakurikuler", [...data.ekstrakurikuler, item]);
                                                                } else {
                                                                    setData("ekstrakurikuler", data.ekstrakurikuler.filter(i => i !== item));
                                                                }
                                                            }}
                                                        />
                                                        <Label htmlFor={`extra-${item}`} className="font-normal cursor-pointer">{item}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
							</div>

                            {/* Step 4: Dokumen */}
							<div className={currentStep === 4 ? "block space-y-6" : "hidden"}>
                                <div className="bg-muted p-4 rounded-lg mb-6">
                                    <p className="text-sm text-muted-foreground">
                                        Admin dapat mengunggah atau mengganti dokumen peserta di sini. Format: JPG, PNG, PDF (Maks 2MB).
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {masterDocuments.map((doc) => {
                                        const existingFile = peserta.documents?.find(d => d.master_document_id === doc.id);
                                        return (
                                            <div key={doc.id} className="space-y-3 p-4 border rounded-xl bg-card">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-bold">{doc.name} {doc.is_required && "*"}</Label>
                                                    {existingFile && (
                                                        <Button 
                                                            variant="link" 
                                                            size="sm" 
                                                            className="h-auto p-0 text-primary"
                                                            type="button"
                                                            asChild
                                                        >
                                                            <a href={`/storage/${existingFile.file_path}`} target="_blank" rel="noreferrer">
                                                                Lihat File
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                                <Input 
                                                    type="file" 
                                                    onChange={(e) => setData(doc.slug, e.target.files?.[0] || null)}
                                                    className="cursor-pointer"
                                                />
                                                {existingFile && (
                                                    <p className="text-[10px] text-muted-foreground">
                                                        * Unggah file baru untuk mengganti file lama.
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

						</CardContent>
						<CardFooter className="flex justify-between">
							{currentStep > 1 && (
								<Button variant="outline" onClick={prevStep}>
									Kembali
								</Button>
							)}

							{/* Spacer */}
							{currentStep === 1 && <div></div>}

							{currentStep < 4 ? (
								<Button onClick={nextStep}>Lanjut</Button>
							) : (
								<Button type="submit" disabled={processing}>
									{processing ? "Menyimpan..." : "Simpan Perubahan"}
								</Button>
							)}
						</CardFooter>
					</form>
				</Card>
			</div>
		</>
	);
}
