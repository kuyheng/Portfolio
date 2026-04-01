"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Trash2 } from "lucide-react";

import { contactService } from "@/lib/services/contactService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: contactService.getMessages,
  });

  const markReadMutation = useMutation({
    mutationFn: contactService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Message marked as read");
    },
    onError: () => toast.error("Failed to mark message"),
  });

  const deleteMutation = useMutation({
    mutationFn: contactService.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Message deleted");
    },
    onError: () => toast.error("Failed to delete message"),
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Messages</h2>
          <p className="text-sm text-slate-400">See what visitors send from the portfolio.</p>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {messages.length} total
        </span>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-16 rounded-xl bg-slate-900/60 animate-pulse" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
            No messages yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(messages as ContactMessage[]).map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium text-white">{message.name}</TableCell>
                  <TableCell className="text-slate-300">{message.email}</TableCell>
                  <TableCell className="max-w-md text-slate-300">{message.message}</TableCell>
                  <TableCell>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {message.is_read ? "Read" : "New"}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {new Date(message.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!message.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markReadMutation.mutate(message.id)}
                          title="Mark as read"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(message.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
}
