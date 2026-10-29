export interface Metal {
    sno?:number;
    metalId: string;
    metalName: string;
    userId?: number;
    updated?: string;
    uptime?: string;
    autoGenerator?: string;
    metalType?: string;
    active?: string;
    displayOrder?: number;
    weight?:string;
    touch?:string;
    pure?:string
}

export interface MetalData {
    status: string;
    message:string;
    data: Metal;
}
