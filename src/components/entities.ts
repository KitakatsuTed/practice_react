export interface Product {
  name: string;
  price: number;
}

export interface Cart {
  products: Product[]
  amount: number
}

export interface Notification {
  kind: NotificationKind,
  body: string
}

export enum NotificationKind {
  NOTICE = "notice",
  ALERT = "alert"
}
