import Sidebar from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-row w-full h-full gap-8">
      <Sidebar/>
			<section className="flex flex-col">
        <div className="w-full pt-8 text-4xl font-semibold"> Title </div>
        <div className="w-full h-full">
      	  {children}
        </div>
			</section>
    </section>
  )
}