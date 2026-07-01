"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby={description ? "modal-description" : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl",
              className,
            )}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 id="modal-title" className="text-lg font-semibold">
                  {title}
                </h2>
                {description && (
                  <p
                    id="modal-description"
                    className="text-sm text-muted-foreground mt-1"
                  >
                    {description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close dialog"
                className="shrink-0 -mr-2 -mt-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

export function DeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Delete Expense",
  description = "This action cannot be undone. The expense will be permanently removed.",
  loading = false,
}: DeleteModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="flex justify-end gap-3 mt-2">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} loading={loading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
