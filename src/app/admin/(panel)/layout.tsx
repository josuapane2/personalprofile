import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="min-h-screen px-4 pb-12 pt-20 sm:px-6 lg:ml-64 lg:px-8 lg:pt-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
