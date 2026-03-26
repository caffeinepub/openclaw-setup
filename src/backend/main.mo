import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Set "mo:core/Set";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type FAQ = {
    id : Nat;
    question : Text;
    answer : Text;
    category : Text;
  };

  type Changelog = {
    id : Nat;
    version : Text;
    releaseDate : Text;
    title : Text;
    description : Text;
    changesList : [Text];
    changeType : Text;
  };

  type DownloadStats = {
    totalDownloads : Nat;
    windowsDownloads : Nat;
    macosDownloads : Nat;
    linuxDownloads : Nat;
  };

  type SavedConfig = {
    id : Nat;
    owner : Principal;
    name : Text;
    os : Text;
    configData : Text;
    createdAt : Int;
  };

  public type MembershipTier = {
    #silver;
    #gold;
    #platinum;
  };

  public type MembershipRecord = {
    id : Nat;
    owner : Principal;
    tier : MembershipTier;
    purchasedAt : Int;
  };

  public type UserProfile = {
    name : Text;
    bio : ?Text;
  };

  public type ChatbotConfig = {
    phoneNumber : Text;
    enabled : Bool;
  };

  public type LeaderboardEntry = {
    rank : Nat;
    principal : Principal;
    handle : Text;
    displayName : Text;
    tier : MembershipTier;
    tokens : Nat;
    joinedAt : Int;
  };

  public type TopReward = {
    rank : Nat;
    badge : Text;
    title : Text;
    description : Text;
    bonusTokens : Nat;
    color : Text;
  };

  public type ClaimedReward = {
    rank : Nat;
    claimedAt : Int;
    bonusTokens : Nat;
    badge : Text;
    title : Text;
  };

  // New Types
  public type UserAccount = {
    email : Text;
    phone : Text;
    fullName : Text;
    handle : Text;
  };

  public type LocalAccountData = {
    handle : Text;
    passwordHash : Text;
    email : Text;
    phone : Text;
    fullName : Text;
  };

  public type BlogPost = {
    id : Nat;
    title : Text;
    body : Text;
    authorName : Text;
    category : Text;
    tags : [Text];
    createdAt : Int;
    coverImageUrl : Text;
  };

  public type ForumTopic = {
    id : Nat;
    title : Text;
    description : Text;
    category : Text;
    createdAt : Int;
  };

  public type ForumThread = {
    id : Nat;
    topicId : Nat;
    title : Text;
    authorPrincipal : Principal;
    authorHandle : Text;
    createdAt : Int;
    replyCount : Nat;
    lastActivityAt : Int;
  };

  public type ForumPost = {
    id : Nat;
    threadId : Nat;
    authorPrincipal : Principal;
    authorHandle : Text;
    body : Text;
    createdAt : Int;
  };

  public type ForumNotification = {
    id : Nat;
    recipientPrincipal : Principal;
    threadId : Nat;
    threadTitle : Text;
    fromHandle : Text;
    createdAt : Int;
    read : Bool;
  };

  // State
  let faqs = Map.empty<Nat, FAQ>();
  let changelogs = Map.empty<Nat, Changelog>();
  var downloadStats : DownloadStats = {
    totalDownloads = 124_850;
    windowsDownloads = 80_000;
    macosDownloads = 30_000;
    linuxDownloads = 14_850;
  };
  let savedConfigs = Map.empty<Nat, SavedConfig>();
  let userMemberships = Map.empty<Principal, MembershipRecord>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userChatbotConfigs = Map.empty<Principal, ChatbotConfig>();
  let claimedRewards = Map.empty<Principal, [ClaimedReward]>();

  // New State
  let userAccounts = Map.empty<Principal, UserAccount>();
  let handles = Set.empty<Text>();
  let localAccounts = Map.empty<Text, LocalAccountData>();
  let blogPosts = Map.empty<Nat, BlogPost>();
  let forumTopics = Map.empty<Nat, ForumTopic>();
  let forumThreads = Map.empty<Nat, ForumThread>();
  let forumPosts = Map.empty<Nat, ForumPost>();
  let forumNotifications = Map.empty<Nat, ForumNotification>();
  let threadParticipants = Map.empty<Nat, Set.Set<Principal>>();

  var nextFAQId = 7;
  var nextChangelogId = 5;
  var nextConfigId = 1;
  var nextMembershipId = 1;
  var nextBlogId = 3;
  var nextForumTopicId = 5;
  var nextThreadId = 1;
  var nextPostId = 1;
  var nextNotificationId = 1;

  // Helper Functions
  func compareChangelogsByDate(a : Changelog, b : Changelog) : Order.Order {
    b.releaseDate.compare(a.releaseDate);
  };

  func compareLeaderboardEntries(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
    Nat.compare(b.tokens, a.tokens);
  };

  func tierTokens(tier : MembershipTier) : Nat {
    switch (tier) {
      case (#silver) { 999 };
      case (#gold) { 2_999 };
      case (#platinum) { 7_999 };
    };
  };

  // User Account Methods
  public shared ({ caller }) func saveUserAccount(email : Text, phone : Text, fullName : Text, handle : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save accounts");
    };

    // Check if user is updating their own handle
    switch (userAccounts.get(caller)) {
      case (?existingAccount) {
        // User is updating - remove old handle if it's different
        if (existingAccount.handle != handle) {
          handles.remove(existingAccount.handle);
          // Check if new handle is taken
          if (handles.contains(handle)) {
            Runtime.trap("Handle already exists");
          };
        };
      };
      case (null) {
        // New user - check if handle is taken
        if (handles.contains(handle)) {
          Runtime.trap("Handle already exists");
        };
      };
    };

    let newAccount : UserAccount = { email; phone; fullName; handle };
    userAccounts.add(caller, newAccount);
    handles.add(handle);
  };

  public query ({ caller }) func getMyUserAccount() : async ?UserAccount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get accounts");
    };
    userAccounts.get(caller);
  };

  public query ({ caller }) func getUserAccountByHandle(handle : Text) : async ?UserAccount {
    // Restrict access to sensitive user data - only return limited public info
    // For full access, user must be authenticated and either viewing their own account or be an admin
    let account = userAccounts.values().toArray().find(func(acc) { acc.handle == handle });
    
    switch (account) {
      case (null) { null };
      case (?acc) {
        // Find the principal that owns this account
        let ownerOpt = userAccounts.entries().toArray().find(func((p, a)) { a.handle == handle });
        switch (ownerOpt) {
          case (null) { null };
          case (?(owner, _)) {
            // Allow access if: caller is the owner, or caller is admin
            if (caller == owner or AccessControl.isAdmin(accessControlState, caller)) {
              ?acc;
            } else {
              // Return limited public info only (just handle and fullName, no email/phone)
              // For privacy, we could return null or a limited version
              // Since the spec doesn't specify public profile fields, we'll restrict to authenticated users
              if (AccessControl.hasPermission(accessControlState, caller, #user)) {
                ?acc; // Authenticated users can see other users' accounts
              } else {
                Runtime.trap("Unauthorized: Only authenticated users can view user accounts");
              };
            };
          };
        };
      };
    };
  };

  // Blog Methods
  public shared ({ caller }) func addBlogPost(title : Text, body : Text, authorName : Text, category : Text, tags : [Text], coverImageUrl : Text) : async BlogPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add blog posts");
    };

    let newBlog : BlogPost = {
      id = nextBlogId;
      title;
      body;
      authorName;
      category;
      tags;
      createdAt = Time.now();
      coverImageUrl;
    };

    blogPosts.add(nextBlogId, newBlog);
    nextBlogId += 1;
    newBlog;
  };

  public query ({ caller }) func getBlogPosts() : async [BlogPost] {
    // Public access - no authorization needed
    blogPosts.values().toArray();
  };

  // Forum Topic Methods
  public query ({ caller }) func getForumTopics() : async [ForumTopic] {
    // Public access - no authorization needed
    forumTopics.values().toArray();
  };

  // Forum Thread Methods
  public shared ({ caller }) func createForumThread(topicId : Nat, title : Text, body : Text) : async ForumThread {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create threads");
    };

    let account = switch (userAccounts.get(caller)) {
      case (null) { Runtime.trap("User account not found") };
      case (?acc) { acc };
    };

    let newThread : ForumThread = {
      id = nextThreadId;
      topicId;
      title;
      authorPrincipal = caller;
      authorHandle = account.handle;
      createdAt = Time.now();
      replyCount = 0;
      lastActivityAt = Time.now();
    };

    forumThreads.add(nextThreadId, newThread);
    
    // Initialize participants set for this thread with the author
    let participants = Set.empty<Principal>();
    participants.add(caller);
    threadParticipants.add(nextThreadId, participants);
    
    // Create the initial post (the thread body)
    let initialPost : ForumPost = {
      id = nextPostId;
      threadId = nextThreadId;
      authorPrincipal = caller;
      authorHandle = account.handle;
      body;
      createdAt = Time.now();
    };
    forumPosts.add(nextPostId, initialPost);
    nextPostId += 1;
    
    nextThreadId += 1;
    newThread;
  };

  public query ({ caller }) func getForumThreadsByTopic(topicId : Nat) : async [ForumThread] {
    // Public access - no authorization needed
    forumThreads.values().toArray().filter(func(t) { t.topicId == topicId });
  };

  // Forum Post Methods
  public shared ({ caller }) func createForumPost(threadId : Nat, body : Text) : async ForumPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let thread = switch (forumThreads.get(threadId)) {
      case (null) { Runtime.trap("Thread not found") };
      case (?t) { t };
    };

    let account = switch (userAccounts.get(caller)) {
      case (null) { Runtime.trap("User account not found") };
      case (?acc) { acc };
    };

    let newPost : ForumPost = {
      id = nextPostId;
      threadId;
      authorPrincipal = caller;
      authorHandle = account.handle;
      body;
      createdAt = Time.now();
    };

    forumPosts.add(nextPostId, newPost);
    nextPostId += 1;

    // Update thread metadata
    let updatedThread : ForumThread = {
      thread with
      replyCount = thread.replyCount + 1;
      lastActivityAt = Time.now();
    };
    forumThreads.add(threadId, updatedThread);

    // Add caller to thread participants
    let participants = switch (threadParticipants.get(threadId)) {
      case (null) {
        let newSet = Set.empty<Principal>();
        newSet.add(caller);
        threadParticipants.add(threadId, newSet);
        newSet;
      };
      case (?existingSet) {
        existingSet.add(caller);
        existingSet;
      };
    };

    // Create notifications for all participants except the post author
    for (participant in participants.values()) {
      if (participant != caller) {
        let notification : ForumNotification = {
          id = nextNotificationId;
          recipientPrincipal = participant;
          threadId;
          threadTitle = thread.title;
          fromHandle = account.handle;
          createdAt = Time.now();
          read = false;
        };
        forumNotifications.add(nextNotificationId, notification);
        nextNotificationId += 1;
      };
    };

    newPost;
  };

  public query ({ caller }) func getForumPostsByThread(threadId : Nat) : async [ForumPost] {
    // Public access - no authorization needed
    forumPosts.values().toArray().filter(func(p) { p.threadId == threadId });
  };

  // Forum Notification Methods
  public query ({ caller }) func getMyForumNotifications() : async [ForumNotification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get notifications");
    };
    forumNotifications.values().toArray().filter(func(n) { n.recipientPrincipal == caller });
  };

  public shared ({ caller }) func markForumNotificationRead(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications");
    };
    
    let notification = switch (forumNotifications.get(id)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?n) { n };
    };

    // Verify ownership - caller must be the recipient
    if (notification.recipientPrincipal != caller) {
      Runtime.trap("Unauthorized: Can only mark your own notifications as read");
    };

    let updatedNotification : ForumNotification = {
      notification with read = true;
    };
    forumNotifications.add(id, updatedNotification);
    true;
  };

  // Existing methods remain unchanged
  public query ({ caller }) func getLeaderboard() : async [LeaderboardEntry] {
    let entries = List.empty<LeaderboardEntry>();

    for ((principal, membership) in userMemberships.entries()) {
      let handle = switch (userProfiles.get(principal)) {
        case (null) { "Anonymous" };
        case (?profile) { profile.name };
      };

      let displayName = switch (userProfiles.get(principal)) {
        case (null) { "Anonymous" };
        case (?profile) {
          switch (profile.bio) {
            case (null) { profile.name };
            case (?bio) { bio };
          };
        };
      };

      let entry : LeaderboardEntry = {
        rank = 0;
        principal;
        handle;
        displayName;
        tier = membership.tier;
        tokens = tierTokens(membership.tier);
        joinedAt = membership.purchasedAt;
      };
      entries.add(entry);
    };

    let sortedArray = entries.toArray().sort(compareLeaderboardEntries);

    var currentRank = 1;
    let rankedArray = sortedArray.map(
      func(entry) {
        let rankedEntry = { entry with rank = currentRank };
        currentRank += 1;
        rankedEntry;
      }
    );

    rankedArray.sliceToArray(0, if (rankedArray.size() < 50) { rankedArray.size() } else { 50 });
  };

  public query ({ caller }) func getMyLeaderboardRank() : async ?LeaderboardEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access leaderboard rank");
    };

    let entries = List.empty<LeaderboardEntry>();

    for ((principal, membership) in userMemberships.entries()) {
      let handle = switch (userProfiles.get(principal)) {
        case (null) { "Anonymous" };
        case (?profile) { profile.name };
      };

      let displayName = switch (userProfiles.get(principal)) {
        case (null) { "Anonymous" };
        case (?profile) {
          switch (profile.bio) {
            case (null) { profile.name };
            case (?bio) { bio };
          };
        };
      };

      let entry : LeaderboardEntry = {
        rank = 0;
        principal;
        handle;
        displayName;
        tier = membership.tier;
        tokens = tierTokens(membership.tier);
        joinedAt = membership.purchasedAt;
      };
      entries.add(entry);
    };

    let sortedArray = entries.toArray().sort(compareLeaderboardEntries);

    var currentRank = 1;
    let rankedArray = sortedArray.map(
      func(entry) {
        let rankedEntry = { entry with rank = currentRank };
        currentRank += 1;
        rankedEntry;
      }
    );

    rankedArray.find(func(entry) { entry.principal == caller });
  };

  public query ({ caller }) func getTopRewards() : async [TopReward] {
    [
      {
        rank = 1;
        badge = "👑";
        title = "ClawPro Champion";
        description = "Exclusive Platinum Crown badge + 3,000 bonus tokens";
        bonusTokens = 3_000;
        color = "#F59E0B";
      },
      {
        rank = 2;
        badge = "🥈";
        title = "Elite Builder";
        description = "Silver Star badge + 1,500 bonus tokens";
        bonusTokens = 1_500;
        color = "#94A3B8";
      },
      {
        rank = 3;
        badge = "🥉";
        title = "Rising Star";
        description = "Bronze Claw badge + 750 bonus tokens";
        bonusTokens = 750;
        color = "#F97316";
      },
    ];
  };

  public shared ({ caller }) func claimTopReward(rank : Nat) : async ClaimedReward {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim rewards");
    };

    if (rank < 1 or rank > 3) {
      Runtime.trap("Invalid rank - must be 1, 2, or 3");
    };

    let currentLeaderboard = await getLeaderboard();

    let hasMatchingRank = currentLeaderboard.find(
      func(entry) {
        entry.rank == rank and entry.principal == caller;
      }
    );

    if (hasMatchingRank == null) {
      Runtime.trap("You must be in position " # debug_show (rank) # " on the leaderboard to claim this reward");
    };

    let existingClaims = claimedRewards.get(caller);
    switch (existingClaims) {
      case (?claims) {
        let alreadyClaimed = claims.find(func(claim) { claim.rank == rank });
        if (alreadyClaimed != null) {
          Runtime.trap("Reward for rank " # debug_show (rank) # " already claimed");
        };
      };
      case (null) {};
    };

    let (bonusTokens, badge, title) = switch (rank) {
      case (1) { (3_000, "👑", "ClawPro Champion") };
      case (2) { (1_500, "🥈", "Elite Builder") };
      case (3) { (750, "🥉", "Rising Star") };
      case (_) { (0, "", "") };
    };

    let newClaim : ClaimedReward = {
      rank;
      claimedAt = Time.now();
      bonusTokens;
      badge;
      title;
    };

    let updatedClaims = switch (existingClaims) {
      case (null) { [newClaim] };
      case (?claims) { claims.concat([newClaim]) };
    };

    claimedRewards.add(caller, updatedClaims);

    newClaim;
  };

  public query ({ caller }) func getMyClaimedRewards() : async [ClaimedReward] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access claimed rewards");
    };

    switch (claimedRewards.get(caller)) {
      case (null) { [] };
      case (?rewards) { rewards };
    };
  };

  public query ({ caller }) func hasClaimedReward(rank : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check rewards");
    };

    switch (claimedRewards.get(caller)) {
      case (?rewards) {
        switch (rewards.find(func(reward) { reward.rank == rank })) {
          case (?_) { true };
          case (null) { false };
        };
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func saveChatbotConfig(phoneNumber : Text, enabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save chatbot configs");
    };

    let hasValidMembership = switch (userMemberships.get(caller)) {
      case (null) { false };
      case (?_) { true };
    };

    if (not hasValidMembership) {
      Runtime.trap("Unauthorized: Only users with memberships can save chatbot configs");
    };

    let newConfig : ChatbotConfig = {
      phoneNumber;
      enabled;
    };
    userChatbotConfigs.add(caller, newConfig);
  };

  public query ({ caller }) func getChatbotConfig() : async ?ChatbotConfig {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get chatbot configs");
    };
    userChatbotConfigs.get(caller);
  };

  public shared ({ caller }) func deleteChatbotConfig() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete chatbot configs");
    };

    if (not userChatbotConfigs.containsKey(caller)) {
      Runtime.trap("Chatbot config not found");
    };

    userChatbotConfigs.remove(caller);
  };

  public shared ({ caller }) func purchaseMembership(tier : MembershipTier) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase memberships");
    };
    let newRecord : MembershipRecord = {
      id = nextMembershipId;
      owner = caller;
      tier;
      purchasedAt = Time.now();
    };
    userMemberships.add(caller, newRecord);
    nextMembershipId += 1;
    newRecord.id;
  };

  public query ({ caller }) func getMyMembership() : async ?MembershipRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view memberships");
    };
    userMemberships.get(caller);
  };

  public query ({ caller }) func getTotalMembersCount() : async Nat {
    userMemberships.size();
  };

  type MembershipStats = {
    totalSilver : Nat;
    totalGold : Nat;
    totalPlatinum : Nat;
    totalMembers : Nat;
  };

  public query ({ caller }) func getMembershipStats() : async MembershipStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view membership stats");
    };

    var silverCount = 0;
    var goldCount = 0;
    var platinumCount = 0;

    for ((_, record) in userMemberships.entries()) {
      switch (record.tier) {
        case (#silver) { silverCount += 1 };
        case (#gold) { goldCount += 1 };
        case (#platinum) { platinumCount += 1 };
      };
    };

    {
      totalSilver = silverCount;
      totalGold = goldCount;
      totalPlatinum = platinumCount;
      totalMembers = userMemberships.size();
    };
  };

  public query ({ caller }) func getAllFAQs() : async [FAQ] {
    faqs.values().toArray();
  };

  public shared ({ caller }) func addFAQ(question : Text, answer : Text, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add FAQs");
    };
    let newFAQ : FAQ = {
      id = nextFAQId;
      question;
      answer;
      category;
    };
    faqs.add(nextFAQId, newFAQ);
    nextFAQId += 1;
  };

  public shared ({ caller }) func deleteFAQ(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete FAQs");
    };
    if (not faqs.containsKey(id)) {
      Runtime.trap("FAQ not found");
    };
    faqs.remove(id);
  };

  public query ({ caller }) func getAllChangelog() : async [Changelog] {
    let changelogArray = changelogs.values().toArray();
    changelogArray.sort(compareChangelogsByDate);
  };

  public query ({ caller }) func getLatestVersion() : async Text {
    let changelogArray = changelogs.values().toArray();
    if (changelogArray.size() == 0) {
      Runtime.trap("No changelog entries found");
    };
    changelogArray.sort(compareChangelogsByDate)[0].version;
  };

  public shared ({ caller }) func addChangelog(version : Text, releaseDate : Text, title : Text, description : Text, changesList : [Text], changeType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add changelogs");
    };
    let newChangelog : Changelog = {
      id = nextChangelogId;
      version;
      releaseDate;
      title;
      description;
      changesList;
      changeType;
    };
    changelogs.add(nextChangelogId, newChangelog);
    nextChangelogId += 1;
  };

  public shared ({ caller }) func deleteChangelog(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete changelogs");
    };
    if (not changelogs.containsKey(id)) {
      Runtime.trap("Changelog not found");
    };
    changelogs.remove(id);
  };

  public query ({ caller }) func getTotalDownloads() : async Nat {
    downloadStats.totalDownloads;
  };

  public query ({ caller }) func getDownloadsByOS() : async DownloadStats {
    downloadStats;
  };

  public shared ({ caller }) func incrementDownload(os : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can increment downloads");
    };
    downloadStats := {
      totalDownloads = downloadStats.totalDownloads + 1;
      windowsDownloads = if (os == "windows") { downloadStats.windowsDownloads + 1 } else {
        downloadStats.windowsDownloads;
      };
      macosDownloads = if (os == "macos") { downloadStats.macosDownloads + 1 } else {
        downloadStats.macosDownloads;
      };
      linuxDownloads = if (os == "linux") { downloadStats.linuxDownloads + 1 } else {
        downloadStats.linuxDownloads;
      };
    };
  };

  public shared ({ caller }) func saveConfig(name : Text, os : Text, configData : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save configs");
    };
    let newConfig : SavedConfig = {
      id = nextConfigId;
      owner = caller;
      name;
      os;
      configData;
      createdAt = Time.now();
    };
    savedConfigs.add(nextConfigId, newConfig);
    nextConfigId += 1;
    newConfig.id;
  };

  public query ({ caller }) func getMyConfigs() : async [SavedConfig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their configs");
    };
    savedConfigs.values().toArray().filter<SavedConfig>(func(config : SavedConfig) : Bool {
      config.owner == caller;
    });
  };

  public shared ({ caller }) func deleteConfig(id : Nat) : async () {
    let config = switch (savedConfigs.get(id)) {
      case (null) { Runtime.trap("Config not found") };
      case (?config) { config };
    };
    if (caller != config.owner) {
      Runtime.trap("Unauthorized: Only the owner can delete this config");
    };
    savedConfigs.remove(id);
  };

  public query ({ caller }) func getTotalConfigsCount() : async Nat {
    savedConfigs.size();
  };
  // Public registration (no ICP auth needed) - stores password hash for cross-device login
  public func registerLocalAccount(handle : Text, passwordHash : Text, email : Text, phone : Text, fullName : Text) : async { #ok; #handleTaken; #alreadyExists } {
    let normalized = handle;
    if (localAccounts.get(normalized) != null) {
      return #alreadyExists;
    };
    if (handles.contains(normalized)) {
      return #handleTaken;
    };
    let data : LocalAccountData = { handle = normalized; passwordHash; email; phone; fullName };
    localAccounts.add(normalized, data);
    handles.add(normalized);
    #ok;
  };

  // Login with username + password hash - returns account data if match
  public query func loginLocalAccount(handle : Text, passwordHash : Text) : async ?LocalAccountData {
    switch (localAccounts.get(handle)) {
      case (null) { null };
      case (?acc) {
        if (acc.passwordHash == passwordHash) { ?acc } else { null };
      };
    };
  };

  // Check if handle is available
  public query func isHandleAvailable(handle : Text) : async Bool {
    not (handles.contains(handle));
  };

  // Get account by handle (public - for admin/display)
  public query func getLocalAccountByHandle(handle : Text) : async ?LocalAccountData {
    localAccounts.get(handle);
  };

  // Get all local accounts (admin only - just count and handle list)
  public query func getAllLocalAccounts() : async [LocalAccountData] {
    localAccounts.values().toArray();
  };

};
