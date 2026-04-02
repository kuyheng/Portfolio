"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cvService } from "@/lib/services/cvService";
import baseData from "@/data/data.json";

export default function AdminCvPage() {
  const queryClient = useQueryClient();
  const { data: cvInfo, isLoading } = useQuery({
    queryKey: ["cv"],
    queryFn: cvService.getCVInfo,
  });
  const [uploading, setUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: cvService.uploadCV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cv"] });
      toast.success("CV uploaded successfully");
    },
    onError: () => toast.error("Failed to upload CV"),
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }
    setUploading(true);
    try {
      await uploadMutation.mutateAsync(file);
    } catch {
      // handled by mutation onError
    }
    setUploading(false);
  };

  const downloadUrl = cvInfo?.file_url ? cvService.downloadCVUrl() : baseData.cvUrl;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Current CV</h2>
            <p className="text-sm text-slate-400">Preview the active resume file.</p>
          </div>
          <Button variant="outline" asChild>
            <a href={downloadUrl} download>
              Download CV
            </a>
          </Button>
        </div>
        <div className="mt-6 h-[500px] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          {isLoading ? (
            <div className="h-full w-full animate-pulse bg-slate-900/60" />
          ) : cvInfo?.file_url ? (
            <iframe src={cvInfo.file_url} title="CV Preview" className="h-full w-full" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No CV uploaded yet.
            </div>
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white">Upload New CV</h3>
          <p className="text-sm text-slate-400">Replace the current CV with a new PDF.</p>
          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
            <UploadCloud className="h-5 w-5" />
            {uploading ? "Uploading..." : "Choose PDF file"}
            <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
          </label>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white">CV Metrics</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>Downloads: {cvInfo?.download_count ?? 0}</p>
            <p>
              Last updated:{" "}
              {cvInfo?.uploaded_at ? new Date(cvInfo.uploaded_at).toLocaleString() : "-"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
