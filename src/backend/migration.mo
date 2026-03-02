import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    faqs : Map.Map<Nat, { id : Nat; question : Text; answer : Text; category : Text }>;
    changelogs : Map.Map<Nat, { id : Nat; version : Text; releaseDate : Text; title : Text; description : Text; changesList : [Text]; changeType : Text }>;
    downloadStats : { totalDownloads : Nat; windowsDownloads : Nat; macosDownloads : Nat; linuxDownloads : Nat };
    savedConfigs : Map.Map<Nat, { id : Nat; owner : Principal; name : Text; os : Text; configData : Text; createdAt : Int }>;
    userMemberships : Map.Map<Principal, { id : Nat; owner : Principal; tier : { #silver; #gold; #platinum }; purchasedAt : Int }>;
    userProfiles : Map.Map<Principal, { name : Text; bio : ?Text }>;
    userChatbotConfigs : Map.Map<Principal, { phoneNumber : Text; enabled : Bool }>;
    nextFAQId : Nat;
    nextChangelogId : Nat;
    nextConfigId : Nat;
    nextMembershipId : Nat;
  };

  type NewActor = {
    faqs : Map.Map<Nat, { id : Nat; question : Text; answer : Text; category : Text }>;
    changelogs : Map.Map<Nat, { id : Nat; version : Text; releaseDate : Text; title : Text; description : Text; changesList : [Text]; changeType : Text }>;
    downloadStats : { totalDownloads : Nat; windowsDownloads : Nat; macosDownloads : Nat; linuxDownloads : Nat };
    savedConfigs : Map.Map<Nat, { id : Nat; owner : Principal; name : Text; os : Text; configData : Text; createdAt : Int }>;
    userMemberships : Map.Map<Principal, { id : Nat; owner : Principal; tier : { #silver; #gold; #platinum }; purchasedAt : Int }>;
    userProfiles : Map.Map<Principal, { name : Text; bio : ?Text }>;
    userChatbotConfigs : Map.Map<Principal, { phoneNumber : Text; enabled : Bool }>;
    claimedRewards : Map.Map<Principal, [{ rank : Nat; claimedAt : Int; bonusTokens : Nat; badge : Text; title : Text }]>;
    nextFAQId : Nat;
    nextChangelogId : Nat;
    nextConfigId : Nat;
    nextMembershipId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      claimedRewards = Map.empty<Principal, [{ rank : Nat; claimedAt : Int; bonusTokens : Nat; badge : Text; title : Text }]>()
    };
  };
};
