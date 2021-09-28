export class MetaData {
    total: number;
    page: number;
    page_count: number;
}

export class RecommendationResponse {
    statusCode: number;
    message: string;
    recommendations: Recommendation[];
    meta_data: MetaData;
}
export class Recommendation {
    id: number;
    client_id: number;
    email: string;
    client_name: string;
    phone_number: number;
    product_line_id: number
    brand_name: string;
    product_id: number;
    product_name: string;
    notes: string;
}
export class RecommendationDetails {

    id?: number
    client_name: string;
    email: string;
    product_img_s3_key_id: string;
    phone_number: number;
    master_product_line_id: number;
    product_id: number;
    notes: string;

}

export class ProductList {
    id: number;
    product_name: string;
}

export class RecommendationFilterResponse {
    statusCode: number;
    message: string;
    products: ProductList[];
}
export class GetRecommendationDetailsResponse {
    statusCode: 200;
    message: string;
    recommendation: GetRecommendationDetails
}
export class GetRecommendationDetails {
    id: number;
    salon_id: number;
    client_id: number;
    email: string;
    phone_number: string;
    client_name: string;
    product_line_id: string;
    master_product_line_id: string;
    product_type_id: string;
    product_type_name: string;
    brand_name: string;
    brand_id: number;
    product_id: number;
    product_name: string;
    notes: string;
    created_by: number;
    recommendation_for: string;
    services: any;
    products: any;
    preferred_ritual: any;
}

export class RecommendationDropDownsResponse {
    statusCode: number;
    product_lines: RecommendationProductLinesArray[];
}
export class RecommendationProductLinesArray {
    brand_name: string;
    product_lines: RecommendationProductTypesList[];
}
export class RecommendationProductTypesList {
    product_line_id: number;
    product_line_name: string;
    product_types: RecommendationProductTypes[];
}
export class RecommendationProductTypes {
    master_product_line_id: number;
    product_type_id: number;
    product_type_name: string
}
export class RecommendationProductDetails {
    client_name: number;
    email: string;
    phone_number: number
    master_product_line_id: number;
    client_id: number;
    notes: string;
    product_id: number;
    brand_id: number;
    service_type: string;
    service_id: number;
    recommendation_for: string;
    preferred_ritual: any;
    product_frequency_id: any;
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

export class ActiveServicesResponse {
    statusCode: number;
    message: string;
    services: ActiveServices[];
}

export class ActiveServices {
    service_type: string;
    services: Services[];
}
export class Services {
    price: number;
    service: string;
    service_id: number;
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

export class ServiceTypesResponse {

    statusCode: number;
    serviceTypes: ServiceTypes[]
}

export class ServiceTypes {
    type_id: number;
    service_type: string;
}

export class RecommendTypes {
    id: string;
    value: string;
}

export class RitualArray {
    id: string;
    value: string;
    isChecked: boolean;
}