export class DefaultResponse {
    public statusCode: number;
    public message: string;
}

export class MetaData {
    total: number;
    page: number;
    page_count: number;
}
export class SalonDetails {
    id: number;
    name: string;
    email: string;
    salon_logo_thumb_url: null;
    phone_number: string;
    city: string;
    state: string;
    status: string;
}
export class SalonsListResponse {
    statusCode: number;
    salons: SalonDetails[];
    meta_data: MetaData;
    message: string;
}

export class SalonDetailsResponse {
    statusCode: number;
    salon: Salon;
}
export class OwnerInfo {

    phone_number: string;
    salon_owner_name: string;
    email: string;
    status: string;
    quickblox_id: string;
}
export class Salon {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    owners: OwnerInfo[]
    salon_logo_s3_key_id: string;
    salon_logo_thumb_url: string;
    salon_logo_url: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    primary_color: string;
    secondary_color: string;
    status: string;
    latitude: number;
    longitude: number;
    days_from: string;
    days_to: string;
    time_from: string;
    time_to: string;
    quickblox_id: number;
    sup_admin_quickblox_id: string;
    salon_media_key_ids: UrlItem[];
}

export class UrlItem {
    name: string;
    file: File;
    eventFile: File;
    salon_media_key_id: string;
    isEdit: boolean;
    salon_media_url: File;
    type: string;
}

export class SalonMedia {
    type: string;
    salon_media_key_id: string;
    salon_media_url: string;
}

export class Status {
    value: string;
    id: string;
}

export class ProvidersResponse {
    statusCode: number;
    message: string;
    providers: Provider[];
    meta_data: MetaData;
}

export class Provider {
    provider_id: number;
    email: string;
    provider_name: string;
    phone_number: string;
    services: string;
    city: string;
    state: string;
    status: string;
    provider_thumb_url: string;
}

export class ProviderDetailsResponse {
    statusCode: number;
    message: string;
    provider: ProviderDetails;
}

export class ProductDetailsResponse {
    statusCode: number;
    message: string;
    providerDetails: ProviderDetails;
}
export class ProviderDetails {
    id: number;
    email: string;
    name: string;
    profile_pic_s3_key_id: string;
    phone_number: string;
    user_role: string;
    city: string;
    state: string;
    status: string;
    in_office_timings: any;
    provider_pic_thumb_url: string;
    services: ProviderServices[];
    experience: number
}

export class ProviderServices {
    service: string;
    service_name: string;
    service_id: number;
    service_type: string;
    service_type_id: string;
    price: number;
}

export class FrequenciesResponse {
    statusCode: number;
    message: string;
    frequencies: Frequencies[]
}

export class Frequencies {
    id: number;
    day: string;
    isChecked?: boolean;
}

export class InviteClientListResponse {
    statusCode: number;
    message: string;
    invitations: Invitations[];
    meta_data: MetaData;
}

export class Invitations {
    client_email: string;
    invited_by: string;
    updated_date: string;
}