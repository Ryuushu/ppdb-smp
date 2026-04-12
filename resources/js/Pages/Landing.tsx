import { ExtracurricularSection } from "@/components/extracurricular-section";
import { FacilitiesSection } from "@/components/facilities-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { BrosurModal } from "@/components/BrosurModal";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Home({ gelombang, setting, masterDocuments }: { gelombang: any[]; setting: any; masterDocuments: any[] }) {
	const [isBrosurOpen, setIsBrosurOpen] = useState(false);

	return (
		<main className="min-h-screen">
			<Head title="SNPMB MTs Nurul Ulum | Pendaftaran Siswa Baru 2026/2027" />
			<Navbar onShowBrosur={() => setIsBrosurOpen(true)} />
			<HeroSection onShowBrosur={() => setIsBrosurOpen(true)} />
			<FacilitiesSection />
			<ExtracurricularSection />
			<Footer />

			<BrosurModal 
				isOpen={isBrosurOpen} 
				onClose={() => setIsBrosurOpen(false)} 
				gelombang={gelombang}
				setting={setting}
                masterDocuments={masterDocuments}
			/>
		</main>
	);
}
