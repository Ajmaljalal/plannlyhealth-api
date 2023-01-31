// create an interface for the benefits programs

import { Frequency, ProgramModel } from "../enums";

export interface BenefitsProgram {
  id: string;
  budget: number;
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
  parent: string;
  program_model: ProgramModel;
  owner: string;
  modified_date: Date;
  created_date: Date;
  slug: string;
}