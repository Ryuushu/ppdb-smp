import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    item: any;
}

export default function PrestasiDetail({ item }: Props) {
    return (
        <main className="min-h-screen bg-background">
            <Head title={`${item.title} | Prestasi MI Nurul Ulum`} />
            <Navbar onShowBrosur={() => window.location.href = '/#beranda'} />
            
            <div className="pt-24 pb-12 bg-secondary/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Button variant="ghost" asChild className="mb-8 group">
                        <Link href="/#prestasi" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Beranda
                        </Link>
                    </Button>
                    
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-sm uppercase">
                            <Trophy className="w-4 h-4" />
                            Prestasi Sekolah
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                            {item.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {item.image && (
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 aspect-video">
                            <img 
                                src={`/storage/${item.image}`} 
                                className="w-full h-full object-cover" 
                                alt={item.title} 
                            />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground text-xl">
                            {item.description}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
