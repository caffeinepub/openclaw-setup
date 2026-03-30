import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    id: bigint;
    coverImageUrl: string;
    title: string;
    body: string;
    createdAt: bigint;
    tags: Array<string>;
    authorName: string;
    category: string;
}
export interface LeaderboardEntry {
    principal: Principal;
    displayName: string;
    joinedAt: bigint;
    rank: bigint;
    tier: MembershipTier;
    tokens: bigint;
    handle: string;
}
export interface FAQ {
    id: bigint;
    question: string;
    answer: string;
    category: string;
}
export interface ClaimedReward {
    title: string;
    rank: bigint;
    claimedAt: bigint;
    badge: string;
    bonusTokens: bigint;
}
export interface ForumPost {
    id: bigint;
    body: string;
    createdAt: bigint;
    threadId: bigint;
    authorHandle: string;
    authorPrincipal: Principal;
}
export interface UserAccount {
    fullName: string;
    email: string;
    handle: string;
    phone: string;
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
export interface Changelog {
    id: bigint;
    title: string;
    changeType: string;
    description: string;
    version: string;
    releaseDate: string;
    changesList: Array<string>;
}
export interface ForumThread {
    id: bigint;
    title: string;
    createdAt: bigint;
    replyCount: bigint;
    lastActivityAt: bigint;
    authorHandle: string;
    authorPrincipal: Principal;
    topicId: bigint;
}
export interface TopReward {
    title: string;
    color: string;
    rank: bigint;
    description: string;
    badge: string;
    bonusTokens: bigint;
}
export interface MembershipRecord {
    id: bigint;
    owner: Principal;
    tier: MembershipTier;
    purchasedAt: bigint;
}
export interface ForumNotification {
    id: bigint;
    createdAt: bigint;
    read: boolean;
    threadTitle: string;
    threadId: bigint;
    recipientPrincipal: Principal;
    fromHandle: string;
}
export interface ChatbotConfig {
    enabled: boolean;
    phoneNumber: string;
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
export interface ForumTopic {
    id: bigint;
    title: string;
    createdAt: bigint;
    description: string;
    category: string;
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
export interface LocalAccountData {
    handle: string;
    passwordHash: string;
    email: string;
    phone: string;
    fullName: string;
    createdAt?: string;
}
export interface WaitlistEntry {
    handle: string;
    email: string;
    joinedAt: bigint;
}
export interface backendInterface {
    addBlogPost(title: string, body: string, authorName: string, category: string, tags: Array<string>, coverImageUrl: string): Promise<BlogPost>;
    addChangelog(version: string, releaseDate: string, title: string, description: string, changesList: Array<string>, changeType: string): Promise<void>;
    addFAQ(question: string, answer: string, category: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimTopReward(rank: bigint): Promise<ClaimedReward>;
    createForumPost(threadId: bigint, body: string): Promise<ForumPost>;
    createForumThread(topicId: bigint, title: string, body: string): Promise<ForumThread>;
    deleteChangelog(id: bigint): Promise<void>;
    deleteChatbotConfig(): Promise<void>;
    deleteConfig(id: bigint): Promise<void>;
    deleteFAQ(id: bigint): Promise<void>;
    getAllChangelog(): Promise<Array<Changelog>>;
    getAllFAQs(): Promise<Array<FAQ>>;
    getBlogPosts(): Promise<Array<BlogPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatbotConfig(): Promise<ChatbotConfig | null>;
    getDownloadsByOS(): Promise<DownloadStats>;
    getForumPostsByThread(threadId: bigint): Promise<Array<ForumPost>>;
    getForumThreadsByTopic(topicId: bigint): Promise<Array<ForumThread>>;
    getForumTopics(): Promise<Array<ForumTopic>>;
    getLatestVersion(): Promise<string>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getMembershipStats(): Promise<MembershipStats>;
    getMyClaimedRewards(): Promise<Array<ClaimedReward>>;
    getMyConfigs(): Promise<Array<SavedConfig>>;
    getMyForumNotifications(): Promise<Array<ForumNotification>>;
    getMyLeaderboardRank(): Promise<LeaderboardEntry | null>;
    getMyMembership(): Promise<MembershipRecord | null>;
    getMyUserAccount(): Promise<UserAccount | null>;
    getTopRewards(): Promise<Array<TopReward>>;
    getTotalConfigsCount(): Promise<bigint>;
    getTotalDownloads(): Promise<bigint>;
    getTotalMembersCount(): Promise<bigint>;
    getUserAccountByHandle(handle: string): Promise<UserAccount | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasClaimedReward(rank: bigint): Promise<boolean>;
    incrementDownload(os: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    markForumNotificationRead(id: bigint): Promise<boolean>;
    purchaseMembership(tier: MembershipTier): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveChatbotConfig(phoneNumber: string, enabled: boolean): Promise<void>;
    saveConfig(name: string, os: string, configData: string): Promise<bigint>;
    saveUserAccount(email: string, phone: string, fullName: string, handle: string): Promise<void>;
    registerLocalAccount(handle: string, passwordHash: string, email: string, phone: string, fullName: string): Promise<{ok: null} | {handleTaken: null} | {alreadyExists: null}>;
    loginLocalAccount(handle: string, passwordHash: string): Promise<LocalAccountData | null>;
    isHandleAvailable(handle: string): Promise<boolean>;
    getLocalAccountByHandle(handle: string): Promise<LocalAccountData | null>;
    getAllLocalAccounts(): Promise<Array<LocalAccountData>>;
    addToWaitlist(handle: string, email: string): Promise<boolean>;
    getWaitlistEntries(): Promise<Array<WaitlistEntry>>;
}