export interface SegTrack {
  id: string;
  fullLabel: string;
  shortLabel: string;
}

/**
 * Single source of truth for the 6 official SEG professional tracks.
 * Do not add, remove, or reword tracks here without explicit product
 * approval - these exact labels are the confirmed SEG decision, and
 * the ids/labels match the seed plan in prisma/seed.ts.
 */
export const segTracks: SegTrack[] = [
  { id: 'intern_jmc', fullLabel: 'Intern Doctors / JMC', shortLabel: 'Intern / JMC' },
  { id: 'em_resident', fullLabel: 'Emergency Medicine Residents', shortLabel: 'EM Resident' },
  { id: 'med_student', fullLabel: 'Medical Students', shortLabel: 'Med Student' },
  { id: 'gp', fullLabel: 'General Practitioners', shortLabel: 'GP' },
  { id: 'ems_paramedic', fullLabel: 'EMS / Paramedics', shortLabel: 'EMS/Paramedic' },
  { id: 'er_nursing', fullLabel: 'Emergency Nursing', shortLabel: 'ER Nursing' },
];
