import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface RecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; dob: string }) => void;
  initialData?: { name: string; dob: string } | null;
  mode: "add" | "edit";
}

export function RecordDialog({ isOpen, onClose, onSubmit, initialData, mode }: RecordDialogProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [dob, setDob] = useState(initialData?.dob ? format(new Date(initialData.dob), "yyyy-MM-dd") : "");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ name, dob });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Record" : "Edit Record"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="glass"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="dob" className="text-sm font-medium">Date of Birth</label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="glass"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{mode === "add" ? "Add" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}