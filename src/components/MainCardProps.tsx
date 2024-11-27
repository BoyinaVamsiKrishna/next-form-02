'use client'
import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
function MainCardProps({children,}: Readonly<{children: React.ReactNode;}>) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  return (
    <div className={cn("grid min-h-screen transition-[margin-left] ease-in-out duration-300", sidebar?.isOpen === false ? "ml-[90px]" : "ml-72")}>
      <div className="flex flex-col w-full">
        {/* <main className="min-h-[calc(100vh-57px-97px)] w-[99%] flex-1 py-2"> */}
          <div className={cn(sidebar?.isOpen === false ? "w-[100%]" : "w-[100%]")}>
                        {children}
              </div>
        {/* </main> */}
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        </footer>
      </div>
      </div>
  );
}

export default MainCardProps