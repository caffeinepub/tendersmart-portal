# TenderSmart Portal

## Current State
Empty project with no backend and no App.tsx. Only scaffolding and shadcn UI components exist.

## Requested Changes (Diff)

### Add
- Full Motoko backend with tender management, user profiles, saved tenders
- User authentication via Internet Identity
- Tender listing with search and filters (category, department, location, risk level, deadline)
- Risk analysis per tender (HIGH/MEDIUM/LOW with reasons)
- Relevance scoring based on user industry/category
- Urgency badges and countdown timers for deadlines
- AI-style tender summaries (pre-computed fields)
- Company Fit Score based on user profile
- Saved/bookmarked tenders per user
- Analytics dashboard (department stats, category stats, monthly trend)
- Company profile page

### Modify
- Nothing (new build)

### Remove
- Nothing

## Implementation Plan

**Backend (Motoko):**
- `Tender` type: id, name, department, category, location, description, budget, deadline (timestamp), emd, eligibility, riskLevel, riskReasons, summary, relevanceTags
- `UserProfile` type: userId (Principal), name, company, industry, turnover, experience, savedTenders
- Functions: getTenders, getTenderById, createTender (admin seed), getUserProfile, updateUserProfile, saveTender, unsaveTender, getSavedTenders, getAnalytics
- Seed 15-20 sample tenders on init

**Frontend:**
- Auth: Login/Signup via Internet Identity
- Pages: Dashboard (tender list), Tender Detail, Analytics, Profile, Saved Tenders
- Filters: category, department, location, risk level, deadline range, search text
- Tender card: name, dept, deadline countdown, urgency badge, risk badge, relevance %, fit score
- Analytics page: bar chart (departments), pie chart (categories), line chart (monthly trend)
- Profile page: edit company info
