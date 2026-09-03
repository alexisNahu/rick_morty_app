import {z} from 'zod';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[]; // Lista de URLs de los episodios
  url: string;       // URL del propio personaje
  created: string;   // Fecha de creación en la base de datos
}

export const APIS = {
  RICK_MORTY: {
    CHARACTERS: 'https://rickandmortyapi.com/api/character',
    LOCATIONS: 'https://rickandmortyapi.com/api/location'
  },
  BACKEND: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      ME: '/auth/me'
    }
  }
}

export interface FilterResponse<T> {
  info: {
    count: number,
    pages: number,
    next: string | null,
    prev: string | null
  },
  results: T[]
}

export const CharactersFilterSchema = z.object({
  id: z.union([z.number(), z.string()])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return String(val);
    }),
  page: z.coerce.number().default(1).catch(1),
  name: z.string().optional(),
  status: z.enum(['alive', 'dead', 'unknown']).optional(),
  species: z.string().optional(),
  type: z.string().optional(),
  gender: z.enum(['male', 'female', 'genderless', 'unknown']).optional(),
});

export type CharactersFilter = z.infer<typeof CharactersFilterSchema>;

const locationSchema = z.object({
  id: z.coerce.number().optional().catch(undefined),
  name: z.string().optional(),
  type: z.string().optional(),
  dimension: z.string().optional(),
  page: z.coerce.number().min(1).prefault(1).catch(1).optional(),
})

export type LocationFilterModel = z.output<typeof locationSchema>;

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[]; // Lista de URLs de los personajes que residen allí
  url: string;        // URL de la propia localización
  created: string;    // Fecha de creación en formato ISO string
}

export enum APP_ROUTES {
  CHARACTERS = `characters`,
  CHARACTER_DETAILS = 'character-details',
  LOCATIONS = 'locations',
  LOCATIONS_DETAILS = 'location-details',
  LOGIN = 'auth/login',
  REGISTER = 'auth/register',
  LOGOUT = 'auth/logout'
}

export interface LoginResponse {
  msg: string,
  status: string
}

export interface UserPayload {
  id: string,
  name: string,
  email: string,
}

export interface BackendResponse<T> {
  msg: string,
  details: T
}



