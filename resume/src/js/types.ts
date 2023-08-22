export interface Address {
  number: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface Place {
  address: Address;
  logo?: string;
  name: string;
  website?: string;
}
