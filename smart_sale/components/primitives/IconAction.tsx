"use client";

import { forwardRef, ReactNode } from "react";
import { IconButton, type IconButtonProps } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";

type IconActionProps = Omit<IconButtonProps, "aria-label"> & {
    /** Used for both the tooltip and the accessible name. */
    label: string;
    icon: ReactNode;
};

/** Square toolbar button with a tooltip, e.g. Refresh / Export / Print. */
export const IconAction = forwardRef<HTMLButtonElement, IconActionProps>(function IconAction(
    { label, icon, variant = "ghost", size = "sm", ...rest },
    ref
) {
    return (
        <Tooltip content={label} showArrow openDelay={300}>
            <IconButton
                ref={ref}
                aria-label={label}
                variant={variant}
                size={size}
                color="fg.muted"
                _hover={{ bg: "bg.hover", color: "fg" }}
                {...rest}
            >
                {icon}
            </IconButton>
        </Tooltip>
    );
});
