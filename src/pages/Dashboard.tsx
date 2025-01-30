import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext"; // Importing useAuth to handle authentication context
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, LogOut } from "lucide-react"; // Adding the LogOut icon
import { useTheme } from "next-themes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { RecordDialog } from "@/components/RecordDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for routing

interface Record {
  _id: string;
  name: string;
  dob: string;
  age: number;
}

const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { logout } = useAuth(); // Using logout function from AuthContext
  const navigate = useNavigate(); // Initialize navigation hook

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { data: records, isLoading } = useQuery({
    queryKey: ["records"],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch records");
      return response.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: { name: string; dob: string }) => {
      const response = await fetch(`${backendUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add record");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      toast({ title: "Success", description: "Record added successfully" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add record",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; dob: string } }) => {
      const response = await fetch(`${backendUrl}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update record");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      toast({ title: "Success", description: "Record updated successfully" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update record",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${backendUrl}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete record");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      toast({ title: "Success", description: "Record deleted successfully" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    },
  });

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedRecord(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (record: Record) => {
    setDialogMode("edit");
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogSubmit = (data: { name: string; dob: string }) => {
    if (dialogMode === "add") {
      addMutation.mutate(data);
    } else if (dialogMode === "edit" && selectedRecord) {
      updateMutation.mutate({ id: selectedRecord._id, data });
    }
  };

  const handleLogout = () => {
    logout(); // Calling logout from AuthContext
    toast({ title: "Success", description: "Logout successful", variant: "success" }); // Show logout success toast
    navigate('/login'); // Redirecting to login page after logout
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-black">
            Dashboard
          </h1>
          <div className="flex gap-4">
            <Button onClick={handleAdd} className="glass">
              <Plus className="mr-2 h-4 w-4" /> Add New Record
            </Button>
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <Card className="p-6 glass">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records?.map((record: Record) => (
                  <TableRow key={record._id} className="animate-fadeIn">
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{format(new Date(record.dob), "PP")}</TableCell>
                    <TableCell>{record.age}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(record)}
                          className="glass"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(record._id)}
                          className="glass"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <RecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        initialData={selectedRecord}
        mode={dialogMode}
      />
    </div>
  );
};

export default Dashboard;
