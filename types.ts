/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  images?: string[];
  listItems?: string[];
  intro?: string;
  thrillSection?: {
    title: string;
    subtitle?: string;
    items: string[];
    videoLink?: {
      text: string;
      url: string;
    };
  };
  exclusions?: {
    title: string;
    items: string[];
  };
  pricing?: {
    title: string;
    packages: {
      name: string;
      price: string;
    }[];
    customText?: string;
    paymentTerms?: string;
  };
  day: string;
  description: string;
}

export enum Section {
  HERO = 'hero',
  LINEUP = 'lineup',
  EXPERIENCE = 'experience',
  TICKETS = 'tickets',
}
