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



interface Gelombang {
	id: number;
	nama: string;
	tahun_ajaran?: string;
}

interface Props {
	gelombang: Gelombang[];
    masterDocuments: any[];
	masterUkuranSeragams: any[];
}

const steps = [
	{ id: 1, title: "Identitas Diri" },
	{ id: 2, title: "Identitas Orang Tua" },
    { id: 3, title: "Riwayat & Bakat" },
    { id: 4, title: "Dokumen" },
];

export default function Create({ gelombang, masterDocuments, masterUkuranSeragams }: Props) {
	const { data, setData, post, processing, errors } = useForm({
		// Identitas Diri
		gelombang_id: gelombang.length > 0 ? String(gelombang[0].id) : "",
		master_ukuran_seragam_id: "",
		nama_lengkap: "",
		jenis_kelamin: "l",
		tempat_lahir: "",
		tanggal_lahir: "",
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
		nisn: "",
        agama: "",
        jumlah_saudara_kandung: "",
        anak_ke: "",
        status_anak: "Kandung",
		no_hp: "",
        no_hp_pribadi: "",


		// Orang Tua
		nama_ayah: "",
        nik_ayah: "",
		no_ayah: "",
        pendidikan_ayah: "",
		pekerjaan_ayah: "",
		nama_ibu: "",
        nik_ibu: "",
		no_ibu: "",
        pendidikan_ibu: "",
		pekerjaan_ibu: "",
        penghasilan_ortu: "",


        // Riwayat & Bakat
        asal_sekolah: "",
        npsn_sekolah_asal: "",
        alamat_sekolah_asal: "",
        tahun_lulus: "",
        pernah_paud: false,
        pernah_tk: false,
        prestasi_diraih: "",
        pengalaman_berkesan: "",
        cita_cita: "",
        ekstrakurikuler: [] as string[],

        // Dynamic documents
        ...masterDocuments.reduce((acc, doc) => ({ ...acc, [doc.slug]: null }), {}),
	});

	const [currentStep, setCurrentStep] = useState(1);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("ppdb.tambah.pendaftar"));
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
									<Label htmlFor="alamat_lengkap">Alamat Lengkap *</Label>
									<Textarea
										id="alamat_lengkap"
										placeholder="Contoh: Jl. Kutilang No. 12, Kel. Klabang, Kec. Klabang, Kab. Bondowoso"
										value={data.alamat_lengkap}
										onChange={(e) => setData("alamat_lengkap", e.target.value)}
										required
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
										/>
									</div>


								</div>
																<div className="space-y-2">
										<Label htmlFor="master_ukuran_seragam_id">Ukuran Seragam *</Label>
										<Select
											value={data.master_ukuran_seragam_id}
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
										{errors.master_ukuran_seragam_id && (
											<span className="text-destructive text-sm">
												{errors.master_ukuran_seragam_id}
											</span>
										)}
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
                                        Admin dapat mengunggah dokumen peserta di sini. Format yang didukung: JPG, PNG, PDF. Maksimal 2MB per file.
                                    </p>
                                </div>
                                <div className="gap-6 grid md:grid-cols-2">
                                    {masterDocuments.map((doc) => (
                                        <div key={doc.id} className="space-y-2">
                                            <Label htmlFor={doc.slug}>{doc.name} {doc.is_required && "*"}</Label>
                                            <Input 
                                                id={doc.slug} 
                                                type="file" 
                                                onChange={(e) => setData(doc.slug, e.target.files?.[0] || null)} 
                                                className="cursor-pointer" 
                                            />
                                            {doc.description && <p className="text-[10px] text-muted-foreground">{doc.description}</p>}
                                            {errors[doc.slug] && <p className="text-xs text-destructive">{errors[doc.slug]}</p>}
                                        </div>
                                    ))}
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
						{currentStep < 4 ? (
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
