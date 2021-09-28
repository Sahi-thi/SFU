export class DefaultResponse {
  public statusCode: number;
  public message: string;
}
export class MetaData {
  total: number;
  page: number;
}

export class RewardDetails {
  title: string;
  start_date: string;
  end_date: string;
  status: string;
  reward_for: string;
  id:number;
  service_ids: Array<any>[];
  product_ids: Array<any>[];
  required_points: number;
  percentage: string;
}
export class Reward {
  reward_id: number;
  title: string;
  start_date: string;
  end_date: string;
  required_point: number;
  percentage: string;
  status: string;
}
export class RewardResponse {
  statusCode: number;
  message: string;
  rewards: Reward[];
  meta_data: MetaData;
}
export class GetRewardDetailsResponse {
  statusCode: number;
  message: string;
  reward: GetRewardDetails
}
export class GetRewardDetails {
  reward_id: number;
  title: string;
  start_date: string;
  end_date: string;
  required_point: number;
  percentage: string;
  status: string;
  reward_for:string;
  services:Service[];
  products:Product[];
}
export class Service{
  service_id:number;
  id:number;
price:number;
service:string;
}
export class Product{
  id:number;
  price:number;
  product_name:string;
}