"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/app/(protected)/admin/actions";

interface FileUploadProps {
  newsletterId: string;
  currentFilePath?: string | null;
}

export function FileUpload({ newsletterId, currentFilePath }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("newsletter_id", newsletterId);

    const result = await uploadFile(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "File uploaded successfully" });
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? "border-sky-blue bg-sky-blue/5"
            : "border-border hover:border-sky-blue/50"
        }`}
      >
        <svg className="mb-2 h-8 w-8 text-medium-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm text-medium-gray">
          Drop a file here or click to browse
        </p>
        <p className="text-xs text-medium-gray/70 mt-1">
          PDF, DOC, or DOCX
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-sky-blue">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Uploading...
        </div>
      )}

      {message && (
        <p className={`text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
          {message.text}
        </p>
      )}

      {currentFilePath && (
        <p className="text-sm text-medium-gray">
          Current file: <span className="font-mono text-xs">{currentFilePath}</span>
        </p>
      )}
    </div>
  );
}
