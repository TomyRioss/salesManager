'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeletePipelineModalProps {
  isOpen: boolean
  pipelineName: string
  onClose: () => void
  onConfirm: () => void
}

export function DeletePipelineModal({
  isOpen,
  pipelineName,
  onClose,
  onConfirm,
}: DeletePipelineModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar Pipeline</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que querés eliminar "{pipelineName}"? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
