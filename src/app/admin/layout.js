import AdminLayoutClient from './AdminLayoutClient';

export const metadata = {
  title: 'Soundnest CMS Admin Panel',
  description: 'Manage Soundnest services, articles, consultation leads, and SEO control center.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
