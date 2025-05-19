export interface IAddress {
    _id: string;
    userId: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    postalCode:string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  