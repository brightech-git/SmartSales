"use client";

import { ReactNode } from "react";
import { Button, CloseButton, Flex, HStack, Input, InputGroup, Text } from "@chakra-ui/react";
import { Search, X } from "lucide-react";

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxW?: string;
};

/** Text search with a leading icon and a clear button. */
export function SearchInput({ value, onChange, placeholder = "Search…", maxW = "280px" }: SearchInputProps) {
    return (
        <InputGroup
            maxW={{ base: "full", sm: maxW }}
            flex="1"
            startElement={<Search size={14} aria-hidden />}
            endElement={
                value ? (
                    <CloseButton size="2xs" aria-label="Clear search" onClick={() => onChange("")} me="-1" />
                ) : undefined
            }
        >
            <Input
                size="sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
            />
        </InputGroup>
    );
}

type FilterBarProps = {
    search?: SearchInputProps;
    /** Extra filter controls (selects, date pickers). */
    children?: ReactNode;
    /** e.g. "12 of 40 metals". */
    resultText?: ReactNode;
    /** Shows a "Clear filters" button when provided and active. */
    onClear?: () => void;
    isFiltered?: boolean;
    /** Right-aligned actions such as export buttons. */
    actions?: ReactNode;
};

/** One row above a list: search, filters, result count and list actions. */
export function FilterBar({ search, children, resultText, onClear, isFiltered, actions }: FilterBarProps) {
    return (
        <Flex
            gap={2}
            align={{ base: "stretch", sm: "center" }}
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            mb={3}
        >
            <HStack gap={2} flex="1" flexWrap="wrap" minW={0}>
                {search && <SearchInput {...search} />}
                {children}
                {onClear && isFiltered && (
                    <Button size="xs" variant="ghost" color="fg.muted" onClick={onClear}>
                        <X size={12} aria-hidden /> Clear filters
                    </Button>
                )}
            </HStack>
            <HStack gap={2} justify="flex-end" flexShrink={0}>
                {resultText && (
                    <Text textStyle="helper" color="fg.subtle" whiteSpace="nowrap">
                        {resultText}
                    </Text>
                )}
                {actions}
            </HStack>
        </Flex>
    );
}
