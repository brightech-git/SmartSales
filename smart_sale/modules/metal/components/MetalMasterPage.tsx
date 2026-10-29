"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Box,
    Button,
    Text,
    Grid,
    HStack,
    Fieldset,
    Kbd,
} from "@chakra-ui/react";
import { Coins, FileSpreadsheet, LogOut, Pencil, Plus, Printer, RefreshCw, RotateCcw, Save } from "lucide-react";

import { useAllMetals, useMetalBySno } from "../hooks/useMetals";
import { useUpdateMetal } from "../hooks/useUpdateMetal";
import { useCreateMetal } from "../hooks/useCreateMetal";
import type { Metal } from "../types/metal";
import { toastError } from '@/component/toast/toast'
import { Toaster } from "@/components/ui/toaster";

import { DataTable, createDataTableColumns, type DataTableColumn } from "@/component/table/DataTable";
import { CapitalizedInput } from "@/components/ui/CapitalizedInput";
import { usePrint } from "@/context/print/usePrintContext";
import { useRouter } from "next/navigation";
import { usePureGoldData } from "@/hooks/apiHooks/pureGoldMast/usePureGoldMastData";
import { useSoftControlById } from "@/hooks/apiHooks/softControl/useSoftControl";

import { metalMasterFields } from "../config/metalMasterFields";
import { useEnterNavigation } from "@/component/form/useEnterNavigation";
import { DynamicForm } from "@/component/form/DynamicForm";

import { useGlobalKey } from "@/components/key/useGlobalKey";
import ShortcutDialog from "@/components/shortcut/ShortcutDialog";
import { useTransactionLoader } from "@/utils/loader/ResolveLoader";
import TransactionLoader from "@/component/loader/Transactionloader";

import type { PrintColumn } from "@/component/screens/PrintPreviewScreen";
import {
    ActiveBadge,
    FilterBar,
    IconAction,
    PageContainer,
    PageHeader,
    SectionCard,
    StatusBadge,
} from "@/components/primitives";

/** "METAL NAME" → "Metal name" for form labels. */
const toSentenceCase = (label: string) => label.charAt(0) + label.slice(1).toLowerCase();

const metalHelper = createDataTableColumns<Metal>();

