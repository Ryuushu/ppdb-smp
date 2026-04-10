import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { RegistrationForm } from "@/components/registration-form";
import { Head } from "@inertiajs/react";

interface PendaftaranPageProps {
	program: { value: number | string; label: string }[];
	gelombangAktif: any | null;
}

export default function PendaftaranPage({ program, gelombangAktif }: PendaftaranPageProps) {
	return (
		<>
			<Head title="Formulir Pendaftaran | SNPMB MTs Nurul Ulum" />
			<Navbar />
			<main className="min-h-screen bg-gradient-to-b from-secondary via-background to-accent pt-24 pb-16">
				<RegistrationForm programOptions={program} gelombangAktif={gelombangAktif} />
			</main>
			<Footer />
		</>
	);
}
