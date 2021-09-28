
export class DefaultResponse {
    public statusCode: number;
    public message: string;
}
export class MetaData {
    total: number;
    page: number;
    page_count: number;
}
export class ServicesResponse {
    statusCode: number;
    services: Services[];
    meta_data: MetaData;
    message: string;
}

export class Services {
    service_id: number;
    type_id: number;
    service_type: string;
    service: string;
    price: string;
    description: string;
}

export class ServiceDetailsForm {
    service_type: string;
    service: string;
    price: string;
    description: string;
}