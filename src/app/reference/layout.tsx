import { NotationProvider } from "@/components/reference";
import { ReferenceSidebar, ReferenceTabs } from "@/components/reference";

export const metadata = {
  title: "Reference - Eclipse Calculator",
  description: "Quick reference guides for Eclipse: Second Dawn for the Galaxy",
};

export default function ReferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotationProvider>
      <div className="container mx-auto px-4 py-6">
        {/* Mobile: Horizontal tabs */}
        <div className="mb-6 lg:hidden">
          <ReferenceTabs />
        </div>

        <div className="flex gap-8">
          {/* Desktop: Sidebar */}
          <aside className="hidden w-48 shrink-0 lg:block">
            <div className="sticky top-20">
              <ReferenceSidebar />
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </NotationProvider>
  );
}
