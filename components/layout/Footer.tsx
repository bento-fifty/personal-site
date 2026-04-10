import {Link} from '@/i18n/navigation';
import CopyrightYear from './CopyrightYear';

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,0,0,0.08)] py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-label text-xs text-[#1A1A1A]/40">
          © <CopyrightYear /> EVAN CHANG
        </span>
        <div className="flex gap-6">
          {[
            {label: 'Instagram', href: '#'},
            {label: 'LinkedIn', href: '#'},
            {label: 'Email', href: 'mailto:hello@evanchang.com'},
          ].map(({label, href}) => (
            <a
              key={label}
              href={href}
              className="font-label text-xs text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
