import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    turnover: string;
    savedTenders: Array<bigint>;
    name: string;
    experience: bigint;
    company: string;
    industry: string;
}
export interface Tender {
    id: bigint;
    emd: string;
    name: string;
    createdAt: bigint;
    description: string;
    deadline: bigint;
    eligibility: string;
    summary: string;
    category: string;
    department: string;
    riskReasons: Array<string>;
    budget: string;
    riskLevel: string;
    location: string;
    relevanceTags: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAnalytics(): Promise<{
        categoryCounts: Array<[string, bigint]>;
        lowRiskCount: bigint;
        departmentCounts: Array<[string, bigint]>;
        totalTenders: bigint;
        mediumRiskCount: bigint;
        highRiskCount: bigint;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSavedTenders(): Promise<Array<bigint>>;
    getTenderById(id: bigint): Promise<Tender | null>;
    getTenders(): Promise<Array<Tender>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveTender(tenderId: bigint): Promise<void>;
    unsaveTender(tenderId: bigint): Promise<void>;
    updateUserProfile(name: string, company: string, industry: string, turnover: string, experience: bigint): Promise<void>;
}
