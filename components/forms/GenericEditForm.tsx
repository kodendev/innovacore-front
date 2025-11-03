import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType, ZodTypeAny } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type RenderFieldsProps<T> = {
  form: UseFormReturn<T>;
};

type GenericFormDialogProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  schema?: ZodType<T, ZodTypeAny>;
  defaultValues?: Partial<T>;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: (values: T) => Promise<void> | void;
  // render prop: recibe el form api para custom fields (register, control, errors...)
  renderFields?: (props: RenderFieldsProps<T>) => React.ReactNode;
  // alternatively you can pass children which receive form via context — but renderFields is explicit
};

export function GenericFormDialog<T = any>({
  open,
  onOpenChange,
  title,
  description,
  schema,
  defaultValues,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  onSubmit,
  renderFields,
}: GenericFormDialogProps<T>) {
  const methods = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: defaultValues as any,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onOpenChange(false);
    // reset form (optional: keep values if you need)
    reset(defaultValues as any);
  };

  const submitHandler = async (values: T) => {
    await onSubmit(values);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 p-4">
          {renderFields ? renderFields({ form: methods }) : null}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
