import type { MenuItem } from '~/types/menu';

export const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    route: '/dashboard',
  },
  {
    id: 'about',
    label: 'About',
    icon: 'info',
    route: '/about',
  },
  {
    id: 'test',
    label: 'Test',
    icon: 'science',
    route: '/test',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    separator: true,
    children: [
      {
        id: 'profile',
        label: 'Profile',
        icon: 'person',
        route: '/profile',
      },
      {
        id: 'language',
        label: 'Language',
        icon: 'language',
        type: 'language-selector',
      },
    ],
  },
];

export const menuConfig = {
  width: 280,
  miniWidth: 60,
  breakpoint: 1024,
};
