import { AlertMessages } from "@/components/alert-messages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Edit, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Edit, Plus, Trash2, Image as ImageIcon, X } from "lucide-react";

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
        },
        hero_image: null as File | null,
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
                                    <Input 
                                        value={data.attributes.date} 
                                        onChange={e => setData('attributes', { ...data.attributes, date: e.target.value })} 
                                        placeholder="Contoh: 12 - 20 Mei 2026" 
                                    />
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
