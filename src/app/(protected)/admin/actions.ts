"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { analyzeNewsletterUrl } from "@/lib/openai";

export async function createNewsletter(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const year = parseInt(formData.get("year") as string);
  const month = parseInt(formData.get("month") as string);
  const source_type = formData.get("source_type") as "url" | "file";
  const source_url = formData.get("source_url") as string | null;

  const { data, error } = await supabase
    .from("newsletters")
    .insert({
      title,
      year,
      month,
      source_type,
      source_url: source_type === "url" ? source_url : null,
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/admin/new?error=${encodeURIComponent(error.message)}`);
  }

  // If a URL was provided, run LLM analysis to auto-generate sections
  if (source_type === "url" && source_url) {
    try {
      const analysis = await analyzeNewsletterUrl(source_url, title);

      // Update newsletter with AI-generated metadata and content
      await supabase
        .from("newsletters")
        .update({
          overall_summary: analysis.overall_summary,
          key_topics: analysis.key_topics,
          content_text: analysis.content_text,
          ai_processed: true,
          title: title || analysis.suggested_title,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);

      // Insert sections and links
      for (let i = 0; i < analysis.sections.length; i++) {
        const section = analysis.sections[i];

        const { data: sectionData } = await supabase
          .from("newsletter_sections")
          .insert({
            newsletter_id: data.id,
            section_title: section.section_title,
            summary: section.summary,
            sort_order: i,
          })
          .select("id")
          .single();

        if (sectionData && section.links.length > 0) {
          await supabase.from("section_links").insert(
            section.links.map((link, j) => ({
              section_id: sectionData.id,
              label: link.label,
              url: link.url,
              sort_order: j,
            }))
          );
        }
      }
    } catch (e) {
      // LLM processing failed — newsletter is still created, admin can add sections manually
      console.error("AI analysis failed:", e);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect(`/admin/${data.id}/sections`);
}

export async function updateNewsletter(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const year = parseInt(formData.get("year") as string);
  const month = parseInt(formData.get("month") as string);
  const source_type = formData.get("source_type") as "url" | "file";
  const source_url = formData.get("source_url") as string | null;

  const { error } = await supabase
    .from("newsletters")
    .update({
      title,
      year,
      month,
      source_type,
      source_url: source_type === "url" ? source_url : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
  redirect(`/admin/${id}/sections`);
}

export async function deleteNewsletter(id: string) {
  const supabase = await createClient();

  // Delete associated file from storage if exists
  const { data: newsletter } = await supabase
    .from("newsletters")
    .select("file_path")
    .eq("id", id)
    .single();

  if (newsletter?.file_path) {
    await supabase.storage
      .from("newsletter-files")
      .remove([newsletter.file_path]);
  }

  await supabase
    .from("newsletters")
    .delete()
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function uploadFile(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("file") as File;
  const newsletterId = formData.get("newsletter_id") as string;

  if (!file || file.size === 0) {
    return { error: "No file selected" };
  }

  const ext = file.name.split(".").pop();
  const filePath = `${newsletterId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("newsletter-files")
    .upload(filePath, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from("newsletter-files")
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("newsletters")
    .update({ file_path: filePath, source_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", newsletterId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/admin/${newsletterId}`);
  revalidatePath(`/admin/${newsletterId}/sections`);
  return { success: true, publicUrl };
}

export async function addSection(formData: FormData) {
  const supabase = await createClient();

  const newsletter_id = formData.get("newsletter_id") as string;
  const section_title = formData.get("section_title") as string;
  const summary = (formData.get("summary") as string) || null;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;

  const { error } = await supabase.from("newsletter_sections").insert({
    newsletter_id,
    section_title,
    summary,
    sort_order,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/${newsletter_id}/sections`);
  revalidatePath("/");
}

export async function updateSection(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();

  const newsletter_id = formData.get("newsletter_id") as string;
  const section_title = formData.get("section_title") as string;
  const summary = (formData.get("summary") as string) || null;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;

  const { error } = await supabase
    .from("newsletter_sections")
    .update({ section_title, summary, sort_order })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/${newsletter_id}/sections`);
  revalidatePath("/");
}

export async function deleteSection(id: string, newsletterId: string) {
  const supabase = await createClient();

  await supabase
    .from("newsletter_sections")
    .delete()
    .eq("id", id);

  revalidatePath(`/admin/${newsletterId}/sections`);
  revalidatePath("/");
}

export async function addLink(formData: FormData) {
  const supabase = await createClient();

  const section_id = formData.get("section_id") as string;
  const newsletter_id = formData.get("newsletter_id") as string;
  const label = formData.get("label") as string;
  const url = formData.get("url") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;

  const { error } = await supabase.from("section_links").insert({
    section_id,
    label,
    url,
    sort_order,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/${newsletter_id}/sections`);
  revalidatePath("/");
}

export async function updateLink(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();

  const newsletter_id = formData.get("newsletter_id") as string;
  const label = formData.get("label") as string;
  const url = formData.get("url") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;

  const { error } = await supabase
    .from("section_links")
    .update({ label, url, sort_order })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/${newsletter_id}/sections`);
  revalidatePath("/");
}

export async function deleteLink(id: string, newsletterId: string) {
  const supabase = await createClient();

  await supabase
    .from("section_links")
    .delete()
    .eq("id", id);

  revalidatePath(`/admin/${newsletterId}/sections`);
  revalidatePath("/");
}
