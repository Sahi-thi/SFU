export class DefaultResponse {
    public statusCode: number;
    public message: string;
}
export class MetaData {
    total: number;
    page: number;
    page_count: number;
}

// products 
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
    ingredient_ids: IngredientsDropDown[];
    ingredients: IngredientsDropDown[];
}

// Add Products Info DropDown
export class ProductDropDownsResponse {
    statusCode: number;
    data: ProductsDropDownData;
}
export class ProductsDropDownData {
    skin_types: SkinTypesDropDown[];
    skin_concerns: SkinConcernsDropDown[];
    ingredients: IngredientsDropDown[];
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
    name: string
    ingredient: string
}

export class addBrandFormData {
    brand_name: string;

}

export class ServiceDetailsForm {
    service_type: string;
    service: string;
    price: string;
    description: string;
}