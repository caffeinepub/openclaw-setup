import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Old types
  type OldFAQ = {
    id : Nat;
    question : Text;
    answer : Text;
    category : Text;
  };

  type OldChangelog = {
    id : Nat;
    version : Text;
    releaseDate : Text;
    title : Text;
    description : Text;
    changesList : [Text];
    changeType : Text;
  };

  type OldDownloadStats = {
    totalDownloads : Nat;
    windowsDownloads : Nat;
    macosDownloads : Nat;
    linuxDownloads : Nat;
  };

  type OldSavedConfig = {
    id : Nat;
    owner : Principal;
    name : Text;
    os : Text;
    configData : Text;
    createdAt : Int;
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    faqs : Map.Map<Nat, OldFAQ>;
    changelogs : Map.Map<Nat, OldChangelog>;
    downloadStats : OldDownloadStats;
    savedConfigs : Map.Map<Nat, OldSavedConfig>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextFAQId : Nat;
    nextChangelogId : Nat;
    nextConfigId : Nat;
  };

  // New types for actor after membership changes
  type MembershipTier = {
    #silver;
    #gold;
    #platinum;
  };

  type MembershipRecord = {
    id : Nat;
    owner : Principal;
    tier : MembershipTier;
    purchasedAt : Int;
  };

  type NewActor = {
    faqs : Map.Map<Nat, OldFAQ>;
    changelogs : Map.Map<Nat, OldChangelog>;
    downloadStats : OldDownloadStats;
    savedConfigs : Map.Map<Nat, OldSavedConfig>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    userMemberships : Map.Map<Principal, MembershipRecord>;
    nextFAQId : Nat;
    nextChangelogId : Nat;
    nextConfigId : Nat;
    nextMembershipId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      userMemberships = Map.empty<Principal, MembershipRecord>();
      nextMembershipId = 1;
    };
  };
}
