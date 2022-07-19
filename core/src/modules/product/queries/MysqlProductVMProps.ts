export interface MysqlProductVMProps {
  id: string;

  sku: string;
  name: string;
  price: number;
  quantity: number;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
