import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { RegistrationForm } from "@/components/registration-form";
import { Head } from "@inertiajs/react";

interface PendaftaranPageProps {
	gelombangAktif: any | null;
}

export default function PendaftaranPage({ gelombangAktif }: PendaftaranPageProps) {
	return (
		<>
			<Head title="Formulir Pendaftaran | SNPMB MTs Nurul Ulum" />
			<Navbar />
			<main className="min-h-screen bg-gradient-to-b from-secondary via-background to-accent pt-24 pb-16">
				<RegistrationForm gelombangAktif={gelombangAktif} />
			</main>
			<Footer />
		</>
	);
}
