import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { BrosurModal } from "@/components/BrosurModal";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import {
    TimelineSection,
    AlurSection,
    VisiMisiSection,
    KeunggulanSection,
    FasilitasSectionNew,
    KegiatanPrestasiSection,
    GuruSection,
} from "@/components/landing-sections";
import { ExtracurricularSection } from "@/components/extracurricular-section";

interface Props {
    gelombang: any[];
    setting: any;
    masterDocuments: any[];
    landingSettings: Record<string, string>;
    landingContents: Record<string, any[]>;
}

export default function Home({ gelombang, setting, masterDocuments, landingSettings = {}, landingContents = {} }: Props) {
	const [isBrosurOpen, setIsBrosurOpen] = useState(false);

	return (
		<main className="min-h-screen">
			<Head title="SNPMB MI Nurul Ulum | Pendaftaran Siswa Baru" />
			<Navbar onShowBrosur={() => setIsBrosurOpen(true)} />
			<HeroSection onShowBrosur={() => setIsBrosurOpen(true)} settings={landingSettings} />
            
            <TimelineSection data={landingContents?.timeline || []} />
            <AlurSection data={landingContents?.alur || []} />
            <VisiMisiSection settings={landingSettings || {}} />
            <KeunggulanSection data={landingContents?.keunggulan || []} />
            <FasilitasSectionNew data={landingContents?.fasilitas || []} />
            <KegiatanPrestasiSection kegiatan={landingContents?.kegiatan || []} prestasi={landingContents?.prestasi || []} />
            <GuruSection data={landingContents?.guru || []} />
            <ExtracurricularSection data={landingContents?.ekstra || []} />

			<Footer landingSettings={landingSettings} />

			<BrosurModal 
				isOpen={isBrosurOpen} 
				onClose={() => setIsBrosurOpen(false)} 
				gelombang={gelombang}
				setting={setting}
                masterDocuments={masterDocuments}
                landingSettings={landingSettings}
			/>
		</main>
	);
}
