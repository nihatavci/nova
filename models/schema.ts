import { pgTable, serial, text, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Financial profiles table
export const financialProfiles = pgTable('financial_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  residencyStatus: text('residency_status').notNull(),
  familyStatus: text('family_status').notNull(),
  employmentIncome: integer('employment_income').default(0),
  businessIncome: integer('business_income').default(0),
  investmentIncome: integer('investment_income').default(0),
  otherIncome: integer('other_income').default(0),
  realEstate: json('real_estate').$type<Array<{
    value: number;
    location: string;
    mortgageAmount: number;
  }>>(),
  investments: json('investments').$type<Array<{
    type: string;
    value: number;
    location: string;
  }>>(),
  cash: integer('cash').default(0),
  otherAssets: json('other_assets').$type<Array<{
    description: string;
    value: number;
  }>>(),
  taxResidency: text('tax_residency').notNull(),
  taxObligations: json('tax_obligations').$type<string[]>(),
  retirementPlanning: boolean('retirement_planning').default(false),
  wealthAccumulation: boolean('wealth_accumulation').default(false),
  taxOptimization: boolean('tax_optimization').default(false),
  otherGoals: text('other_goals'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Reports table
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  profileId: integer('profile_id').references(() => financialProfiles.id).notNull(),
  reportContent: text('report_content').notNull(),
  recommendations: json('recommendations').$type<string[]>(),
  potentialSavings: integer('potential_savings'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User dashboard settings
export const dashboardSettings = pgTable('dashboard_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  language: text('language').default('en').notNull(),
  currency: text('currency').default('EUR').notNull(),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Shared Results table for public sharing
export const sharedResults = pgTable('shared_results', {
  id: serial('id').primaryKey(),
  shareId: text('share_id').notNull().unique(), // Unique identifier for sharing URL
  resultData: json('result_data').notNull(), // Store the entire result data as JSON
  score: json('score').$type<{
    overall: number;
    category: string;
    breakdown: Record<string, number>;
    recommendations: Array<{
      description: string;
      impact: string;
    }>;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'), // Optional expiration date
  viewCount: integer('view_count').default(0), // Track number of views
  isProtected: boolean('is_protected').default(false), // Option to password-protect
  accessPassword: text('access_password'), // Optional password for protected results
}); 