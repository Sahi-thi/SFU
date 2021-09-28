export class DefaultResponse {
    public statusCode: number;
    public message: string;
}
export class StatesResponse {
    public statusCode: number;
    public states: States[];
}
export class States {
    state_id: number;
    state_name: string;
}
export class MenuList {
    name: string;
    routerLink?: string;
}
export class MetaData {
    total: number;
    page: number;
    page_count: number;
}
export class Status {
    value: string;
    id: string;
}

export class DaysStatus {
    value: string;
    id: number;
}

export class Item {
    name: string;
    file: File;
    uploadFileName: string;
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
    question_answer: QuestionAnswer[];
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

export class ServiceDropdownResponse {
    statusCode: number;
    message: string;
    serviceTypes: ServiceTypes[];
}

export class ServiceTypes {
    service_type: string;
    type_id: number;
    services: ServicesList[];
}

export class ServicesList {
    service: string;
    service_id: number;
    price: number;
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
export class ServicesResponse {
    statusCode: number;
    services: Services[];
    meta_data: MetaData;
    message: string;
}

export class ActiveServicesData {
    statusCode: number;
    message: string;
    services: ServicesData[];
}

export class ServicesData {
    service_type: string;
    services: ServiceDataList[];
    salon_services: ServiceDataList[];
}

export class ServiceDataList {
    price?: string;
    max_price?: string;
    min_price?: string;
    service: string;
    service_name: string;
    service_id: number
}

export class Services {
    service_id: number;
    type_id: number;
    service_type: string;
    service: string;
    max_price: string;
    min_price: string;
    description: string;
    forms_required: RequiredForms;
}
export class RequiredForms {
    is_facial: number;
    is_waxing: number;
}

export class ServiceDetailsResponse {
    statusCode: number;
    services: Services;
}

export class ServiceDetailsForm {
    service_type: string;
    service: string;
    max_price: string;
    min_price: string;
    description: string;
}
export class BrandListResponse {
    statusCode: number;
    brands: Brands[];
    meta_data: MetaData;
}
export class Brands {
    id: number;
    company_name: string;
    brand_name: string;
    product_line_id: number;
    product_line_name: string;
    product_type_id: number;
    product_type_name: string;
    is_added: number;
}

export class addBrandFormData {
    company_name: string;
    product_line_id: number;
    product_type_id: number;
}

export class ProductLineDropDownsResponse {
    statusCode: number;
    data: DropDownData;
}
export class DropDownData {
    product_lines: ProductLinesDropDown[];
    product_types: ProductTypesDropDown[];
}
export class ProductLinesDropDown {
    product_line_id: number
    name: string
}
export class ProductTypesDropDown {
    product_type_id: number
    name: string
}

export class ProductDropDownsResponse {
    statusCode: number;
    data: ProductsDropDownData;
}
export class ProductsDropDownData {
    skin_types: SkinTypesDropDown[];
    skin_concerns: SkinConcernsDropDown[];
    ingredients: IngredientsDropDown[];
    products_not_to_use_on_skin: ProductsNotToUseOnSkin[]
}
export class ProductsNotToUseOnSkin {
    concern: string
    concern_id: string
}
export class SkinConcernsDropDown {
    skin_concern_id: number
    name: string
    skin_concern: string
}
export class SkinTypesDropDown {
    skin_type_id: number
    name: string
    skin_type: string
}
export class IngredientsDropDown {
    ingredient_id: number
    id: number
    name: string
    ingredient: string
}
export class GetProductLineData {
    statusCode: number;
    product_line: Brands;
}

export class ProductDetails {
    id?: number;
    is_added: number;
    product_name: string;
    product_pic_thumb_url: string;
    product_img_s3_key_id: string;
    price: string;
    notes: string;
    skin_type_ids: SkinTypesDropDown[];
    skin_types: SkinTypesDropDown[];
    skin_concern_ids: SkinConcernsDropDown[];
    skin_concerns: SkinConcernsDropDown[];
    allergies: ProductsNotToUseOnSkin[];
    allergy_ids: ProductsNotToUseOnSkin[];
    product_not_to_use_on_skin: ProductsNotToUseOnSkin[];
    ingredient_ids: IngredientsDropDown[];
    ingredients: IngredientsDropDown[];
    product_type_id: number;
    expires_in: string;
}

export class ProductsResponse {
    statusCode: number;
    product: ProductDetails[];
    meta_data: MetaData;
}

export class ProductList {
    id: number;
    product_name: string;
}

export class Company {
    company_name: string;
}
export class Products {
    id: number;
    product_name: number;
    product_pic_thumb_url: string;
    price: number;
    notes: number
}
export class appointmentStatus {
    id: string;
    name: string;
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