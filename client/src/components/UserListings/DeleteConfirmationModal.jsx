
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  
  export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, carTitle }) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the car "{carTitle}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  
  