import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import { Logo } from '@/components/icons';
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
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ({ children }) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [scrollActive, setScrollActive] = useState(false);

  const activeLink = usePathname();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrollActive(window.scrollY > 20);
    });
  }, []);

  const links = [
    {
      name: 'Tableau de bord',
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
      name: 'Appearance',
      description: '',
      href: '/admin/appearance',
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
            <div className="flex h-[60px] justify-between items-center border-blue-200 px-5">
              <Link
                className="flex items-center gap-2 font-semibold"
                href="/admin"
              >
                <Image src={'/assets/logo.png'} height={50} width={50} />
                {/* <div className="md:hidden">Admin</div> */}
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
          <header className="bg-gray-100/40 ">
            <div className="flex h-14 lg:h-[60px] items-center gap-4 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
              {' '}
              <div className="md:hidden">
                <button
                  className="md:hidden right-0 cursor-pointer text-xl  border-transparent bg-transparent block outline-none focus:outline-none ml-auto pb-3"
                  type="button"
                  onClick={() => setNavbarOpen(!navbarOpen)}
                >
                  {navbarOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-menu text-primary"
                    >
                      <line x1="6" y1="6" x2="21" y2="18"></line>
                      {/* <line x1="3" y1="6" x2="21" y2="6"></line> */}
                      {/* <line x1="3" y1="12" x2="21" y2="12"></line> */}
                      {/* <line x1="3" y1="18" x2="21" y2="18"></line> */}
                      <line x1="6" y1="18" x2="21" y2="6"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-menu text-primary"
                    >
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="5" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  )}
                </button>
              </div>
              <Link
                className="flex items-center gap-2 font-semibold lg:hidden"
                href="/admin"
              >
                <Image src={'/assets/logo.png'} height={50} width={50} />
              </Link>
              <UserIcon className="h-5 w-5" />
            </div>
            {/* <User /> */}

            <div className={navbarOpen ? "flex w-full" : "hidden"}>
              <nav
                className={
                  'md:hidden items-start px-4 text-sm font-medium' +
                  (navbarOpen ? 'flex' : 'hidden')
                }
              >
                {links.map((item) => (
                  <NavItem href={item.href}>
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </NavItem>
                ))}
              </nav>
            </div>
          </header>
          {children}
        </div>
      </div>
      <Analytics />
    </>
  );
}
