"use client";

import { ReactNode } from "react";
import { Field, type FieldRootProps } from "@chakra-ui/react";

type FormFieldProps = Omit<FieldRootProps, "label"> & {
    label: ReactNode;
    helper?: ReactNode;
    /** Error message; also marks the control invalid. */
    error?: ReactNode;
    children: ReactNode;
};

/**
 * Label + control + helper/error, wired for accessibility. Put any Chakra
 * Input / NativeSelect / Textarea inside; the theme handles focus, disabled,
 * read-only and invalid styling.
 */
export function FormField({ label, helper, error, required, children, ...rest }: FormFieldProps) {
    return (
        <Field.Root invalid={!!error} required={required} gap={1.5} {...rest}>
            <Field.Label textStyle="label" color="fg.muted">
                {label}
                <Field.RequiredIndicator color="fg.error" />
            </Field.Label>
            {children}
            {error ? (
                <Field.ErrorText textStyle="helper">{error}</Field.ErrorText>
            ) : (
                helper && <Field.HelperText textStyle="helper" color="fg.subtle">{helper}</Field.HelperText>
            )}
        </Field.Root>
    );
}
