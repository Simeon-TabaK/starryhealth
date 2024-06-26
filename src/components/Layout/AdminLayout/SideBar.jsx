import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import { Logo} from '@/components/icons';
import { User } from './user';
import { NavItem } from './nav-item';
import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  HomeIcon,
  NewspaperIcon,
  PaintBrushIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  Squares2X2Icon,
  UserIcon,
  UsersIcon,
  WrenchIcon
} from '@heroicons/react/24/solid';

export default function ({ children }) {
  const links = [
    {
      name: 'Tableaau de bord',
      description: '',
      href: '/admin',
      icon: Squares2X2Icon
    },
    {
      name: 'Accueil',
      description: '',
      href: '/admin/home',
      icon: HomeIcon
    },
    {
      name: 'Articles', //posts
      description: '',
      href: '/admin/posts',
      icon: NewspaperIcon
    },
    {
      name: 'Media',
      description: '',
      href: '/admin/media',
      icon: PhotoIcon
    },
    {
      name: 'Pages',
      description: '',
      href: '/admin/pages',
      icon: CreditCardIcon
    },
    {
      name: 'Commentaires', //comments
      description: '',
      href: '/admin/comments',
      icon: ChatBubbleLeftRightIcon
    },
    {
      name: 'Appearence',
      description: '',
      href: '/admin/appearence',
      icon: PaintBrushIcon
    },
    {
      name: 'Plugins',
      description: '',
      href: '/admin/plugins',
      icon: PuzzlePieceIcon
    },
    {
      name: 'Utilisateur',
      description: '',
      href: '/admin/user',
      icon: UsersIcon
    },
    {
      name: 'Outils',
      description: '',
      href: '/admin/tools',
      icon: WrenchIcon
    },
    {
      name: 'Paramètres',
      description: '',
      href: '/admin/settings',
      icon: Cog6ToothIcon
    }
  ];

  return (
    <>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <div className="hidden shadow-orange-100 bg-gray-100/40 lg:block dark:bg-gray-800/40">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-5">
              <Link className="flex items-center gap-2 font-semibold" href="/">
                <Logo />
                <span className="">Admin</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                {links.map((item) => (
                  <NavItem href={item.href}>
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </NavItem>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
            <Link
              className="flex items-center gap-2 font-semibold lg:hidden"
              href="/"
            >
              <Logo />
              <span className="">ACME</span>
            </Link>
            <UsersIcon className="h-4 w-4" />
            {/* <User /> */}
          </header>
          {children}
        </div>
      </div>
      <Analytics />
    </>
  );
}
