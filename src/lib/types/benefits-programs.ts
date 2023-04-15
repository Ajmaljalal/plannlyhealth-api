// create an interface for the benefits programs

import { Frequency, ProgramAccess, ProgramModel } from "../enums";

export interface BenefitsProgram {
  id: string;
  budget: number;
  budget_old: number;
  company_id: string;
  description: string;
  end_date: Date;
  frequency: Frequency;
  is_active: boolean;
  is_deleted: boolean;
  is_template: boolean;
  logo_active: string;
  logo_inactive: string;
  name: string;
  parent: string; // parent benefit program id
  program_model: ProgramModel;
  program_access: ProgramAccess;
  creator: string;
  modified_date: Date;
  creation_date: Date;
  slug: string;
}