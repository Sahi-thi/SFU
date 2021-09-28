export class DefaultResponse {
    public statusCode: number;
    public message: string;
}
export class ClientsResponse {
    statusCode: number;
    clients: Clients[];
    meta_data: MetaData;
    message: string;
}

export class Clients {
    client_id: number;
    email: string;
    name: string;
    phone_number: string;
    status: string;
    profile_pic_thumb_url: string;
    created_date: string;
}

export class ClientInfoResponse {
    statusCode: number;
    information: ClientInformation;
    message: string
}

export class ClientInformation {
    client_id: number;
    email: string;
    name: string;
    phone_number: string;
    status: string;
    profile_pic_thumb_url: string;
    profile_pic_url: string;
    question_answer: QuestionAnswer[]
    productNotToUseOnSkin: ProductNotToUseOnSkin[];
}
export class ProductNotToUseOnSkin {
    brand_name: string;
    total_count: string;
    products: string;
}
export class QuestionAnswer {
    question_id: number
    question: string;
    options: QuestionOptions[]
}

export class QuestionOptions {
    option: string
    option_id: number
    other_text: string
}
export class MetaData {
    total: number;
    page: number;
    page_count: number;
}
export class ServiceDropdownResponse {
    statusCode: number;
    message: string;
    serviceTypes: ServiceTypes[];
}

export class ServiceTypes {
    service_type: string;
    type_id: number;
}

export class RitualOverViewRequest {
    date: string
}

export class RitualOVerViewResponse {
    statusCode: number;
    data: RitualData;
}
export class RitualData {
    id: number;
    rituals: RitualsDetails[];
}
export class RitualsDetails {
    ritual_type: string;
    percentage: number;
}

export class RoutineDetailsRequest {
    date: string;
    ritual_type: string
}

export class RitualDetailsResponse {
    statusCode: number;
    data: RitualDetails;
}
export class RitualDetails {
    ritual_id: number;
    skin_feel: string;
    note: string;
    selfie_urls: SelfieUrls[];
    more_ritual_info: MoreRitualInfo[]
    ritual_products: RitualProducts[]
}
export class SelfieUrls {
    ritual_media_key_id: string;
    ritual_media_thumb_url: string;
    ritual_media_pic_url: string;
    type: string;
}
export class MoreRitualInfo {
    ritual_info_id: number;
    ritual_info_name: string;
    is_applied: number;
}
export class RitualProducts {
    category_name: string;
    products: RitualProductDetails[]
}
export class RitualProductDetails {
    is_applied: number;
    product_id: number;
    expiry_date: string;
    product_name: string;
    product_brand: string;
    product_img_thumb_url: string;
}
export class FormsDetails {
    appointment_id: number
    form_name: string
    form_url: string
    id: number
    pdf_url: string
    status: string
    updated_date: string
}
export class SalonLinkedDetail {
    id: number;
    email: string;
    name: string;
    phone_number: number;
    city: string;
    state: string;
    address: string;
    salon_thumb_logo_url: string;
    status: string;
}