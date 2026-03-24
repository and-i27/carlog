import NavBar from "@/components/ui/NavBar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="min-h-screen flex flex-col">
            <NavBar />

            {children}

        </main>
    )
}
