import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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
    changeType : Text; // "major", "minor", "patch"
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

  var nextFAQId = 7;
  var nextChangelogId = 5;
  var nextConfigId = 1;
  var nextMembershipId = 1;

  // Helper for sorting changelogs by release date
  func compareChangelogsByDate(a : Changelog, b : Changelog) : Order.Order {
    b.releaseDate.compare(a.releaseDate);
  };

  // Helper for sorting leaderboard entries by tokens (descending)
  func compareLeaderboardEntries(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
    Nat.compare(b.tokens, a.tokens);
  };

  // Seed data initialization in constructor
  do {
    // Seed FAQ data
    faqs.add(
      1,
      {
        id = 1;
        question = "How do I install OpenClaw on Windows?";
        answer = "Download the installer from our website and follow the step-by-step instructions.";
        category = "Windows";
      },
    );
    faqs.add(
      2,
      {
        id = 2;
        question = "Is OpenClaw compatible with macOS?";
        answer = "Yes, OpenClaw supports macOS. Get the DMG file from our downloads page.";
        category = "macOS";
      },
    );
    faqs.add(
      3,
      {
        id = 3;
        question = "Are there any known Linux issues?";
        answer = "Some Linux users may experience compatibility issues. Check our support forum for solutions.";
        category = "Linux";
      },
    );
    faqs.add(
      4,
      {
        id = 4;
        question = "What are the system requirements?";
        answer = "OpenClaw requires at least 4GB RAM and 2GHz CPU on all platforms.";
        category = "General";
      },
    );
    faqs.add(
      5,
      {
        id = 5;
        question = "How can I upgrade to the latest version?";
        answer = "Simply download the new version and run the installer. Your settings will be preserved.";
        category = "General";
      },
    );
    faqs.add(
      6,
      {
        id = 6;
        question = "Where can I find user guides?";
        answer = "User guides and tutorials are available on our website under the Support section.";
        category = "Support";
      },
    );

    // Seed changelog data
    changelogs.add(
      1,
      {
        id = 1;
        version = "2.5.0";
        releaseDate = "2024-06-01";
        title = "Major Feature Update";
        description = "Introduces new features and improvements.";
        changesList = [
          "Added support for high-resolution textures.",
          "Improved performance on older hardware.",
          "Fixed crash bug on startup.",
        ];
        changeType = "major";
      },
    );
    changelogs.add(
      2,
      {
        id = 2;
        version = "2.4.1";
        releaseDate = "2024-04-15";
        title = "Minor Patch";
        description = "Bug fixes and minor improvements.";
        changesList = [
          "Fixed audio sync issue.",
          "Improved keyboard mapping support.",
        ];
        changeType = "patch";
      },
    );
    changelogs.add(
      3,
      {
        id = 3;
        version = "2.3.0";
        releaseDate = "2024-03-10";
        title = "Enhanced Compatibility";
        description = "Focus on compatibility and stability.";
        changesList = [
          "Added support for macOS M1 chip.",
          "Improved Linux compatibility.",
          "Fixed crash on startup.",
        ];
        changeType = "minor";
      },
    );
    changelogs.add(
      4,
      {
        id = 4;
        version = "2.2.0";
        releaseDate = "2024-01-05";
        title = "Initial Release";
        description = "First public release of OpenClaw.";
        changesList = [
          "Basic features implemented.",
          "Support for Windows, macOS, and Linux.",
          "Initial user interface design.",
        ];
        changeType = "major";
      },
    );
  };

  // Helper function to get token count for a tier
  func tierTokens(tier : MembershipTier) : Nat {
    switch (tier) {
      case (#silver) { 999 };
      case (#gold) { 2_999 };
      case (#platinum) { 7_999 };
    };
  };

  // Calculate (or update) leaderboard
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
        rank = 0; // Will be assigned after sorting
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

    // Assign ranks and return top 50
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

  // Get caller's leaderboard rank
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
        rank = 0; // Will be assigned after sorting
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

    // Assign ranks
    var currentRank = 1;
    let rankedArray = sortedArray.map(
      func(entry) {
        let rankedEntry = { entry with rank = currentRank };
        currentRank += 1;
        rankedEntry;
      }
    );

    // Find the entry matching caller's principal
    rankedArray.find(func(entry) { entry.principal == caller });
  };

  // Get static top reward definitions
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

  // User Profile Operations
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

  // ChatbotConfig Operations
  public shared ({ caller }) func saveChatbotConfig(phoneNumber : Text, enabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save chatbot configs");
    };

    // Check if user has a valid membership record
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

  // Membership Operations
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

  // FAQ Operations
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

  // Changelog Operations
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

  // Download Stats Operations
  public query ({ caller }) func getTotalDownloads() : async Nat {
    downloadStats.totalDownloads;
  };

  public query ({ caller }) func getDownloadsByOS() : async DownloadStats {
    downloadStats;
  };

  public shared ({ caller }) func incrementDownload(os : Text) : async () {
    // Authorization: Require at least user role to prevent abuse of download statistics
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

  // Saved Configs Operations
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
};
