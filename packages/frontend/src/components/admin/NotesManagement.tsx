"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Calendar,
  FileText,
} from "lucide-react";
// Toast functionality will be implemented with simple alerts for now

interface Note {
  id: number;
  notes: string;
  createdAt: string;
  created_by?: string;
}

interface NotesManagementProps {
  loading?: boolean;
}

const NotesManagement: React.FC<NotesManagementProps> = ({
  loading = false,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editNoteContent, setEditNoteContent] = useState("");

  // Fetch notes from backend
  const fetchNotes = async () => {
    console.log("=== FRONTEND: STARTING FETCH NOTES ===");
    setIsLoading(true);
    try {
      console.log("=== FRONTEND: MAKING REQUEST TO BACKEND ===");
      console.log("Request URL: http://localhost:8080/admin/notes");

      const response = await fetch("http://localhost:8080/admin/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("=== FRONTEND: RESPONSE RECEIVED ===");
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const data = await response.json();
        console.log("=== FRONTEND: BACKEND RESPONSE DATA ===");
        console.log("Full response data:", JSON.stringify(data, null, 2));
        console.log("Notes array:", data.notes);
        console.log("Notes count:", data.notes?.length || 0);
        console.log("Total:", data.total);

        if (data.notes && data.notes.length > 0) {
          console.log(
            "First note structure:",
            JSON.stringify(data.notes[0], null, 2)
          );
        } else {
          console.log("=== FRONTEND: NO NOTES FOUND ===");
          console.log("Notes array is empty or undefined");
        }

        setNotes(data.notes || []);
        console.log("=== FRONTEND: NOTES SET IN STATE ===");
        console.log("State updated with", data.notes?.length || 0, "notes");
      } else {
        console.log("=== FRONTEND: ERROR RESPONSE ===");
        console.error("Failed to fetch notes - Status:", response.status);
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        // Set empty array instead of throwing error to prevent UI crashes
        setNotes([]);
      }
    } catch (error) {
      console.log("=== FRONTEND: FETCH ERROR ===");
      console.error("Error fetching notes:", error);
      // Set empty array instead of throwing error to prevent UI crashes
      setNotes([]);
    } finally {
      setIsLoading(false);
      console.log("=== FRONTEND: FETCH NOTES COMPLETED ===");
    }
  };

  // Create new note
  const createNote = async () => {
    if (!newNoteContent.trim()) {
      alert("Note content cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/admin/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: newNoteContent.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("=== FRONTEND: NOTE CREATED SUCCESSFULLY ===");
        console.log("Created note data:", JSON.stringify(data, null, 2));
        console.log("Created note object:", data.note);
        setNotes([data.note, ...notes]);
        setNewNoteContent("");
        setIsCreateDialogOpen(false);
        alert("Note created successfully");
      } else {
        const errorData = await response.json();
        console.log("=== FRONTEND: NOTE CREATION ERROR ===");
        console.log("Error data:", JSON.stringify(errorData, null, 2));
        alert(errorData.message || "Failed to create note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Error creating note");
    } finally {
      setIsLoading(false);
    }
  };

  // Update note
  const updateNote = async () => {
    if (!editingNote || !editNoteContent.trim()) {
      alert("Note content cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/admin/notes/${editingNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes: editNoteContent.trim() }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotes(
          notes.map((note) => (note.id === editingNote.id ? data.note : note))
        );
        setEditingNote(null);
        setEditNoteContent("");
        setIsEditDialogOpen(false);
        alert("Note updated successfully");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Error updating note");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete note
  const deleteNote = async (noteId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/admin/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== noteId));
        alert("Note deleted successfully");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Error deleting note");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy note to clipboard
  const copyNote = async (noteContent: string) => {
    try {
      await navigator.clipboard.writeText(noteContent);
      alert("Note copied to clipboard");
    } catch (error) {
      console.error("Error copying note:", error);
      alert("Failed to copy note");
    }
  };

  // Open edit dialog
  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setEditNoteContent(note.notes);
    setIsEditDialogOpen(true);
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) =>
    note.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Notes Management</CardTitle>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Note</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>
                  Add a new note to the system. Notes can contain any text
                  content.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your note content..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={6}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={createNote} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Note"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Notes Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      Loading notes...
                    </TableCell>
                  </TableRow>
                ) : filteredNotes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchQuery
                        ? "No notes found matching your search."
                        : "No notes available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={note.notes}>
                          {note.notes}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyNote(note.notes)}
                            title="Copy note"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(note)}
                            title="Edit note"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                title="Delete note"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Note</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this note?
                                  Temporary action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteNote(note.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
              <DialogDescription>
                Modify the content of this note.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your note content..."
                value={editNoteContent}
                onChange={(e) => setEditNoteContent(e.target.value)}
                rows={6}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={updateNote} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Note"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default NotesManagement;
