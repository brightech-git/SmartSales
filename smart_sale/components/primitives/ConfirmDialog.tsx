"use client";

import { ReactNode } from "react";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";

type ConfirmDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: ReactNode;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /** "danger" for destructive actions such as delete or log out. */
    tone?: "brand" | "danger";
    loading?: boolean;
};

/** Standard yes/no dialog. */
export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    tone = "brand",
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="sm" role="alertdialog" placement="center">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        {description && (
                            <Dialog.Body>
                                <Dialog.Description textStyle="body" color="fg.muted">
                                    {description}
                                </Dialog.Description>
                            </Dialog.Body>
                        )}
                        <Dialog.Footer gap={2} py={3}>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" size="sm">
                                    {cancelLabel}
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                size="sm"
                                colorPalette={tone === "danger" ? "danger" : "brand"}
                                onClick={onConfirm}
                                loading={loading}
                            >
                                {confirmLabel}
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
