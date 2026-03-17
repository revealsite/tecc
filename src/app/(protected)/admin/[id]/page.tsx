import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { NewsletterForm } from "@/components/admin/newsletter-form";
import { FileUpload } from "@/components/admin/file-upload";
import { updateNewsletter } from "../actions";
import type { Newsletter } from "@/lib/types";

export default async function EditNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: newsletter } = await supabase
    .from("newsletters")
    .select("*")
    .eq("id", id)
    .single();

  if (!newsletter) {
    notFound();
  }

  const nl = newsletter as Newsletter;

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateNewsletter(id, formData);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Edit Newsletter</h1>
        <p className="text-sm text-medium-gray">{nl.title}</p>
      </div>

      <Card className="p-6">
        <NewsletterForm newsletter={nl} action={handleUpdate} />
      </Card>

      {nl.source_type === "file" && (
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-navy">
            File Upload
          </h2>
          <FileUpload newsletterId={nl.id} currentFilePath={nl.file_path} />
        </Card>
      )}
    </div>
  );
}
