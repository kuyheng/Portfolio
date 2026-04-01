"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { skillService } from "@/lib/services/skillService";

const categories = ["Frontend", "Backend", "Tools"];

type Skill = { id: number; name: string; icon_url: string; category: string };

type SkillFormState = {
  name: string;
  category: string;
  icon_url: string;
};

const emptyForm: SkillFormState = {
  name: "",
  category: "Frontend",
  icon_url: "",
};

const isImage = (value: string) => value.startsWith("http") || value.startsWith("data:");

export default function AdminSkillsPage() {
  const queryClient = useQueryClient();
  const { data: skills = {}, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: skillService.getSkills,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<SkillFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const totalSkills = useMemo(
    () => Object.values(skills).reduce((acc, list) => acc + list.length, 0),
    [skills]
  );

  const createMutation = useMutation({
    mutationFn: skillService.createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill added");
    },
    onError: () => toast.error("Failed to add skill"),
  });

  const deleteMutation = useMutation({
    mutationFn: skillService.deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill deleted");
    },
    onError: () => toast.error("Failed to delete skill"),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createMutation.mutateAsync({
        name: form.name,
        category: form.category,
        icon_url: form.icon_url,
      });
      setForm(emptyForm);
      setDialogOpen(false);
    } catch (_error) {
      // handled by mutation onError
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (_error) {
      // handled by mutation onError
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Skills Library</h2>
          <p className="text-sm text-slate-400">{totalSkills} total skills across your portfolio.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setForm(emptyForm)}>
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Skill</DialogTitle>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <Input
                placeholder="Skill name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
              <Select
                value={form.category}
                onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Icon class or image URL"
                value={form.icon_url}
                onChange={(event) => setForm((prev) => ({ ...prev, icon_url: event.target.value }))}
              />
              <Button type="submit" disabled={createMutation.isPending}>
                Save Skill
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="p-6">
              <div className="h-6 w-32 rounded bg-slate-800 animate-pulse" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((__, sIdx) => (
                  <div key={sIdx} className="h-12 rounded-xl bg-slate-900/60 animate-pulse" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {categories.map((category) => (
            <Card key={category} className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{category}</h3>
                <Badge>{skills[category]?.length ?? 0} skills</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(skills[category] ?? []).map((skill: Skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {isImage(skill.icon_url || "") ? (
                        <img src={skill.icon_url} alt={skill.name} className="h-6 w-6" />
                      ) : (
                        <i className={`${skill.icon_url || "devicon-code-plain"} text-xl text-blue-200`} />
                      )}
                      <span className="text-sm text-slate-200">{skill.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget({ id: skill.id, name: skill.name })}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the skill from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
