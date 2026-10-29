"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button, Text, Grid, HStack, Fieldset, Kbd } from "@chakra-ui/react";
import { LogOut, RotateCcw, Save, TrendingUp } from "lucide-react";

import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

import { toastError, toastLoaded } from "@/component/toast/toast";

import { useEnterNavigation } from "@/component/form/useEnterNavigation";
import { DynamicForm } from "@/component/form/DynamicForm";
import { useCreateRate, useRates, useAllRates } from "../hooks/useRate";
import type { RateForm, Rates } from "../types/rate";
import { RateEntryForm } from "../config/rateEntryFields";

import ShortcutDialog from "@/components/shortcut/ShortcutDialog";
import { useTransactionLoader } from "@/utils/loader/ResolveLoader";
import TransactionLoader from "@/component/loader/Transactionloader";
import { useGlobalKey } from "@/components/key/useGlobalKey";
import { DataTable, createDataTableColumns, type DataTableColumn } from "@/component/table/DataTable";
import { PageContainer, PageHeader, SectionCard, StatusBadge } from "@/components/primitives";
import { formatCurrency } from "@/utils/format/number";
import { displayText } from "@/utils/text/text";

const rateHelper = createDataTableColumns<Rates>();
const rupees = (value: unknown) => formatCurrency(value as number, { fallback: "—" });

const rateColumns: DataTableColumn<Rates>[] = [
    rateHelper.display({ id: "sno", header: "Sno", cell: ({ row }) => row.index + 1 }),
    rateHelper.accessor((r) => r["GOLD 100.00"], { id: "gold100", header: "Gold 24K", meta: { align: "end" }, cell: ({ getValue }) => rupees(getValue()) }),
    rateHelper.accessor((r) => r["GOLD 916.00"], { id: "gold916", header: "Gold 916", meta: { align: "end" }, cell: ({ getValue }) => rupees(getValue()) }),
    rateHelper.accessor((r) => r["SILVER 100.00"], { id: "silver100", header: "Silver 100", meta: { align: "end" }, cell: ({ getValue }) => rupees(getValue()) }),
    rateHelper.accessor((r) => r["SILVER 916.00"], { id: "silver916", header: "Silver 916", meta: { align: "end" }, cell: ({ getValue }) => rupees(getValue()) }),
    rateHelper.accessor((r) => r.LAST_UPDATED, { id: "updated", header: "Updated", meta: { align: "center" }, cell: ({ getValue }) => displayText(getValue() as string) }),
];


