// components/dossier/pageConfig.ts
// Route → Dossier page meta mapping. Used by DossierHeader and DossierFooter
// to self-resolve chrome data via usePathname — avoids every page.tsx having
// to pass meta props manually.

import { getCaseBySlug } from '@/lib/work-data';

export interface DossierPageMeta {
  /** Displayed in header's CASE field, e.g. "019" / "GEN-01" / "APX-B" / "COVER" / "ARCHIVE" */
  caseId: string;
  /** Section index shown after `§`, e.g. "01" / "02" / "02.019" / "APX-B" / "00" */
  sectionIndex: string;
  /** Human readable section label, e.g. "PERSONNEL FILE" */
  sectionName: string;
  /** Footer PG identifier — usually === sectionIndex, broken out for clarity */
  footerSectionIndex: string;
}

/** Total dossier sections; footer shows `PG xx / 07`. 07 reserves a slot for
 *  a future `/blog` § 03 · TRANSMISSION LOG reintroduction. */
export const DOSSIER_SECTION_TOTAL = 7;

export const dossierPageMeta = {
  home: {
    caseId: 'COVER',
    sectionIndex: '00',
    sectionName: 'COVER / BRIEF',
    footerSectionIndex: '00',
  },
  about: {
    caseId: 'GEN-01',
    sectionIndex: '01',
    sectionName: 'PERSONNEL FILE',
    footerSectionIndex: '01',
  },
  workArchive: {
    caseId: 'ARCHIVE',
    sectionIndex: '02',
    sectionName: 'CASE ARCHIVE',
    footerSectionIndex: '02',
  },
  services: {
    caseId: 'APX-B',
    sectionIndex: 'APX-B',
    sectionName: 'FIELD KIT',
    footerSectionIndex: 'APX-B',
  },
} as const satisfies Record<string, DossierPageMeta>;

/** Resolve meta from next-intl usePathname (locale-stripped, e.g. "/about"). */
export function resolveDossierMeta(pathname: string): DossierPageMeta {
  if (pathname === '/' || pathname === '') return dossierPageMeta.home;
  if (pathname === '/about') return dossierPageMeta.about;
  if (pathname === '/work') return dossierPageMeta.workArchive;
  if (pathname === '/services') return dossierPageMeta.services;
  if (pathname.startsWith('/work/')) {
    const slug = pathname.replace(/^\/work\//, '');
    const c = getCaseBySlug(slug);
    const id = c?.id ?? 'UNK';
    return {
      caseId: id,
      sectionIndex: `02.${id}`,
      sectionName: 'CASE FILE',
      footerSectionIndex: `02.${id}`,
    };
  }
  // Unknown route — fall back to home meta to avoid runtime crash.
  return dossierPageMeta.home;
}
