import { Component } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  text: string;
}

interface TechItem {
  icon: string;
  name: string;
  text: string;
}

const FEATURES: Feature[] = [
  {
    icon: 'bi-search',
    title: 'Full character catalog',
    text: 'Browse every Rick & Morty character with live search and filters by status, species and gender.',
  },
  {
    icon: 'bi-geo-alt-fill',
    title: 'Locations explorer',
    text: 'Every location across the multiverse, with its dimension and full list of residents.',
  },
  {
    icon: 'bi-shield-lock-fill',
    title: 'Secure JWT auth',
    text: 'Dual-token authentication (access & refresh) stored in httpOnly cookies to keep sessions safe.',
  },
  {
    icon: 'bi-lightning-charge-fill',
    title: 'Signals-driven UI',
    text: "Built with Angular's httpResource and Signals, so the whole UI reacts instantly to state changes.",
  },
  {
    icon: 'bi-hdd-network-fill',
    title: 'SSR + Hydration',
    text: 'Pages render on the server and hydrate seamlessly in the browser for fast first loads.',
  },
  {
    icon: 'bi-database-fill-check',
    title: 'Type-safe persistence',
    text: 'PostgreSQL with Drizzle ORM for reliable, fully typed access to user data.',
  },
];

const TECH_STACK: TechItem[] = [
  {
    icon: 'bi-braces',
    name: 'Angular 20',
    text: 'Signals, httpResource and the new control-flow syntax power the whole UI.',
  },
  {
    icon: 'bi-code-square',
    name: 'TypeScript',
    text: 'Static typing across the entire codebase, frontend and backend.',
  },
  {
    icon: 'bi-palette-fill',
    name: 'Tailwind CSS',
    text: 'Utility-first styling behind every screen and component.',
  },
  {
    icon: 'bi-arrow-repeat',
    name: 'RxJS',
    text: 'firstValueFrom bridges async logic between services and Signals.',
  },
  {
    icon: 'bi-server',
    name: 'Express.js',
    text: 'REST API for authentication, sitting behind httpOnly cookies.',
  },
  {
    icon: 'bi-diagram-3-fill',
    name: 'Drizzle ORM',
    text: 'Type-safe SQL queries and migrations against PostgreSQL.',
  },
  {
    icon: 'bi-key-fill',
    name: 'JWT + bcrypt',
    text: 'Signed access/refresh tokens and hashed passwords for the auth flow.',
  },
  {
    icon: 'bi-ui-checks-grid',
    name: 'Reactive Forms + Zod',
    text: 'Validates and syncs the login/register forms, client and server side.',
  },
];

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly features = FEATURES;
  protected readonly techStack = TECH_STACK;
}
