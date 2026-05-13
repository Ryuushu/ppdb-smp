import { AlertMessages } from "@/components/alert-messages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Edit, Plus, Trash2, Image as ImageIcon, X, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ContentItem {
    id: number;
    type: string;
    title: string;
    description: string | null;
    image: string | null;
    icon: string | null;
    attributes: any;
    order: number;
    is_active: boolean;
}

interface Props {
    settings: Record<string, string>;
    contents: Record<string, ContentItem[]>;
}

export default function LandingPageSettings({ settings, contents }: Props) {
    const { flash } = usePage<any>().props;

    const initialMisi = settings?.misi ? settings.misi.split('\n').filter(m => m.trim() !== '') : [""];
    const [misiList, setMisiList] = useState<string[]>(initialMisi.length > 0 ? initialMisi : [""]);

    // Hero Form
    const { data: heroData, setData: setHeroData, post: postHero, processing: heroProcessing } = useForm({
        _method: 'put',
        settings: {
            hero_stats_siswa: settings?.hero_stats_siswa || "540",
            hero_stats_akreditasi: settings?.hero_stats_akreditasi || "B",
            hero_stats_tahun: settings?.hero_stats_tahun || "2017",
            hero_title_1: settings?.hero_title_1 || "Selamat Datang di",
            hero_title_2: settings?.hero_title_2 || "MI Nurul Ulum",
            hero_description: settings?.hero_description || "Membentuk generasi Qur'ani yang cerdas, berakhlak mulia, dan siap menghadapi tantangan zaman dengan pendidikan yang berkualitas.",
        },
        hero_image: null as File | null,
        brosur_image: null as File | null,
    });

    const submitHero = (e: React.FormEvent) => {
        e.preventDefault();
        postHero(route("admin.landing-page.settings.update"), {
            preserveScroll: true,
        });
    };

    // Visi Misi Form
    const { data: vmData, setData: setVmData, post: postVm, processing: vmProcessing } = useForm({
        _method: 'put',
        settings: {
            visi: settings?.visi || "",
            misi: settings?.misi || "",
        },
    });

    const submitVm = (e: React.FormEvent) => {
        e.preventDefault();
        postVm(route("admin.landing-page.settings.update"), {
            preserveScroll: true,
        });
    };

    // Footer Form
    const { data: footerData, setData: setFooterData, post: postFooter, processing: footerProcessing } = useForm({
        _method: 'put',
        settings: {
            footer_address: settings?.footer_address || "Krajan Lama, Cindogo, Tapen, Kabupaten Bondowoso, Jawa Timur 68283",
            footer_phone: settings?.footer_phone || "+62 812 2000 1409",
            footer_email: settings?.footer_email || "minurululumcindogo@gmail.co",
            footer_hours: settings?.footer_hours || "Senin - Sabtu: 07:00 - 15:00",
            footer_facebook: settings?.footer_facebook || "https://www.facebook.com/",
            footer_instagram: settings?.footer_instagram || "https://www.instagram.com/",
            footer_tiktok: settings?.footer_tiktok || "https://www.tiktok.com/",
            footer_map_iframe: settings?.footer_map_iframe || "",
        },
    });

    const submitFooter = (e: React.FormEvent) => {
        e.preventDefault();
        postFooter(route("admin.landing-page.settings.update"), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Pengaturan Landing Page" />
            <div className="max-w-6xl mx-auto space-y-6">
                <AlertMessages flash={flash} />
                
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Pengaturan Landing Page</h2>
                        <p className="text-muted-foreground">Kelola konten yang tampil di halaman utama website.</p>
                    </div>
                </div>

                <Tabs defaultValue="hero" className="w-full">
                    <TabsList className="flex flex-wrap h-auto mb-4 justify-start">
                        <TabsTrigger value="hero">Hero / Header</TabsTrigger>
                        <TabsTrigger value="visi_misi">Visi & Misi</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        <TabsTrigger value="alur">Alur Pendaftaran</TabsTrigger>
                        <TabsTrigger value="keunggulan">Keunggulan</TabsTrigger>
                        <TabsTrigger value="fasilitas">Fasilitas</TabsTrigger>
                        <TabsTrigger value="kegiatan">Kegiatan</TabsTrigger>
                        <TabsTrigger value="prestasi">Prestasi</TabsTrigger>
                        <TabsTrigger value="guru">Guru & Staf</TabsTrigger>
                        <TabsTrigger value="ekstra">Ekstrakurikuler</TabsTrigger>
                        <TabsTrigger value="footer">Footer</TabsTrigger>
                    </TabsList>

                    {/* Hero Tab */}
                    <TabsContent value="hero">
                        <Card>
                            <form onSubmit={submitHero}>
                                <CardHeader>
                                    <CardTitle>Pengaturan Hero / Header</CardTitle>
                                    <CardDescription>Atur gambar latar belakang dan statistik yang muncul di paling atas.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Siswa Aktif</Label>
                                            <Input 
                                                value={heroData.settings.hero_stats_siswa} 
                                                onChange={e => setHeroData('settings', { ...heroData.settings, hero_stats_siswa: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Akreditasi</Label>
                                            <Input 
                                                value={heroData.settings.hero_stats_akreditasi} 
                                                onChange={e => setHeroData('settings', { ...heroData.settings, hero_stats_akreditasi: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tahun Berdiri</Label>
                                            <Input 
                                                value={heroData.settings.hero_stats_tahun} 
                                                onChange={e => setHeroData('settings', { ...heroData.settings, hero_stats_tahun: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Judul Baris 1 (Putih)</Label>
                                            <Input 
                                                value={heroData.settings.hero_title_1} 
                                                onChange={e => setHeroData('settings', { ...heroData.settings, hero_title_1: e.target.value })} 
                                                placeholder="Contoh: Selamat Datang di"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Judul Baris 2 (Biru)</Label>
                                            <Input 
                                                value={heroData.settings.hero_title_2} 
                                                onChange={e => setHeroData('settings', { ...heroData.settings, hero_title_2: e.target.value })} 
                                                placeholder="Contoh: MI Nurul Ulum"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Deskripsi Hero</Label>
                                        <Textarea 
                                            value={heroData.settings.hero_description} 
                                            onChange={e => setHeroData('settings', { ...heroData.settings, hero_description: e.target.value })} 
                                            placeholder="Masukkan deskripsi singkat..."
                                            className="min-h-[80px]"
                                        />
                                    </div>

                                    <div className="space-y-2 pt-4 border-t">
                                        <Label>Gambar Latar Belakang (Background)</Label>
                                        <div className="flex flex-col gap-4">
                                            {settings?.hero_image && (
                                                <img src={`/storage/${settings.hero_image}`} className="w-full md:w-1/2 h-48 object-cover rounded-xl border" alt="Hero Background" />
                                            )}
                                            <Input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={e => setHeroData('hero_image', e.target.files?.[0] || null)} 
                                            />
                                            <p className="text-xs text-muted-foreground">Sebaiknya gunakan gambar landscape dengan resolusi tinggi (contoh: 1920x1080px).</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-4 border-t">
                                        <Label>Gambar Brosur (Popup Brosur)</Label>
                                        <div className="flex flex-col gap-4">
                                            {settings?.brosur_image && (
                                                <img src={`/storage/${settings.brosur_image}`} className="w-full md:w-1/4 h-48 object-cover rounded-xl border" alt="Brosur Preview" />
                                            )}
                                            <Input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={e => setHeroData('brosur_image', e.target.files?.[0] || null)} 
                                            />
                                            <p className="text-xs text-muted-foreground">Ini adalah gambar yang akan muncul saat pengunjung menekan tombol "Lihat Brosur". Gunakan gambar dengan rasio portrait.</p>
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={heroProcessing}>Simpan Perubahan</Button>
                                </CardContent>
                            </form>
                        </Card>
                    </TabsContent>

                    {/* Visi Misi Tab */}
                    <TabsContent value="visi_misi">
                        <Card>
                            <form onSubmit={submitVm}>
                                <CardHeader>
                                    <CardTitle>Pengaturan Visi & Misi</CardTitle>
                                    <CardDescription>Atur visi dan misi sekolah yang akan tampil di halaman depan.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Visi Sekolah</Label>
                                        <Textarea 
                                            value={vmData.settings.visi} 
                                            onChange={e => setVmData('settings', { ...vmData.settings, visi: e.target.value })} 
                                            placeholder="Masukkan visi sekolah..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label>Misi Sekolah (Per Baris)</Label>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => {
                                                    const newList = [...misiList, ""];
                                                    setMisiList(newList);
                                                    setVmData('settings', { ...vmData.settings, misi: newList.join('\n') });
                                                }}
                                            >
                                                <Plus className="w-4 h-4 mr-1" /> Tambah Misi
                                            </Button>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            {misiList.map((misi, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input 
                                                        value={misi} 
                                                        onChange={(e) => {
                                                            const newList = [...misiList];
                                                            newList[index] = e.target.value;
                                                            setMisiList(newList);
                                                            setVmData('settings', { ...vmData.settings, misi: newList.join('\n') });
                                                        }} 
                                                        placeholder={`Misi #${index + 1}`}
                                                    />
                                                    <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="text-destructive"
                                                        onClick={() => {
                                                            const newList = misiList.filter((_, i) => i !== index);
                                                            setMisiList(newList.length > 0 ? newList : [""]);
                                                            setVmData('settings', { ...vmData.settings, misi: newList.join('\n') });
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={vmProcessing}>Simpan Perubahan</Button>
                                </CardContent>
                            </form>
                        </Card>
                    </TabsContent>

                    {/* Timeline Tab */}
                    <TabsContent value="timeline">
                        <ContentManager 
                            type="timeline" 
                            title="Timeline Pendaftaran" 
                            description="Atur tahapan waktu pendaftaran."
                            items={contents.timeline || []}
                            fields={['title', 'description', 'icon', 'order']}
                            iconPlaceholder="Cth: Calendar, Clock (Lucide Icon)"
                        />
                    </TabsContent>

                    <TabsContent value="alur">
                        <ContentManager 
                            type="alur" 
                            title="Alur Pendaftaran" 
                            description="Langkah-langkah pendaftaran."
                            items={contents.alur || []}
                            fields={['title', 'description', 'icon', 'order']}
                            iconPlaceholder="Cth: FileText, CheckCircle"
                        />
                    </TabsContent>

                    <TabsContent value="keunggulan">
                        <ContentManager 
                            type="keunggulan" 
                            title="Keunggulan Sekolah" 
                            description="Poin-poin keunggulan sekolah."
                            items={contents.keunggulan || []}
                            fields={['title', 'description', 'icon', 'order']}
                            iconPlaceholder="Cth: Award, GraduationCap"
                        />
                    </TabsContent>

                    <TabsContent value="fasilitas">
                        <ContentManager 
                            type="fasilitas" 
                            title="Fasilitas Sekolah" 
                            description="Fasilitas yang tersedia."
                            items={contents.fasilitas || []}
                            fields={['title', 'description', 'image', 'order']}
                        />
                    </TabsContent>

                    <TabsContent value="kegiatan">
                        <ContentManager 
                            type="kegiatan" 
                            title="Kegiatan Sekolah" 
                            description="Dokumentasi kegiatan siswa."
                            items={contents.kegiatan || []}
                            fields={['title', 'description', 'image', 'order']}
                        />
                    </TabsContent>

                    <TabsContent value="prestasi">
                        <ContentManager 
                            type="prestasi" 
                            title="Prestasi Sekolah" 
                            description="Prestasi yang diraih sekolah/siswa."
                            items={contents.prestasi || []}
                            fields={['title', 'description', 'image', 'order']}
                        />
                    </TabsContent>

                    <TabsContent value="guru">
                        <ContentManager 
                            type="guru" 
                            title="Guru & Staf" 
                            description="Daftar pengajar dan staf."
                            items={contents.guru || []}
                            fields={['title', 'image', 'order', 'jabatan', 'nuptk']}
                        />
                    </TabsContent>

                    <TabsContent value="ekstra">
                        <ContentManager 
                            type="ekstra" 
                            title="Ekstrakurikuler" 
                            description="Daftar ekstrakurikuler."
                            items={contents.ekstra || []}
                            fields={['title', 'description', 'image', 'icon', 'order']}
                        />
                    </TabsContent>

                    <TabsContent value="footer">
                        <Card>
                            <form onSubmit={submitFooter}>
                                <CardHeader>
                                    <CardTitle>Pengaturan Footer</CardTitle>
                                    <CardDescription>Atur informasi kontak, sosial media, dan peta lokasi di bagian bawah website.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-sm border-b pb-2">Informasi Kontak</h3>
                                            <div className="space-y-2">
                                                <Label>Alamat Lengkap</Label>
                                                <Textarea 
                                                    value={footerData.settings.footer_address} 
                                                    onChange={e => setFooterData('settings', { ...footerData.settings, footer_address: e.target.value })} 
                                                    className="min-h-[80px]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Nomor Telepon / WA</Label>
                                                <Input 
                                                    value={footerData.settings.footer_phone} 
                                                    onChange={e => setFooterData('settings', { ...footerData.settings, footer_phone: e.target.value })} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input 
                                                    value={footerData.settings.footer_email} 
                                                    onChange={e => setFooterData('settings', { ...footerData.settings, footer_email: e.target.value })} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Jam Operasional</Label>
                                                <Input 
                                                    value={footerData.settings.footer_hours} 
                                                    onChange={e => setFooterData('settings', { ...footerData.settings, footer_hours: e.target.value })} 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-bold text-sm border-b pb-2">Sosial Media</h3>
                                            <div className="space-y-2">
                                                <Label>Link Facebook</Label>
                                                <Input 
                                                    value={footerData.settings.footer_facebook} 
                                                    onChange={e => setFooterData('settings', { ...footerData.settings, footer_facebook: e.target.value })} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Link Instagram</Label>
                                                <Input 
                                                    value={footerData.settings.footer_instagram} 
                                                    onChange={e => setFooterData('settings', { ...footerData.settings, footer_instagram: e.target.value })} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Link TikTok</Label>
                                                <Input 
                                                    value={footerData.settings.footer_tiktok} 
                                                    onChange={e => setFooterData('settings', { ...footerData.settings, footer_tiktok: e.target.value })} 
                                                />
                                            </div>
                                            
                                            <div className="pt-4 space-y-4">
                                                <h3 className="font-bold text-sm border-b pb-2">Peta Lokasi (Google Maps)</h3>
                                                <div className="space-y-2">
                                                    <Label>Embed Iframe Map</Label>
                                                    <Textarea 
                                                        value={footerData.settings.footer_map_iframe} 
                                                        onChange={e => setFooterData('settings', { ...footerData.settings, footer_map_iframe: e.target.value })} 
                                                        placeholder="Tempel kode <iframe> dari Google Maps di sini..."
                                                        className="min-h-[100px]"
                                                    />
                                                    <p className="text-[10px] text-muted-foreground">Buka Google Maps → Bagikan → Sematkan Peta → Salin HTML.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={footerProcessing}>Simpan Perubahan Footer</Button>
                                </CardContent>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

function ContentManager({ type, title, description, items, fields, iconPlaceholder }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        _method: 'post',
        type: type,
        title: '',
        description: '',
        icon: '',
        order: 0,
        image: null as File | null,
        attributes: {
            date: '',
            jabatan: '',
            nuptk: '',
        },
    });

    const openCreate = () => {
        reset();
        setData({
            _method: 'post',
            type: type,
            title: '',
            description: '',
            icon: '',
            order: items && items.length > 0 ? Math.max(...items.map((i: any) => i.order || 0)) + 1 : 1,
            image: null,
            attributes: { date: '', jabatan: '', nuptk: '' },
        });
        setEditingId(null);
        setIsOpen(true);
    };

    const openEdit = (item: ContentItem) => {
        reset();
        setData({
            _method: 'post',
            type: type,
            title: item.title,
            description: item.description || '',
            icon: item.icon || '',
            order: item.order,
            image: null,
            attributes: item.attributes || { date: '', jabatan: '', nuptk: '' },
        });
        setEditingId(item.id);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const routeUrl = editingId 
            ? route('admin.landing-page.content.update', editingId) 
            : route('admin.landing-page.content.store');

        post(routeUrl, {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
            preserveScroll: true
        });
    };

    const destroy = (id: number) => {
        if (confirm('Yakin ingin menghapus item ini?')) {
            router.delete(route('admin.landing-page.content.destroy', id), {
                preserveScroll: true
            });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Tambah Baru</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit' : 'Tambah'} {title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4">
                            {fields.includes('title') && (
                                <div className="space-y-1">
                                    <Label>Nama / Judul</Label>
                                    <Input value={data.title} onChange={e => setData('title', e.target.value)} required />
                                    {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                                </div>
                            )}

                            {fields.includes('description') && (
                                <div className="space-y-1">
                                    <Label>Deskripsi / Konten</Label>
                                    <Textarea value={data.description} onChange={e => setData('description', e.target.value)} className="min-h-[100px]" />
                                </div>
                            )}

                            {type === 'timeline' && (
                                <div className="space-y-1">
                                    <Label>Tanggal (Opsional)</Label>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Input 
                                                value={data.attributes.date} 
                                                onChange={e => setData('attributes', { ...data.attributes, date: e.target.value })} 
                                                placeholder="Contoh: 12 - 20 Mei 2026" 
                                            />
                                        </div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="icon" className="shrink-0">
                                                    <CalendarIcon className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar
                                                    mode="single"
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setData('attributes', { 
                                                                ...data.attributes, 
                                                                date: format(date, "d MMMM yyyy", { locale: idLocale }) 
                                                            });
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Pilih dari kalender atau ketik manual (untuk rentang tanggal).</p>
                                </div>
                            )}

                            {fields.includes('icon') && (
                                <div className="space-y-1">
                                    <Label>Ikon</Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.icon} 
                                        onChange={e => setData('icon', e.target.value)}
                                    >
                                        <option value="">-- Pilih Ikon --</option>
                                        <option value="Calendar">Kalender (Calendar)</option>
                                        <option value="Clock">Jam (Clock)</option>
                                        <option value="FileText">Dokumen (FileText)</option>
                                        <option value="CheckCircle">Centang (CheckCircle)</option>
                                        <option value="Award">Penghargaan (Award)</option>
                                        <option value="GraduationCap">Topi Toga (GraduationCap)</option>
                                        <option value="Building">Gedung (Building)</option>
                                        <option value="Trophy">Piala (Trophy)</option>
                                        <option value="User">Orang (User)</option>
                                        <option value="Users">Banyak Orang (Users)</option>
                                        <option value="Activity">Aktivitas (Activity)</option>
                                        <option value="BookOpen">Buku Terbuka (BookOpen)</option>
                                        <option value="Star">Bintang (Star)</option>
                                        <option value="Target">Target (Target)</option>
                                        <option value="Heart">Hati (Heart)</option>
                                        <option value="Shield">Perisai (Shield)</option>
                                    </select>
                                    <p className="text-xs text-muted-foreground">Pilih ikon dari daftar. Kosongkan jika ingin menggunakan gambar/foto.</p>
                                </div>
                            )}

                            {fields.includes('jabatan') && (
                                <div className="space-y-1">
                                    <Label>Jabatan</Label>
                                    <Input value={data.attributes?.jabatan || ''} onChange={e => setData('attributes', { ...data.attributes, jabatan: e.target.value })} />
                                </div>
                            )}

                            {fields.includes('nuptk') && (
                                <div className="space-y-1">
                                    <Label>NUPTK / NIP</Label>
                                    <Input value={data.attributes?.nuptk || ''} onChange={e => setData('attributes', { ...data.attributes, nuptk: e.target.value })} />
                                </div>
                            )}

                            {fields.includes('image') && (
                                <div className="space-y-1">
                                    <Label>Gambar / Foto</Label>
                                    <Input type="file" accept="image/*" onChange={e => setData('image', e.target.files?.[0] || null)} />
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label>Urutan</Label>
                                <Input type="number" value={data.order} onChange={e => setData('order', parseInt(e.target.value))} />
                            </div>

                            <Button type="submit" disabled={processing} className="w-full">Simpan</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item: ContentItem) => (
                        <div key={item.id} className="border rounded-xl p-4 flex gap-4 items-start bg-card relative group">
                            {item.image ? (
                                <img src={`/storage/${item.image}`} className="w-16 h-16 object-cover rounded-lg shrink-0 bg-muted" alt="" />
                            ) : (
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                                    {item.icon ? item.icon : <ImageIcon />}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold truncate">{item.title}</h4>
                                {item.attributes?.jabatan && <p className="text-xs text-primary font-medium">{item.attributes.jabatan}</p>}
                                {item.attributes?.nuptk && <p className="text-[10px] text-muted-foreground">{item.attributes.nuptk}</p>}
                                {item.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>}
                                <p className="text-[10px] text-muted-foreground mt-2">Urutan: {item.order}</p>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => openEdit(item)}>
                                    <Edit className="w-3 h-3" />
                                </Button>
                                <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => destroy(item.id)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                            Belum ada data.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
