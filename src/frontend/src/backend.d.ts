import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FAQ {
    id: bigint;
    question: string;
    answer: string;
    category: string;
}
export interface MembershipRecord {
    id: bigint;
    owner: Principal;
    tier: MembershipTier;
    purchasedAt: bigint;
}
export interface ChatbotConfig {
    enabled: boolean;
    phoneNumber: string;
}
export interface DownloadStats {
    windowsDownloads: bigint;
    macosDownloads: bigint;
    linuxDownloads: bigint;
    totalDownloads: bigint;
}
export interface SavedConfig {
    id: bigint;
    os: string;
    owner: Principal;
    name: string;
    createdAt: bigint;
    configData: string;
}
export interface MembershipStats {
    totalGold: bigint;
    totalSilver: bigint;
    totalPlatinum: bigint;
    totalMembers: bigint;
}
export interface UserProfile {
    bio?: string;
    name: string;
}
export interface Changelog {
    id: bigint;
    title: string;
    changeType: string;
    description: string;
    version: string;
    releaseDate: string;
    changesList: Array<string>;
}
export enum MembershipTier {
    gold = "gold",
    platinum = "platinum",
    silver = "silver"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChangelog(version: string, releaseDate: string, title: string, description: string, changesList: Array<string>, changeType: string): Promise<void>;
    addFAQ(question: string, answer: string, category: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteChangelog(id: bigint): Promise<void>;
    deleteChatbotConfig(): Promise<void>;
    deleteConfig(id: bigint): Promise<void>;
    deleteFAQ(id: bigint): Promise<void>;
    getAllChangelog(): Promise<Array<Changelog>>;
    getAllFAQs(): Promise<Array<FAQ>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatbotConfig(): Promise<ChatbotConfig | null>;
    getDownloadsByOS(): Promise<DownloadStats>;
    getLatestVersion(): Promise<string>;
    getMembershipStats(): Promise<MembershipStats>;
    getMyConfigs(): Promise<Array<SavedConfig>>;
    getMyMembership(): Promise<MembershipRecord | null>;
    getTotalConfigsCount(): Promise<bigint>;
    getTotalDownloads(): Promise<bigint>;
    getTotalMembersCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementDownload(os: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    purchaseMembership(tier: MembershipTier): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveChatbotConfig(phoneNumber: string, enabled: boolean): Promise<void>;
    saveConfig(name: string, os: string, configData: string): Promise<bigint>;
}