function RateEntry() {

    const router = useRouter();
    const { isOpen, status, title: loaderTitle, description, openLoader, resolveLoader, closeLoader } = useTransactionLoader();
    /* -------------------- API HOOKS -------------------- */

    const { mutate: createRate, isPending } = useCreateRate();




    const { data: AllRates } = useAllRates();
    console.log(AllRates,'AllRate')


    // const { mutate: updateCompany } = useUpdateCompany();

    /* -------------------- FORM STATE -------------------- */
    const [form, setForm] = useState<RateForm>({
        "GOLD 100": "",
        "GOLD 916": "",
        "SILVER 100": "",
        "SILVER 916": "",
    });


    const [errors, setErrors] = useState<Record<string, string>>({});


    /* -------------------- HANDLERS -------------------- */
    const handleChange = (field: any, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setForm({
            "GOLD 100": "",
            "GOLD 916": "",
            "SILVER 100": "",
            "SILVER 916": "",
        });
        focusFirst();
        setErrors({});
    };


    const validateField = (field: string, value: any): string | undefined => {
        switch (field) {
            case 'GOLD 100':
                if (!value) return "Gold 24K rate is required";
                break;
            case 'GOLD 916':
                if (!value) return "Gold 916 rate  is required";
                break;
            // case 'SILVER 100':
            //     if (!value) return "Silv is required";
            //     break;
        }
        return undefined;
    };


    // Validate all fields
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        rateFormFields.forEach(field => {
            if (field.required) {
                const error = validateField(field.name, form[field.name as keyof RateForm]);
                if (error) newErrors[field.name] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };




    const handleSave = () => {
        // Validation
        if (!validateForm()) {
            toastError("Please fix the errors in the form");
            return;
        }
        const payload = {
            "GOLD 100": Number(form["GOLD 100"]),
            "GOLD 916": Number(form["GOLD 916"]),
            "SILVER 100": Number(form["SILVER 100"]),
            "SILVER 916": Number(form["SILVER 916"]),
        }
        openLoader('save', true)

        createRate(payload, {
            onSuccess: () => {
                toastLoaded("Rate Created Successfully");
                resetForm();
                resolveLoader("success", "save", "", true)
            },
            onError: () => {
                resolveLoader("error", "save", "Failed to create rate", true)
            }

        });

    }
    const rateHistory = useMemo(() => AllRates ?? [], [AllRates]);

    /* -------------------- EXPORT -------------------- */
    // const handleExport = (option: string) => {
    //     setData(AllRates);
    //     setColumns([
    //         { key: "COMPANYID", label: "Company Id" },
    //         { key: "COMPANYNAME", label: "Company Name" },
    //         { key: 'ACTIVE', label: 'Active' },
    //     ]);
    //     setShowSno(true);
    //     title?.("Rate Master");
    //     router.push(`/print?export=${option}`);
    // };


    /* -------------------- FORM CONFIG -------------------- */
    const rateFormFields = RateEntryForm();
    const fieldSequence = rateFormFields.map(f => f.name);

    const { register, focusNext, focusFirst } = useEnterNavigation(fieldSequence, () => {
        handleSave();
    });
    useEffect(() => {
        focusFirst();
    }, []);
    useGlobalKey("Alt+s", () => handleSave(), "saveTransaction");
    useGlobalKey("Alt+r", () => resetForm(), "Reset");
    useGlobalKey("Alt+e", () => router.back(), "exit");
    useGlobalKey("Alt+u", () => handleSave(), "update");

    /* -------------------- UI -------------------- */
    return (
        <PageContainer size="wide">
            <TransactionLoader
                isOpen={isOpen}
                status={status}
                title={loaderTitle}
                description={description}
                onClose={closeLoader}
            />
            <Toaster />
            <ShortcutDialog />

            <PageHeader
                breadcrumbs={[{ label: "Rate Entry" }, { label: "Gold Rate" }]}
                title="Rate Entry"
                description="Enter today's metal rates per gram. The latest entry is used by purchase, sales and approval screens."
                meta={<StatusBadge tone="brand">{rateHistory.length} entries</StatusBadge>}
            />

            <Grid templateColumns={{ base: "1fr", lg: "minmax(300px, 380px) 1fr" }} gap={4} alignItems="start">
                <SectionCard
                    icon={<TrendingUp />}
                    title="New rate"
                    description="Rates per gram in rupees"
                    footer={
                        <HStack w="full" justify="space-between" gap={2} flexWrap="wrap">
                            <HStack gap={1} color="fg.subtle" textStyle="helper" display={{ base: "none", sm: "flex" }}>
                                <Kbd size="sm">Alt</Kbd>+<Kbd size="sm">S</Kbd>
                                <Text as="span" mr={2}>save</Text>
                                <Kbd size="sm">Alt</Kbd>+<Kbd size="sm">R</Kbd>
                                <Text as="span">reset</Text>
                            </HStack>
                            <HStack gap={2} ml="auto">
                                <Button size="sm" variant="ghost" onClick={() => router.back()}>
                                    <LogOut /> Exit
                                </Button>
                                <Button size="sm" variant="outline" onClick={resetForm}>
                                    <RotateCcw /> Reset
                                </Button>
                                <Button size="sm" colorPalette="brand" loading={isPending} loadingText="Saving" onClick={handleSave}>
                                    <Save /> Save
                                </Button>
                            </HStack>
                        </HStack>
                    }
                >
                    <Fieldset.Root size="sm" width="100%">
                        <Fieldset.Content mt={0}>
                            <DynamicForm
                                fields={rateFormFields}
                                formData={form}
                                onChange={handleChange}
                                register={register}
                                focusNext={focusNext}
                                errors={errors}
                                layout="verticalCombine"
                                gap={3}
                            />
                        </Fieldset.Content>
                    </Fieldset.Root>
                </SectionCard>

                <SectionCard title="Rate history" description="Previous rate entries">
                    <DataTable<Rates>
                        columns={rateColumns}
                        data={rateHistory}
                        size="sm"
                        rowIdKey="LAST_UPDATED"
                        emptyText="No previous rates available"
                        pagination={{ enabled: true, pageSize: 10 }}
                        maxHeight="none"
                    />
                </SectionCard>
            </Grid>
        </PageContainer>
    );
}

export default RateEntry;
