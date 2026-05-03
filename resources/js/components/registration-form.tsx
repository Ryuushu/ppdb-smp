import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
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
import { cn } from "@/lib/utils";
import { useForm as useInertiaForm, usePage } from "@inertiajs/react";
import confetti from "canvas-confetti";
import gsap from "gsap";
import {
	Calendar,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	GraduationCap,
	PartyPopper,
	User,
	Users,
    FileText,
    Star,
    Shirt
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface RegistrationFormProps {
	gelombangAktif?: any | null;
    masterDocuments?: any[];
    adminItems?: any[];
}

const steps = [
	{ id: 1, title: "Identitas Diri", icon: User },
	{ id: 2, title: "Data Orang Tua", icon: Users },
    { id: 3, title: "Riwayat & Bakat", icon: Star },
    { id: 4, title: "Dokumen", icon: FileText },
];

function FormError({ error }: { error?: string }) {
	if (!error) return null;
	return <p className="mt-1 text-destructive text-sm">{error}</p>;
}

interface FormFieldProps {
	id: string;
	label: string;
	required?: boolean;
	error?: string;
	children: React.ReactNode;
	className?: string;
}

function FormField({
	id,
	label,
	required = false,
	error,
	children,
	className,
}: FormFieldProps) {
	return (
		<div className={cn("space-y-2", className)}>
			<Label htmlFor={id} className={cn(error && "text-destructive")}>
				{label} {required && "*"}
			</Label>
			{children}
			<FormError error={error} />
		</div>
	);
}

export function RegistrationForm({
	gelombangAktif = null,
    masterDocuments = [],
    adminItems = [],
}: RegistrationFormProps) {
	const [currentStep, setCurrentStep] = useState(1);
	const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
	const [isSuccess, setIsSuccess] = useState(false);
	const [registrationNumber, setRegistrationNumber] = useState<string>("");

	const { flash } = usePage<any>().props;

	useEffect(() => {
		if (flash?.success && flash.success.includes("berhasil mendaftar")) {
			const match = flash.success.match(/([A-Z]{2,}-\d+-\d+-\d+)/);
			if (match) {
				setRegistrationNumber(match[1]);
			}
			setIsSuccess(true);
			setTimeout(() => {
				const count = 200;
				const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

				confetti({ ...defaults, spread: 26, startVelocity: 55, particleCount: Math.floor(count * 0.25) });
				confetti({ ...defaults, spread: 60, particleCount: Math.floor(count * 0.2) });
				confetti({ ...defaults, spread: 100, decay: 0.91, scalar: 0.8, particleCount: Math.floor(count * 0.35) });
				confetti({ ...defaults, spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, particleCount: Math.floor(count * 0.1) });
				confetti({ ...defaults, spread: 120, startVelocity: 45, particleCount: Math.floor(count * 0.1) });

				setTimeout(() => {
					confetti({ ...defaults, particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.6 } });
					confetti({ ...defaults, particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.6 } });
				}, 150);
			}, 100);
		}
	}, [flash]);

	const { data, setData, post, processing, errors } = useInertiaForm({
		gelombang_id: gelombangAktif ? String(gelombangAktif.id) : "",
		nama_lengkap: "",
		jenis_kelamin: "",
		tempat_lahir: "",
		tanggal_lahir: "",
		nik: "",
		nisn: "",
		alamat_lengkap: "",
        jumlah_saudara_kandung: "",
        anak_ke: "",
        status_anak: "",
        agama: "Islam",

		no_hp: "",
        no_hp_pribadi: "",
        no_hp_ayah: "",
        no_hp_ibu: "",
        pernah_paud: false,
        pernah_tk: false,
        asal_sekolah: "",
        npsn_sekolah_asal: "",
        alamat_sekolah_asal: "",
        tahun_lulus: "",
		nama_ayah: "",
		nik_ayah: "",
		pendidikan_ayah: "",
		pekerjaan_ayah: "",
		nama_ibu: "",
		nik_ibu: "",
		pendidikan_ibu: "",
		pekerjaan_ibu: "",
        penghasilan_ortu: "",
        prestasi_diraih: "",
        pengalaman_berkesan: "",
        cita_cita: "",
        pas_foto: null as File | null,
        scan_ijazah_paud_tk: null as File | null,
        scan_kk: null as File | null,
        scan_akta_kelahiran: null as File | null,
        // Dynamic documents
        ...masterDocuments.reduce((acc, doc) => ({ ...acc, [doc.slug]: null }), {}),
        ekstrakurikuler: [] as string[],
        admin_item_ids: [] as number[],
	});

	const formRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	const getError = (field: string): string | undefined => {
		return clientErrors[field] || errors[field as keyof typeof errors];
	};

	const hasError = (field: string): boolean => {
		return !!getError(field);
	};

	const clearError = (field: string) => {
		if (clientErrors[field]) {
			const newErrors = { ...clientErrors };
			delete newErrors[field];
			setClientErrors(newErrors);
		}
	};

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				cardRef.current,
				{ opacity: 0, y: 40 },
				{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
			);
		});
		return () => ctx.revert();
	}, []);

	useEffect(() => {
		void currentStep;
		gsap.fromTo(
			formRef.current,
			{ opacity: 0, x: 20 },
			{ opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
		);
	}, [currentStep]);

	const validateStep = (step: number) => {
		const newErrors: Record<string, string> = {};

		if (step === 1) {
			const requiredFields = [
				{ key: "nama_lengkap", label: "Nama Lengkap" },
				{ key: "jenis_kelamin", label: "Jenis Kelamin" },
				{ key: "tempat_lahir", label: "Tempat Lahir" },
				{ key: "tanggal_lahir", label: "Tanggal Lahir" },
				{ key: "nik", label: "NIK" },
				{ key: "alamat_lengkap", label: "Alamat Lengkap" },
                { key: "jumlah_saudara_kandung", label: "Jumlah Saudara" },
                { key: "anak_ke", label: "Anak Ke" },
                { key: "status_anak", label: "Status Anak" },
                { key: "agama", label: "Agama" },
				{ key: "no_hp", label: "No. HP" },
			];

			for (const field of requiredFields) {
				// @ts-ignore
				if (!data[field.key]) {
					newErrors[field.key] = `${field.label} wajib diisi`;
				}
			}

			if (data.nik && data.nik.length !== 16) {
				newErrors.nik = "NIK harus terdiri dari 16 digit";
			}

            const waRegex = /^(08|\+62|62)[0-9]{8,15}$/;
            if (data.no_hp && !waRegex.test(data.no_hp)) {
                newErrors.no_hp = "Format nomor WhatsApp tidak valid (08...)";
            }
		}

		if (step === 2) {
			if (!data.nama_ayah) {
				newErrors.nama_ayah = "Nama Ayah wajib diisi";
			}
			if (!data.nama_ibu) {
				newErrors.nama_ibu = "Nama Ibu wajib diisi";
			}
            if (!data.no_hp_ayah) newErrors.no_hp_ayah = "Wajib diisi";
            if (data.no_hp_ayah && !/^(08|\+62|62)[0-9]{8,15}$/.test(data.no_hp_ayah)) {
                newErrors.no_hp_ayah = "Format nomor WA tidak valid";
            }
            if (!data.no_hp_ibu) newErrors.no_hp_ibu = "Wajib diisi";
            if (data.no_hp_ibu && !/^(08|\+62|62)[0-9]{8,15}$/.test(data.no_hp_ibu)) {
                newErrors.no_hp_ibu = "Format nomor WA tidak valid";
            }
		}

		setClientErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			const firstError = Object.values(newErrors)[0];
			toast.error(firstError);
			return false;
		}

		return true;
	};

	const nextStep = (e?: React.MouseEvent) => {
		if (e) e.preventDefault();
		if (validateStep(currentStep)) {
			if (currentStep < 4) setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) setCurrentStep(currentStep - 1);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		post("/register", {
			onSuccess: (page) => {
				const flashMessage = (page.props as { flash?: { success?: string } })
					.flash?.success;
				if (flashMessage) {
					const match = flashMessage.match(/([A-Z]{2,}-\d+-\d+-\d+)/);
					if (match) {
						setRegistrationNumber(match[1]);
					}
				}
			},
		});
	};

	return (
		<div className="mx-auto px-4 max-w-4xl">
			{isSuccess ? (
				<div className="py-16 text-center">
					<div className="inline-flex justify-center items-center bg-primary/10 dark:bg-primary/20 mb-6 rounded-full w-24 h-24 animate-bounce">
						<PartyPopper className="w-12 h-12 text-primary" />
					</div>
					<h1 className="mb-4 font-bold text-foreground text-4xl md:text-5xl">
						Selamat! 🎉
					</h1>
					<p className="mb-6 text-muted-foreground text-xl">
						Pendaftaran Anda berhasil disubmit
					</p>

					{registrationNumber && (
						<div className="inline-block bg-primary/10 mb-8 p-6 border border-primary/20 rounded-2xl">
							<p className="mb-2 text-muted-foreground text-sm">
								Nomor Pendaftaran Anda
							</p>
							<p className="font-bold text-primary text-3xl tracking-wider">
								{registrationNumber}
							</p>
						</div>
					)}

					<Card className="shadow-xl mx-auto border-0 rounded-3xl max-w-lg overflow-hidden">
						<CardContent className="p-8">
							<div className="space-y-4">
								<div className="flex items-start gap-3 text-left">
									<CheckCircle2 className="mt-0.5 w-5 h-5 text-primary shrink-0" />
									<p className="text-muted-foreground">
										Simpan nomor pendaftaran Anda dan segera datang ke sekolah untuk verifikasi administrasi
									</p>
								</div>
							</div>

							<Button asChild variant="outline" className="mt-8 w-full h-12 rounded-xl">
								<a href="/">Kembali ke Beranda</a>
							</Button>
						</CardContent>
					</Card>
				</div>
			) : !gelombangAktif ? (
				<div className="py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
					<div className="inline-flex justify-center items-center bg-amber-100 dark:bg-amber-900/30 mb-6 rounded-full w-24 h-24">
						<Calendar className="w-12 h-12 text-amber-600 dark:text-amber-400" />
					</div>
					<h1 className="mb-4 font-bold text-foreground text-4xl md:text-5xl">
						Pendaftaran Ditutup
					</h1>
					<p className="mx-auto mb-8 max-w-lg text-muted-foreground text-xl">
						Mohon maaf, saat ini tidak ada gelombang pendaftaran yang sedang dibuka.
					</p>
					<Button asChild size="lg" className="rounded-xl px-8 h-12">
						<a href="/">Kembali ke Beranda</a>
					</Button>
				</div>
			) : (
				<>
					<div className="mb-10 text-center">
						<div className="inline-flex justify-center items-center bg-primary/10 mb-4 rounded-3xl w-20 h-20">
							<GraduationCap className="w-10 h-10 text-primary" />
						</div>
						<h1 className="mb-2 font-bold text-foreground text-3xl md:text-4xl">
							Formulir Pendaftaran
						</h1>
						<p className="text-muted-foreground">
							SNPMB, Seleksi Nasional Penerimaan Murid Baru MI Nurul Ulum
						</p>
					</div>

					<div className="mb-8">
						<div className="relative flex justify-between items-center">
							<div className="top-6 right-0 left-0 absolute mx-12 bg-border rounded-full h-1">
								<div
									className="bg-primary rounded-full h-full transition-all duration-500"
									style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
								/>
							</div>

							{steps.map((step) => (
								<div key={step.id} className="z-10 relative flex flex-col items-center gap-2">
									<div
										className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
											step.id === currentStep
												? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
												: step.id < currentStep
													? "bg-primary/20 text-primary"
													: "bg-white border-2 border-border text-muted-foreground"
										}`}
									>
										{step.id < currentStep ? (
											<CheckCircle2 className="w-6 h-6" />
										) : (
											<step.icon className="w-5 h-5" />
										)}
									</div>
									<span
										className={`text-xs font-medium hidden sm:block ${
											step.id === currentStep ? "text-primary" : "text-muted-foreground"
										}`}
									>
										{step.title}
									</span>
								</div>
							))}
						</div>
					</div>

					<Card ref={cardRef} className="shadow-2xl shadow-primary/5 border-0 rounded-3xl overflow-hidden">
						<CardHeader className="bg-gradient-to-r from-primary/5 to-accent/50 border-b">
							<CardTitle className="flex items-center gap-3 text-xl">
								{(() => {
									const StepIcon = steps[currentStep - 1].icon;
									return <StepIcon className="w-6 h-6 text-primary" />;
								})()}
								{steps[currentStep - 1].title}
							</CardTitle>
						</CardHeader>

						<CardContent className="p-6 md:p-8">
							<form onSubmit={handleSubmit} encType="multipart/form-data">
								<div ref={formRef}>
									{currentStep === 1 && (
										<div className="space-y-6">
											<div className="gap-6 grid md:grid-cols-2">
												<FormField id="nik" label="NIK (16 digit)" required error={getError("nik")} className="md:col-span-2">
													<Input 
														id="nik" 
														value={data.nik} 
														onChange={(e) => { 
															const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
															setData("nik", val); 
															clearError("nik"); 
														}} 
														className="rounded-xl h-12" 
														maxLength={16} 
													/>
												</FormField>

												<FormField id="nama_lengkap" label="Nama Lengkap" required error={getError("nama_lengkap")} className="md:col-span-2">
													<Input id="nama_lengkap" value={data.nama_lengkap} onChange={(e) => { setData("nama_lengkap", e.target.value); clearError("nama_lengkap"); }} className="rounded-xl h-12" />
												</FormField>

												<FormField id="jenis_kelamin" label="Jenis Kelamin" required error={getError("jenis_kelamin")}>
													<RadioGroup className="flex gap-4 mt-2" value={data.jenis_kelamin} onValueChange={(value) => { setData("jenis_kelamin", value); clearError("jenis_kelamin"); }}>
														<div className="flex items-center space-x-2"><RadioGroupItem value="l" id="laki-laki" /><Label htmlFor="laki-laki">Laki-laki</Label></div>
														<div className="flex items-center space-x-2"><RadioGroupItem value="p" id="perempuan" /><Label htmlFor="perempuan">Perempuan</Label></div>
													</RadioGroup>
												</FormField>



                                                <FormField id="agama" label="Agama" required error={getError("agama")}>
													<Input id="agama" value={data.agama} onChange={(e) => { setData("agama", e.target.value); clearError("agama"); }} className="rounded-xl h-12" />
												</FormField>

												<FormField id="tempat_lahir" label="Tempat Lahir" required error={getError("tempat_lahir")}>
													<Input id="tempat_lahir" value={data.tempat_lahir} onChange={(e) => { setData("tempat_lahir", e.target.value); clearError("tempat_lahir"); }} className="rounded-xl h-12" />
												</FormField>

												<FormField id="tanggal_lahir" label="Tanggal Lahir" required error={getError("tanggal_lahir")}>
													<Input id="tanggal_lahir" type="date" value={data.tanggal_lahir} onChange={(e) => { setData("tanggal_lahir", e.target.value); clearError("tanggal_lahir"); }} className="rounded-xl h-12" />
												</FormField>



												<FormField id="nisn" label="NISN (10 digit)" error={getError("nisn")}>
													<Input 
														id="nisn" 
														value={data.nisn} 
														onChange={(e) => {
															const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
															setData("nisn", val);
														}} 
														className="rounded-xl h-12" 
														maxLength={10}
													/>
												</FormField>




												<FormField id="alamat_lengkap" label="Alamat Lengkap" required error={getError("alamat_lengkap")} className="md:col-span-2">
													<Textarea id="alamat_lengkap" value={data.alamat_lengkap} onChange={(e) => { setData("alamat_lengkap", e.target.value); clearError("alamat_lengkap"); }} className="rounded-xl min-h-[80px]" />
												</FormField>

                                                <FormField id="jumlah_saudara_kandung" label="Jumlah Saudara Kandung" required error={getError("jumlah_saudara_kandung")}>
													<Input id="jumlah_saudara_kandung" type="number" value={data.jumlah_saudara_kandung} onChange={(e) => { setData("jumlah_saudara_kandung", e.target.value); clearError("jumlah_saudara_kandung"); }} className="rounded-xl h-12" />
												</FormField>

                                                <FormField id="anak_ke" label="Anak Ke" required error={getError("anak_ke")}>
													<Input id="anak_ke" type="number" value={data.anak_ke} onChange={(e) => { setData("anak_ke", e.target.value); clearError("anak_ke"); }} className="rounded-xl h-12" />
												</FormField>

                                                <FormField id="status_anak" label="Status Anak" required error={getError("status_anak")}>
                                                    <Select value={data.status_anak} onValueChange={(value) => { setData("status_anak", value); clearError("status_anak"); }}>
                                                        <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Kandung">Kandung</SelectItem>
                                                            <SelectItem value="Angkat">Angkat</SelectItem>
                                                            <SelectItem value="Tiri">Tiri</SelectItem>
                                                        </SelectContent>
                                                    </Select>
												</FormField>

                                                <FormField id="no_hp" label="No. HP / WhatsApp Orang Tua (Aktif) *" required error={getError("no_hp")}>
													<Input 
														id="no_hp" 
														type="tel" 
                                                        placeholder="Contoh: 081234567890"
														value={data.no_hp} 
														onChange={(e) => { 
															const val = e.target.value.replace(/[^0-9+]/g, "");
															setData("no_hp", val); 
															clearError("no_hp"); 
														}} 
														className="rounded-xl h-12" 
													/>
                                                    <p className="text-[10px] text-muted-foreground mt-1">Pastikan nomor ini aktif di WhatsApp untuk menerima informasi.</p>
												</FormField>

                                                {adminItems && adminItems.length > 0 && adminItems.some(item => item.extras && item.extras.length > 0) && (
                                                    <div className="md:col-span-2 pt-6 space-y-6">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Shirt className="w-5 h-5 text-primary" />
                                                            <h3 className="font-bold text-lg text-foreground">Pilihan Variasi / Ukuran</h3>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            {adminItems.filter(item => item.extras && item.extras.length > 0).map((parent) => {
                                                                // Find currently selected extra for this parent
                                                                const parentExtraIds = parent.extras.map((e: any) => e.id);
                                                                const selectedId = data.admin_item_ids.find(id => parentExtraIds.includes(id));

                                                                return (
                                                                    <div key={parent.id} className="space-y-2">
                                                                        <Label htmlFor={`variation-${parent.id}`} className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{parent.name}</Label>
                                                                        <Select 
                                                                            value={selectedId ? String(selectedId) : "none"}
                                                                            onValueChange={(val) => {
                                                                                // Enforce only 1 extra total
                                                                                if (val !== "none") {
                                                                                    setData("admin_item_ids", [Number(val)]);
                                                                                } else {
                                                                                    setData("admin_item_ids", []);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <SelectTrigger id={`variation-${parent.id}`} className="h-12 rounded-xl bg-background border-primary/20 focus:ring-primary/20 transition-all">
                                                                                <SelectValue placeholder={`Pilih ${parent.name}...`} />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="none" className="text-muted-foreground italic">Tidak Memilih</SelectItem>
                                                                                {parent.extras.map((child: any) => {
                                                                                    const cost = data.jenis_kelamin === 'p' ? child.amount_female : child.amount_male;
                                                                                    return (
                                                                                        <SelectItem key={child.id} value={String(child.id)}>
                                                                                            <span className="font-medium">{child.name}</span>
                                                                                            {cost > 0 && (
                                                                                                <span className="ml-2 text-[10px] text-primary font-bold">
                                                                                                    (+ {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(cost)})
                                                                                                </span>
                                                                                            )}
                                                                                        </SelectItem>
                                                                                    );
                                                                                })}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
											</div>
										</div>
									)}

									{currentStep === 2 && (
										<div className="space-y-8">
											<div>
												<h3 className="flex items-center gap-2 mb-4 font-semibold text-lg"><span className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8 font-bold text-primary text-sm">A</span>Data Ayah</h3>
												<div className="gap-6 grid md:grid-cols-2 pl-10">
													<FormField id="nama_ayah" label="Nama Ayah" required error={getError("nama_ayah")} className="md:col-span-2">
														<Input id="nama_ayah" value={data.nama_ayah} onChange={(e) => { setData("nama_ayah", e.target.value); clearError("nama_ayah"); }} className="rounded-xl h-12" />
													</FormField>
                                                    <FormField id="nik_ayah" label="NIK Ayah (16 digit)">
														<Input 
															id="nik_ayah" 
															value={data.nik_ayah} 
															onChange={(e) => {
																const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
																setData("nik_ayah", val);
															}} 
															className="rounded-xl h-12" 
															maxLength={16}
														/>
													</FormField>
                                                    <FormField id="pendidikan_ayah" label="Pendidikan Terakhir Ayah">
														<Input id="pendidikan_ayah" value={data.pendidikan_ayah} onChange={(e) => setData("pendidikan_ayah", e.target.value)} className="rounded-xl h-12" />
													</FormField>
                                                    <FormField id="no_hp_ayah" label="No. HP / WhatsApp Ayah">
														<Input 
                                                            id="no_hp_ayah" 
                                                            value={data.no_hp_ayah} 
                                                            onChange={(e) => {
                                                                const val = e.target.value.replace(/[^0-9+]/g, "");
                                                                setData("no_hp_ayah", val);
                                                            }} 
                                                            placeholder="Contoh: 08xxxxxxxxxx"
                                                            className="rounded-xl h-12" 
                                                        />
													</FormField>
													<FormField id="pekerjaan_ayah" label="Pekerjaan Ayah">
														<Input id="pekerjaan_ayah" value={data.pekerjaan_ayah} onChange={(e) => setData("pekerjaan_ayah", e.target.value)} className="rounded-xl h-12" />
													</FormField>
												</div>
											</div>

											<div>
												<h3 className="flex items-center gap-2 mb-4 font-semibold text-lg"><span className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8 font-bold text-primary text-sm">I</span>Data Ibu</h3>
												<div className="gap-6 grid md:grid-cols-2 pl-10">
													<FormField id="nama_ibu" label="Nama Ibu" required error={getError("nama_ibu")} className="md:col-span-2">
														<Input id="nama_ibu" value={data.nama_ibu} onChange={(e) => { setData("nama_ibu", e.target.value); clearError("nama_ibu"); }} className="rounded-xl h-12" />
													</FormField>
                                                    <FormField id="nik_ibu" label="NIK Ibu (16 digit)">
														<Input 
															id="nik_ibu" 
															value={data.nik_ibu} 
															onChange={(e) => {
																const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
																setData("nik_ibu", val);
															}} 
															className="rounded-xl h-12" 
															maxLength={16}
														/>
													</FormField>
                                                    <FormField id="pendidikan_ibu" label="Pendidikan Terakhir Ibu">
														<Input id="pendidikan_ibu" value={data.pendidikan_ibu} onChange={(e) => setData("pendidikan_ibu", e.target.value)} className="rounded-xl h-12" />
													</FormField>
                                                    <FormField id="no_hp_ibu" label="No. HP / WhatsApp Ibu">
														<Input 
                                                            id="no_hp_ibu" 
                                                            value={data.no_hp_ibu} 
                                                            onChange={(e) => {
                                                                const val = e.target.value.replace(/[^0-9+]/g, "");
                                                                setData("no_hp_ibu", val);
                                                            }} 
                                                            placeholder="Contoh: 08xxxxxxxxxx"
                                                            className="rounded-xl h-12" 
                                                        />
													</FormField>
													<FormField id="pekerjaan_ibu" label="Pekerjaan Ibu">
														<Input id="pekerjaan_ibu" value={data.pekerjaan_ibu} onChange={(e) => setData("pekerjaan_ibu", e.target.value)} className="rounded-xl h-12" />
													</FormField>
												</div>
											</div>

                                            <div>
												<h3 className="flex items-center gap-2 mb-4 font-semibold text-lg"><span className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8 font-bold text-primary text-sm">$</span>Lainnya</h3>
												<div className="gap-6 grid md:grid-cols-2 pl-10">
                                                    <FormField id="penghasilan_ortu" label="Rata-rata Penghasilan Orang Tua">
                                                        <Select value={data.penghasilan_ortu} onValueChange={(value) => setData("penghasilan_ortu", value)}>
                                                            <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="K"><span dangerouslySetInnerHTML={{ __html: "< 1 Juta" }} /></SelectItem>
                                                                <SelectItem value="A">1 Juta - 3 Juta</SelectItem>
                                                                <SelectItem value="B">3 Juta - 5 Juta</SelectItem>
                                                                <SelectItem value="C"><span dangerouslySetInnerHTML={{ __html: "> 5 Juta" }} /></SelectItem>
                                                            </SelectContent>
                                                        </Select>
													</FormField>
												</div>
											</div>

										</div>
									)}
                                    {currentStep === 3 && (
										<div className="space-y-6">
                                            <div>
												<h3 className="flex items-center gap-2 mb-4 font-semibold text-lg"><span className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8 font-bold text-primary text-sm">S</span>Sekolah Sebelumnya</h3>
												<div className="gap-6 grid md:grid-cols-2 pl-10">
                                                    <FormField id="asal_sekolah" label="Nama Sekolah Asal" className="md:col-span-2">
														<Input id="asal_sekolah" value={data.asal_sekolah} onChange={(e) => setData("asal_sekolah", e.target.value)} className="rounded-xl h-12" />
													</FormField>
                                                    <FormField id="npsn_sekolah_asal" label="NPSN Sekolah (8 digit)">
														<Input 
															id="npsn_sekolah_asal" 
															value={data.npsn_sekolah_asal} 
															onChange={(e) => {
																const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
																setData("npsn_sekolah_asal", val);
															}} 
															className="rounded-xl h-12" 
															maxLength={8}
														/>
													</FormField>
                                                    <FormField id="tahun_lulus" label="Tahun Lulus (4 digit)">
														<Input 
															id="tahun_lulus" 
															value={data.tahun_lulus} 
															onChange={(e) => {
																const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
																setData("tahun_lulus", val);
															}} 
															className="rounded-xl h-12" 
															maxLength={4}
														/>
													</FormField>
                                                    <FormField id="alamat_sekolah_asal" label="Alamat Sekolah Asal" className="md:col-span-2">
														<Input id="alamat_sekolah_asal" value={data.alamat_sekolah_asal} onChange={(e) => setData("alamat_sekolah_asal", e.target.value)} className="rounded-xl h-12" />
													</FormField>
                                                    <div className="flex items-center space-x-2">
														<Checkbox id="pernah_paud" checked={data.pernah_paud} onCheckedChange={(checked) => setData("pernah_paud", checked as boolean)} />
														<Label htmlFor="pernah_paud" className="font-normal cursor-pointer">Pernah PAUD</Label>
													</div>
                                                    <div className="flex items-center space-x-2">
														<Checkbox id="pernah_tk" checked={data.pernah_tk} onCheckedChange={(checked) => setData("pernah_tk", checked as boolean)} />
														<Label htmlFor="pernah_tk" className="font-normal cursor-pointer">Pernah TK</Label>
													</div>
                                                </div>
                                            </div>

                                            <div>
												<h3 className="flex items-center gap-2 mb-4 font-semibold text-lg"><span className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8 font-bold text-primary text-sm">B</span>Bakat & Minat</h3>
												<div className="gap-6 grid md:grid-cols-2 pl-10">
                                                    <FormField id="prestasi_diraih" label="Prestasi yang Pernah Diraih" className="md:col-span-2">
                                                        <Textarea id="prestasi_diraih" value={data.prestasi_diraih} onChange={(e) => setData("prestasi_diraih", e.target.value)} className="rounded-xl" />
                                                    </FormField>
                                                    
                                                    <FormField id="pengalaman_berkesan" label="Pengalaman Terkesan" className="md:col-span-2">
                                                        <Textarea id="pengalaman_berkesan" value={data.pengalaman_berkesan} onChange={(e) => setData("pengalaman_berkesan", e.target.value)} className="rounded-xl" />
                                                    </FormField>

                                                    <FormField id="cita_cita" label="Cita-cita">
                                                        <Input id="cita_cita" value={data.cita_cita} onChange={(e) => setData("cita_cita", e.target.value)} className="rounded-xl h-12" />
                                                    </FormField>

                                                    <FormField id="no_hp_pribadi" label="Nomor HP / WhatsApp Pribadi">
                                                        <Input 
															id="no_hp_pribadi" 
															type="tel" 
															value={data.no_hp_pribadi} 
															onChange={(e) => {
																const val = e.target.value.replace(/[^0-9+]/g, "");
																setData("no_hp_pribadi", val);
															}} 
															className="rounded-xl h-12" 
														/>
                                                    </FormField>

                                                    <FormField id="ekstrakurikuler" label="Ekstrakurikuler yang Ingin Diikuti" className="md:col-span-2">
                                                        <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 mt-2">
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
                                                    </FormField>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 4 && (
										<div className="space-y-6">
											<div className="bg-primary/5 p-6 border border-primary/20 rounded-2xl mb-6">
                                                <h4 className="mb-3 font-semibold text-foreground">Upload Berkas Pendaftaran</h4>
                                                <p className="text-sm text-muted-foreground">Silakan upload scan/foto dokumen asli. Format yang didukung: JPG, PNG, PDF. Maksimal 2MB per file.</p>
                                            </div>
                                            <div className="gap-6 grid md:grid-cols-2">
                                                {masterDocuments.map((doc) => (
                                                    <FormField 
                                                        key={doc.id} 
                                                        id={doc.slug} 
                                                        label={doc.name} 
                                                        required={doc.is_required} 
                                                        error={getError(doc.slug)}
                                                    >
                                                        <Input 
                                                            id={doc.slug} 
                                                            type="file" 
                                                            accept={doc.slug === 'pas_foto' ? "image/jpeg,image/png" : "image/jpeg,image/png,application/pdf"} 
                                                            onChange={(e) => setData(doc.slug, e.target.files?.[0] || null)} 
                                                            className="rounded-xl pt-2.5 h-12 cursor-pointer" 
                                                        />
                                                        {doc.description && <p className="text-[10px] text-muted-foreground mt-1 px-1">{doc.description}</p>}
                                                    </FormField>
                                                ))}

                                                {/* Fallback for hardcoded fields if masterDocuments is empty (backwards compatibility) */}
                                                {masterDocuments.length === 0 && (
                                                    <>
                                                        <FormField id="pas_foto" label="Pas Foto Berwarna (3x4)" error={getError("pas_foto")}>
                                                            <Input id="pas_foto" type="file" accept="image/jpeg,image/png" onChange={(e) => setData("pas_foto", e.target.files?.[0] || null)} className="rounded-xl pt-2.5 h-12 cursor-pointer" />
                                                        </FormField>
                                                        
                                                        <FormField id="scan_ijazah_paud_tk" label="Scan Ijazah Terakhir" error={getError("scan_ijazah_paud_tk")}>
                                                            <Input id="scan_ijazah_paud_tk" type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setData("scan_ijazah_paud_tk", e.target.files?.[0] || null)} className="rounded-xl pt-2.5 h-12 cursor-pointer" />
                                                        </FormField>

                                                        <FormField id="scan_kk" label="Scan Kartu Keluarga (KK)" error={getError("scan_kk")}>
                                                            <Input id="scan_kk" type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setData("scan_kk", e.target.files?.[0] || null)} className="rounded-xl pt-2.5 h-12 cursor-pointer" />
                                                        </FormField>

                                                        <FormField id="scan_akta_kelahiran" label="Scan Akta Kelahiran" error={getError("scan_akta_kelahiran")}>
                                                            <Input id="scan_akta_kelahiran" type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setData("scan_akta_kelahiran", e.target.files?.[0] || null)} className="rounded-xl pt-2.5 h-12 cursor-pointer" />
                                                        </FormField>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
								</div>

								<div className="flex justify-between mt-8 pt-6 border-t">
									<Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1} className="bg-transparent px-6 rounded-xl">
										<ChevronLeft className="mr-2 w-4 h-4" /> Sebelumnya
									</Button>

									{currentStep < 4 ? (
										<Button key="next-step-btn" type="button" onClick={nextStep} className="px-6 rounded-xl">
											Selanjutnya <ChevronRight className="ml-2 w-4 h-4" />
										</Button>
									) : (
										<Button key="submit-btn" type="submit" disabled={processing} className="bg-primary hover:bg-primary/90 px-8 rounded-xl">
											<CheckCircle2 className="mr-2 w-4 h-4" />
											{processing ? "Mengirim..." : "Kirim Pendaftaran"}
										</Button>
									)}
								</div>
							</form>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