function MetalMaster() {
    const router = useRouter();
    const {isOpen, status, title:loaderTitle, description, openLoader, resolveLoader, closeLoader} = useTransactionLoader();
    const { data: showEditIcon } = useSoftControlById('EDIT_ICON');
    const showEditIcons = showEditIcon?.CTLTEXT === "Y";

    // Create refs for each input field
    const metalIdRef = useRef<HTMLInputElement>(null);
    const metalNameRef = useRef<HTMLInputElement>(null);
    const displayOrderRef = useRef<HTMLInputElement>(null);
    const activeRef = useRef<HTMLSelectElement>(null);
    const saveButtonRef = useRef<HTMLButtonElement>(null);

    // Form state
    const [form, setForm] = useState<Partial<Metal>>({
        metalId: "",
        metalName: "",
        metalType: "M",
        displayOrder: 1,
        active: "Y",
        weight: "",
        touch: "",
        pure: ""
    });

    const activeStatus = [

        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
    ]
    const getFormFields = metalMasterFields({ active: activeStatus }).map((f) => ({
        ...f,
        label: toSentenceCase(f.label),
        maxWidth: undefined,
    }))
    const [metalIdManuallyChanged, setMetalIdManuallyChanged] = useState(false);

    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [highlightId, setHighLightedId] = useState<String>();
    const [pureGoldCollection, setPureGoldCollection] = useState<any[]>([]);

    const { data: metals = [], refetch: refetchMetals, isFetching: metalsFetching } = useAllMetals();
    const [filter, setFilter] = useState<string>('')
    const [search, setSearch] = useState("");
    const filteredMetals = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return metals;
        return metals.filter((m: Metal) =>
            [m.metalId, m.metalName].some((v) => String(v ?? "").toLowerCase().includes(q))
        );
    }, [metals, search]);
    const { data: pureGold } = usePureGoldData(filter);

    // Function to move to next field on Enter
    const moveToNextField = (nextRef: React.RefObject<any>) => {
        if (nextRef?.current) {
            nextRef.current.focus();
            if (nextRef.current.select) {
                nextRef.current.select();
            }
        }
    };

    useEffect(() => {
        if (!pureGold?.length) return;

        const mapped = pureGold.map((p: any) => ({
            label: p.pureGoldName,
            value: String(p.sno),
        }));

        setPureGoldCollection(mapped);
    }, [pureGold]);

    useEffect(() => {
        if (!metals || metals.length === 0) return;

        setForm(prev => ({
            ...prev,
            displayOrder: metals.length + 1,
        }));
    }, [metals]);

    const { data: metalBySno, refetch: refetchMetalBySno } = useMetalBySno(editId);

    const { setData, setColumns, setShowSno, title } = usePrint();

    const createMutation = useCreateMetal();
    const updateMutation = useUpdateMetal();




    const handleChange = (field: keyof Metal, value: any) => {
        setForm((prev) => {
            let updated = { ...prev, [field]: value };

            // 🔹 If user edits metalId manually → stop auto-sync
            if (field === "metalId") {
                setMetalIdManuallyChanged(true);
            }

            // 🔹 Auto-fill metalId from metalName (only if not manually changed & not edit mode)
            if (field === "metalName" && !metalIdManuallyChanged && !isEdit) {
                if (value && value.trim().length > 0) {
                    updated.metalId = value.trim().charAt(0).toUpperCase();
                } else {
                    updated.metalId = "";
                }
            }

            return updated;
        });
    };

    useEffect(() => {
        if (!highlightId) return;

        const timer = setTimeout(() => {
            setHighLightedId(undefined);
        }, 3000);

        return () => clearTimeout(timer);
    }, [highlightId]);

    const handleSave = () => {
        if (!form.metalId) {
            toastError("Metal ID is required");
            metalIdRef.current?.focus();
            return;
        }

        if (!form.metalName?.trim()) {
            toastError("Metal name is required");
            metalNameRef.current?.focus();
            return;
        }

        if (isEdit && form.metalId) {
            openLoader('update', true)
            updateMutation.mutate(
                { sno: Number(form.sno), metal: form as Metal },
                {
                    onSuccess: () => {
                        setHighLightedId(String(form.sno))
                        resetForm();
                        resolveLoader("success", "update", "", true)
                    }
                    ,
                    onError: () => {
                        resetForm();
                      resolveLoader("error", "update", "", true)
                    }
                }
            );
        } else {
            openLoader('save', true)
            createMutation.mutate(form as Metal, {
                onSuccess: () => {
                    resetForm();
                    setHighLightedId(String(form.metalId));
                    resolveLoader("success", "save", "", true)
                },
                onError :() => {
                    resolveLoader("error", "save", "", true)
                }
            });
        }
    };

    const handleEdit = (metal: Metal) => {
        setIsEdit(true);
        setEditId(metal.sno || null);
        refetchMetalBySno();
    };

    useEffect(() => {
        if (metalBySno?.data && Object.keys(metalBySno?.data).length > 0) {
            setForm({
                ...metalBySno?.data,
                metalType: metalBySno?.data?.metalType || "",
            });
        }
    }, [metalBySno]);

    const resetForm = () => {
        setIsEdit(false);
        setMetalIdManuallyChanged(false);

        setForm({
            metalId: "",
            metalName: "",
            metalType: "M",
            displayOrder: Number(metals.length + 1),
            active: "Y",
            weight: "",
            touch: "",
            pure: ""
        });

        setEditId(null);
        // Focus to Metal Name after save
        setTimeout(() => metalNameRef.current?.focus(), 100); // ← Changed to metalNameRef
    };

    const metalColumns = useMemo(() => {
        const cols: DataTableColumn<Metal>[] = [
            metalHelper.accessor("sno", { header: "Sno" }),
            metalHelper.accessor("metalId", { header: "Metal Id" }),
            metalHelper.accessor("metalName", { header: "Metal Name" }),
            metalHelper.accessor("displayOrder", { header: "Order", meta: { align: "center" } }),
            metalHelper.accessor("active", {
                header: "Status",
                meta: { align: "center" },
                cell: ({ getValue }) => <ActiveBadge value={getValue() as string} />,
            }),
        ];

        if (showEditIcons) {
            cols.push(
                metalHelper.display({
                    id: "actions",
                    header: "Action",
                    meta: { align: "center" },
                    cell: ({ row }) => (
                        <Box display="flex" justifyContent="center">
                            <IconAction
                                label={`Edit ${row.original.metalName ?? "metal"}`}
                                icon={<Pencil />}
                                size="xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(row.original);
                                }}
                            />
                        </Box>
                    ),
                })
            );
        }

        return cols;
    }, [showEditIcons]);

    const handleExport = (option: string) => {
        setData(metals);
        setColumns([
            { key: 'metalId', label: 'Metal Id' },
            { key: 'metalName', label: 'Metal Name' },
            { key: 'displayOrder', label: 'Order' },
        ]);
        setShowSno(true);
        router.push(`/print?export=${option}`);
        title?.("Metal List")
    };

    const formFieldName = getFormFields.map(f => f.name);

    const { register, focusFirst, focusNext } = useEnterNavigation(formFieldName, () => {
        handleSave
    });
    useEffect(() => {
        focusFirst()
    }, []);

    useGlobalKey("Alt+s" , ()=>handleSave() , "saveTransaction");
    useGlobalKey("Alt+r", () => resetForm() ,"Reset");
    useGlobalKey("Alt+e", () => router.back(), "exit");
    useGlobalKey("Alt+u", ()=>handleSave(), "update");

    const isSaving = createMutation.isPending || updateMutation.isPending;

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
                breadcrumbs={[{ label: "Master" }, { label: "Item" }, { label: "Metal Master" }]}
                title="Metal Master"
                description="Define the metals you trade and the order they appear in across entry screens and reports."
                meta={<StatusBadge tone="brand">{metals.length} metals</StatusBadge>}
                actions={
                    <Button size="sm" variant="outline" onClick={resetForm}>
                        <Plus /> New metal
                    </Button>
                }
            />

            <Grid templateColumns={{ base: "1fr", lg: "minmax(300px, 380px) 1fr" }} gap={4} alignItems="start">
                {/* Form */}
                <SectionCard
                    icon={<Coins />}
                    title={isEdit ? "Edit metal" : "New metal"}
                    description={isEdit ? `Editing ${form.metalName || "metal"}` : "The ID is filled from the first letter of the name"}
                    bg={isEdit ? "bg.highlight" : undefined}
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
                                <Button
                                    size="sm"
                                    colorPalette="brand"
                                    onClick={handleSave}
                                    ref={saveButtonRef}
                                    loading={isSaving}
                                    loadingText={isEdit ? "Updating" : "Saving"}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSave();
                                        }
                                    }}
                                >
                                    <Save /> {isEdit ? "Update" : "Save"}
                                </Button>
                            </HStack>
                        </HStack>
                    }
                >
                    <Fieldset.Root size="sm" width="100%">
                        <Fieldset.Content mt={0}>
                            <DynamicForm
                                fields={getFormFields}
                                formData={form}
                                onChange={handleChange}
                                register={register}
                                focusNext={focusNext}
                                layout="verticalCombine"
                                appearance="themed"
                                gap={3}
                            />
                        </Fieldset.Content>
                    </Fieldset.Root>
                </SectionCard>

                {/* List */}
                <SectionCard
                    title="Metals"
                    description="Select a row to edit it"
                    actions={
                        <>
                            <IconAction label="Refresh" icon={<RefreshCw />} onClick={() => refetchMetals()} loading={metalsFetching} />
                            <IconAction label="Export to Excel" icon={<FileSpreadsheet />} onClick={() => handleExport("excel")} />
                            <IconAction label="Print / PDF" icon={<Printer />} onClick={() => handleExport("pdf")} />
                        </>
                    }
                >
                    <FilterBar
                        search={{ value: search, onChange: setSearch, placeholder: "Search by ID or name" }}
                        resultText={search ? `${filteredMetals.length} of ${metals.length}` : undefined}
                    />
                    <DataTable<Metal>
                        variant="themed"
                        columns={metalColumns}
                        data={filteredMetals}
                        size="sm"
                        rowIdKey="sno"
                        editingRowId={editId ?? (highlightId != null ? String(highlightId) : null)}
                        emptyText={search ? "No metals match your search" : "No metals yet"}
                        onRowClick={(metal) => handleEdit(metal)}
                        pagination={{ enabled: true, pageSize: 10 }}
                        maxHeight="none"
                    />
                </SectionCard>
            </Grid>
        </PageContainer>
    );
}

export default MetalMaster;