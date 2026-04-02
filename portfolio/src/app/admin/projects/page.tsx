"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Reorder } from "framer-motion";
import {
  GripVertical,
  Link as LinkIcon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectService } from "@/lib/services/projectService";

const categories = ["Web", "Mobile", "UI/UX"];

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  thumbnail_url: string;
  sort_order: number;
};

type ProjectFormState = {
  title: string;
  description: string;
  category: string;
  tech: string[];
  image: string;
  imageFile: File | null;
  github: string;
  demo: string;
};

type ProjectPayload = {
  title: string;
  description: string;
  category: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  thumbnail_url: string;
  thumbnail?: File;
};

const emptyForm: ProjectFormState = {
  title: "",
  description: "",
  category: "Web",
  tech: [],
  image: "",
  imageFile: null,
  github: "",
  demo: "",
};

export default function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: projectService.getProjects,
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderIds, setReorderIds] = useState<number[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [editing, setEditing] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const displayProjects = useMemo(() => {
    if (!reorderIds) return projects;
    const projectMap = new Map(projects.map((project) => [project.id, project]));
    const ordered = reorderIds
      .map((id) => projectMap.get(id))
      .filter((project): project is Project => !!project);
    const remaining = projects.filter((project) => !reorderIds.includes(project.id));
    return [...ordered, ...remaining];
  }, [projects, reorderIds]);

  const filteredProjects = useMemo(() => {
    if (reorderMode) return displayProjects;
    return displayProjects.filter((project) => {
      const matchesFilter = filter === "All" || project.category === filter;
      const query = search.toLowerCase();
      const matchesQuery =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        (project.tech_stack || []).join(" ").toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [filter, displayProjects, reorderMode, search]);

  const createMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project added");
    },
    onError: () => toast.error("Failed to add project"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProjectPayload }) =>
      projectService.updateProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated");
    },
    onError: () => toast.error("Failed to update project"),
  });

  const deleteMutation = useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: number[]) => projectService.reorderProjects({ ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project order saved");
    },
    onError: () => toast.error("Failed to save order"),
  });

  const handleOpenNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setTechInput("");
    setDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      tech: project.tech_stack || [],
      image: project.thumbnail_url || "",
      imageFile: null,
      github: project.github_url || "",
      demo: project.live_url || "",
    });
    setTechInput("");
    setDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: ProjectPayload = {
      title: form.title,
      description: form.description,
      category: form.category,
      tech_stack: form.tech,
      github_url: form.github,
      live_url: form.demo,
      thumbnail_url: form.image,
      thumbnail: form.imageFile || undefined,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setDialogOpen(false);
    } catch {
      // handled by mutation onError
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // handled by mutation onError
    }
  };

  const addTech = () => {
    const value = techInput.trim();
    if (!value) return;
    if (form.tech.includes(value)) {
      setTechInput("");
      return;
    }
    setForm((prev) => ({ ...prev, tech: [...prev.tech, value] }));
    setTechInput("");
  };

  const removeTech = (tech: string) => {
    setForm((prev) => ({ ...prev, tech: prev.tech.filter((item) => item !== tech) }));
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      image: URL.createObjectURL(file),
    }));
  };

  const handleReorder = (next: Project[]) => {
    setReorderIds(next.map((project) => project.id));
  };

  const saveOrder = () => {
    const ids = displayProjects.map((project) => project.id);
    reorderMutation.mutate(ids);
  };

  const handleToggleReorder = () => {
    setReorderMode((prev) => {
      const next = !prev;
      if (next) {
        setReorderIds(displayProjects.map((project) => project.id));
      } else {
        setReorderIds(null);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            disabled={reorderMode}
          />
          <Select value={filter} onValueChange={setFilter} disabled={reorderMode}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={reorderMode ? "secondary" : "outline"}
            onClick={handleToggleReorder}
          >
            {reorderMode ? "Exit Reorder" : "Reorder"}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenNew}>
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Project" : "Add New Project"}</DialogTitle>
              </DialogHeader>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <Input
                  placeholder="Project title"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
                <Textarea
                  placeholder="Short description"
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
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
                <div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tech (press enter)"
                      value={techInput}
                      onChange={(event) => setTechInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === ",") {
                          event.preventDefault();
                          addTech();
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" onClick={addTech}>
                      Add
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.tech.map((tech) => (
                      <Badge key={tech} className="cursor-pointer" onClick={() => removeTech(tech)}>
                        {tech} x
                      </Badge>
                    ))}
                  </div>
                </div>
                <Input
                  placeholder="Thumbnail URL"
                  value={form.image}
                  onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                />
                <Input type="file" accept="image/*" onChange={handleFile} />
                {form.image ? (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <Image
                      src={form.image}
                      alt="Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
                <Input
                  placeholder="GitHub URL"
                  value={form.github}
                  onChange={(event) => setForm((prev) => ({ ...prev, github: event.target.value }))}
                />
                <Input
                  placeholder="Live demo URL"
                  value={form.demo}
                  onChange={(event) => setForm((prev) => ({ ...prev, demo: event.target.value }))}
                />
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editing ? "Save Changes" : "Create Project"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-16 rounded-xl bg-slate-900/60 animate-pulse" />
            ))}
          </div>
        </Card>
      ) : reorderMode ? (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Drag to reorder</h3>
              <p className="text-sm text-slate-400">Save when you finish reordering projects.</p>
            </div>
            <Button onClick={saveOrder} disabled={reorderMutation.isPending}>
              Save Order
            </Button>
          </div>
          <Reorder.Group axis="y" values={displayProjects} onReorder={handleReorder} className="grid gap-3">
            {displayProjects.map((project) => (
              <Reorder.Item
                key={project.id}
                value={project}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-slate-500" />
                  <Image
                    src={project.thumbnail_url || "/projects/nebula.svg"}
                    alt={project.title}
                    width={64}
                    height={48}
                    className="h-12 w-16 rounded-lg object-cover"
                    unoptimized
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{project.title}</p>
                    <p className="text-xs text-slate-400">{project.category}</p>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Drag</span>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tech Stack</TableHead>
                <TableHead>Links</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Image
                      src={project.thumbnail_url || "/projects/nebula.svg"}
                      alt={project.title}
                      width={64}
                      height={48}
                      className="h-12 w-16 rounded-lg object-cover"
                      unoptimized
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-white">{project.title}</p>
                      <p className="text-xs text-slate-400">{project.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{project.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {(project.tech_stack || []).map((tech) => (
                        <Badge key={tech} variant="default">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-300">
                      {project.github_url ? (
                        <a href={project.github_url} target="_blank" rel="noreferrer" className="hover:text-white">
                          <LinkIcon className="h-4 w-4" />
                        </a>
                      ) : null}
                      {project.live_url ? (
                        <a href={project.live_url} target="_blank" rel="noreferrer" className="hover:text-white">
                          Live
                        </a>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(project)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the project from your portfolio.
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
