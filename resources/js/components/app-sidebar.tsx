import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import {
	Calendar,
	ChevronRight,
	ChevronUp,
	File,
	FileText,
	Gauge,
	IdCard,
	LayoutDashboard,
	MonitorCog,
	Receipt,
	Settings,
	Shirt,
	User,
	UserCheck,
	UserPlus,
	Users,
	UserX,
} from "lucide-react";
import { useEffect } from "react";

export function AppSidebar() {
	const { url, props } = usePage<any>();
	const { isMobile, setOpenMobile } = useSidebar();
	const user = props.auth?.user;
	const tahun = props.tahun || new Date().getFullYear();

	// Close sidebar on mobile when navigating
	useEffect(() => {
		if (isMobile) {
			setOpenMobile(false);
		}
	}, [url, isMobile, setOpenMobile]);

	const isActive = (path: string) => url.startsWith(path);

	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-black">
									<img
										src="/img/logo-1.png"
										alt="Logo"
										className="size-6 rounded"
									/>
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold text-lg">SNPMB</span>
									<span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">MI NURUL ULUM</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* Dashboard */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url === "/dashboard" || url === "/dashboard/"}
								>
									<Link href="/dashboard">
										<LayoutDashboard className="size-4" />
										<span>Dashboard</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* Gelombang Pendaftaran */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.startsWith("/dashboard/gelombang")}
								>
									<Link href={route("admin.gelombang.index")}>
										<Calendar className="size-4" />
										<span>Kelola Gelombang</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* Data Pendaftar */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/ppdb/list-pendaftar")}
								>
									<Link href={route("ppdb.list.pendaftar")}>
										<Users className="size-4" />
										<span>Data Pendaftar</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* Tambah Pendaftar */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/ppdb/tambah-pendaftar")}
								>
									<Link href={route("ppdb.tambah.pendaftar")}>
										<UserPlus className="size-4" />
										<span>Tambah Peserta</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>



							{/* Pemetaan Kelas */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.startsWith("/dashboard/pemetaan-kelas")}
								>
									<Link href={route("admin.pemetaan-kelas.index")}>
										<MonitorCog className="size-4" />
										<span>Pemetaan Kelas</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Cetak Dokumen */}
				<SidebarGroup>
					<SidebarGroupLabel>Cetak Dokumen</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* Kartu Pendaftaran */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/kartu-pendaftaran/show")}
								>
									<Link href={route("ppdb.kartu.show.program")}>
										<IdCard className="size-4" />
										<span>Kartu Pendaftaran</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* Form Pendaftaran */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/formulir/show")}
								>
									<Link href={route("ppdb.formulir.show.program")}>
										<File className="size-4" />
										<span>Form Pendaftaran</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* Surat Diterima */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/surat/show")}
								>
									<Link href={route("ppdb.surat.show.program")}>
										<FileText className="size-4" />
										<span>Surat Diterima</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{/* Surat Diterima */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/kwitansi/rekap-seragam")}
								>
									<Link href={route("ppdb.rekap.seragam")}>
										<FileText className="size-4" />
										<span>Rekap Seragam (Ukuran)</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{/* Kwitansi */}
							<CollapsibleMenuItem
								icon={<Receipt className="size-4" />}
								title="Kwitansi"
								defaultOpen={isActive("/dashboard/kwitansi")}
							>
								<SidebarMenuSubItem>
									<SidebarMenuSubButton
										asChild
										isActive={
											url === "/dashboard/kwitansi/show" ||
											url === "/dashboard/kwitansi/show/"
										}
									>
										<Link href={route("ppdb.kwitansi.show")}>
											List Peserta Diterima
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
								<SidebarMenuSubItem>
									<SidebarMenuSubButton
										asChild
										isActive={url.includes("/kwitansi/rekap")}
									>
										<Link href={route("ppdb.rekap.kwitansi")}>
											Rekap Pembayaran
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>	
							</CollapsibleMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Pengaturan */}
				<SidebarGroup>
					<SidebarGroupLabel>Pengaturan Akun</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/setting/profile")}
								>
									<Link href={route("setting.profile")}>
										<User className="size-4" />
										<span>Pengaturan Profile</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{user?.role === 'super_admin' && (
								<>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											isActive={url.includes("/setting/admin-items")}
										>
											<Link href={route("admin.admin-items.index")}>
												<Receipt className="size-4" />
												<span>Biaya Administrasi</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											isActive={url.includes("/setting/ppdb")}
										>
											<Link href={route("snpmb.set.batas.akhir")}>
												<Settings className="size-4" />
												<span>Pengaturan SNPMB</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											isActive={url.includes("/setting/master-documents")}
										>
											<Link href={route("admin.master-documents.index")}>
												<FileText className="size-4" />
												<span>Master Dokumen</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</>
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User className="size-4" />
									<span>{user?.name ?? "User"}</span>
									<ChevronUp className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<DropdownMenuItem asChild>
									<Link href={route("setting.profile")}>
										<User className="mr-2 size-4" />
										Profile
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href={route("logout")} method="post" as="button">
										<MonitorCog className="mr-2 size-4" />
										Logout
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

function CollapsibleMenuItem({
	icon,
	title,
	defaultOpen = false,
	children,
}: {
	icon: React.ReactNode;
	title: string;
	defaultOpen?: boolean;
	children: React.ReactNode;
}) {
	return (
		<Collapsible defaultOpen={defaultOpen} className="group/collapsible">
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						{icon}
						<span>{title}</span>
						<ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>{children}</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
}
