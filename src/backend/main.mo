import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Tender = {
    id : Nat;
    name : Text;
    department : Text;
    category : Text;
    location : Text;
    description : Text;
    budget : Text;
    deadline : Int;
    emd : Text;
    eligibility : Text;
    riskLevel : Text;
    riskReasons : [Text];
    summary : Text;
    relevanceTags : [Text];
    createdAt : Int;
  };

  module Tender {
    public func compare(t1 : Tender, t2 : Tender) : Order.Order {
      Nat.compare(t1.id, t2.id);
    };
  };

  public type UserProfile = {
    name : Text;
    company : Text;
    industry : Text;
    turnover : Text;
    experience : Nat;
    savedTenders : [Nat];
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let tenderStore = Map.empty<Nat, Tender>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func initializeSampleTenders() {
    let sampleTenders : [Tender] = [
      {
        id = 1;
        name = "IT Infrastructure Upgrade";
        department = "IT";
        category = "IT";
        location = "Mumbai";
        description = "Upgrade network and server infrastructure";
        budget = "₹10,000,000";
        deadline = Time.now() + 30 * 24 * 60 * 60 * 1000000000;
        emd = "₹500,000";
        eligibility = "5+ years IT experience";
        riskLevel = "HIGH";
        riskReasons = ["Complex project", "Tight timeline"];
        summary = "Major upgrade of IT infrastructure";
        relevanceTags = ["Network", "Servers", "IT"];
        createdAt = Time.now();
      },
      {
        id = 2;
        name = "Road Construction Delhi";
        department = "Infrastructure";
        category = "Construction";
        location = "Delhi";
        description = "Build new 6-lane highway";
        budget = "₹500,000,000";
        deadline = Time.now() + 45 * 24 * 60 * 60 * 1000000000;
        emd = "₹5,000,000";
        eligibility = "Major infrastructure experience";
        riskLevel = "HIGH";
        riskReasons = ["Large scale", "Environmental approvals"];
        summary = "New highway construction project";
        relevanceTags = ["Highway", "Roads", "Construction"];
        createdAt = Time.now();
      },
      {
        id = 3;
        name = "Hospital Equipment Procurement";
        department = "Healthcare";
        category = "Healthcare";
        location = "Bangalore";
        description = "Purchase advanced medical equipment";
        budget = "₹50,000,000";
        deadline = Time.now() + 60 * 24 * 60 * 60 * 1000000000;
        emd = "₹2,000,000";
        eligibility = "5+ years medical supply experience";
        riskLevel = "MEDIUM";
        riskReasons = ["Technology complexity"];
        summary = "Procurement of advanced medical equipment";
        relevanceTags = ["Medical", "Healthcare", "Equipment"];
        createdAt = Time.now();
      },
      {
        id = 4;
        name = "School Building Construction";
        department = "Education";
        category = "Construction";
        location = "Pune";
        description = "Construct new school building with modern facilities";
        budget = "₹75,000,000";
        deadline = Time.now() + 70 * 24 * 60 * 60 * 1000000000;
        emd = "₹3,000,000";
        eligibility = "Educational infrastructure experience";
        riskLevel = "MEDIUM";
        riskReasons = ["Safety standards", "Timeline constraints"];
        summary = "Construction of modern school building";
        relevanceTags = ["Education", "Construction", "Infrastructure"];
        createdAt = Time.now();
      },
      {
        id = 5;
        name = "Water Supply Pipeline Project";
        department = "Infrastructure";
        category = "Infrastructure";
        location = "Jaipur";
        description = "Install water supply pipelines across city";
        budget = "₹200,000,000";
        deadline = Time.now() + 85 * 24 * 60 * 60 * 1000000000;
        emd = "₹8,000,000";
        eligibility = "Water infrastructure experience";
        riskLevel = "HIGH";
        riskReasons = ["Complex logistics", "Urban disruption"];
        summary = "City-wide water pipeline installation";
        relevanceTags = ["Water", "Infrastructure", "Utilities"];
        createdAt = Time.now();
      },
      {
        id = 6;
        name = "E-Governance Platform Development";
        department = "IT";
        category = "IT";
        location = "Hyderabad";
        description = "Develop comprehensive e-governance platform";
        budget = "₹25,000,000";
        deadline = Time.now() + 50 * 24 * 60 * 60 * 1000000000;
        emd = "₹1,250,000";
        eligibility = "Government IT project experience";
        riskLevel = "MEDIUM";
        riskReasons = ["Integration complexity"];
        summary = "E-governance platform development";
        relevanceTags = ["E-Governance", "IT", "Software"];
        createdAt = Time.now();
      },
      {
        id = 7;
        name = "Medical College Equipment Supply";
        department = "Healthcare";
        category = "Healthcare";
        location = "Chennai";
        description = "Supply medical equipment for new medical college";
        budget = "₹100,000,000";
        deadline = Time.now() + 65 * 24 * 60 * 60 * 1000000000;
        emd = "₹5,000,000";
        eligibility = "Medical equipment supply experience";
        riskLevel = "LOW";
        riskReasons = [];
        summary = "Medical equipment supply for college";
        relevanceTags = ["Medical", "Healthcare", "Education"];
        createdAt = Time.now();
      },
      {
        id = 8;
        name = "Smart City Infrastructure";
        department = "Infrastructure";
        category = "Infrastructure";
        location = "Surat";
        description = "Implement smart city infrastructure solutions";
        budget = "₹350,000,000";
        deadline = Time.now() + 90 * 24 * 60 * 60 * 1000000000;
        emd = "₹15,000,000";
        eligibility = "Smart city project experience";
        riskLevel = "HIGH";
        riskReasons = ["Technology integration", "Large scale"];
        summary = "Smart city infrastructure implementation";
        relevanceTags = ["Smart City", "Infrastructure", "Technology"];
        createdAt = Time.now();
      },
      {
        id = 9;
        name = "University Library Digitization";
        department = "Education";
        category = "IT";
        location = "Kolkata";
        description = "Digitize university library resources";
        budget = "₹15,000,000";
        deadline = Time.now() + 40 * 24 * 60 * 60 * 1000000000;
        emd = "₹750,000";
        eligibility = "Digital archiving experience";
        riskLevel = "LOW";
        riskReasons = [];
        summary = "Library digitization project";
        relevanceTags = ["Education", "IT", "Digital"];
        createdAt = Time.now();
      },
      {
        id = 10;
        name = "Bridge Construction Project";
        department = "Infrastructure";
        category = "Construction";
        location = "Lucknow";
        description = "Construct new bridge over river";
        budget = "₹400,000,000";
        deadline = Time.now() + 80 * 24 * 60 * 60 * 1000000000;
        emd = "₹20,000,000";
        eligibility = "Major bridge construction experience";
        riskLevel = "HIGH";
        riskReasons = ["Engineering complexity", "Environmental impact"];
        summary = "Major bridge construction";
        relevanceTags = ["Bridge", "Construction", "Infrastructure"];
        createdAt = Time.now();
      },
      {
        id = 11;
        name = "Primary Healthcare Centers Setup";
        department = "Healthcare";
        category = "Healthcare";
        location = "Bhopal";
        description = "Establish primary healthcare centers in rural areas";
        budget = "₹60,000,000";
        deadline = Time.now() + 55 * 24 * 60 * 60 * 1000000000;
        emd = "₹3,000,000";
        eligibility = "Healthcare infrastructure experience";
        riskLevel = "MEDIUM";
        riskReasons = ["Rural logistics"];
        summary = "Rural healthcare center establishment";
        relevanceTags = ["Healthcare", "Rural", "Infrastructure"];
        createdAt = Time.now();
      },
      {
        id = 12;
        name = "Cybersecurity Infrastructure";
        department = "IT";
        category = "IT";
        location = "Noida";
        description = "Implement comprehensive cybersecurity infrastructure";
        budget = "₹30,000,000";
        deadline = Time.now() + 35 * 24 * 60 * 60 * 1000000000;
        emd = "₹1,500,000";
        eligibility = "Cybersecurity expertise required";
        riskLevel = "HIGH";
        riskReasons = ["Security criticality", "Complexity"];
        summary = "Cybersecurity infrastructure implementation";
        relevanceTags = ["Cybersecurity", "IT", "Security"];
        createdAt = Time.now();
      },
      {
        id = 13;
        name = "Vocational Training Center Construction";
        department = "Education";
        category = "Construction";
        location = "Indore";
        description = "Build vocational training centers";
        budget = "₹45,000,000";
        deadline = Time.now() + 75 * 24 * 60 * 60 * 1000000000;
        emd = "₹2,250,000";
        eligibility = "Educational construction experience";
        riskLevel = "LOW";
        riskReasons = [];
        summary = "Vocational training center construction";
        relevanceTags = ["Education", "Construction", "Training"];
        createdAt = Time.now();
      },
      {
        id = 14;
        name = "Renewable Energy Solutions";
        department = "Infrastructure";
        category = "Infrastructure";
        location = "Nagpur";
        description = "Implement renewable energy systems for public buildings";
        budget = "₹80,000,000";
        deadline = Time.now() + 80 * 24 * 60 * 60 * 1000000000;
        emd = "₹2,800,000";
        eligibility = "Proven renewable energy experience";
        riskLevel = "MEDIUM";
        riskReasons = ["Technological requirements"];
        summary = "Implementation of renewable energy solutions";
        relevanceTags = ["Renewable Energy", "Green Technology", "Infrastructure"];
        createdAt = Time.now();
      },
      {
        id = 15;
        name = "Expansion of Public Transportation Network";
        department = "Municipal";
        category = "Infrastructure";
        location = "Ahmedabad";
        description = "Expand public transportation network";
        budget = "₹300,000,000";
        deadline = Time.now() + 90 * 24 * 60 * 60 * 1000000000;
        emd = "₹9,000,000";
        eligibility = "Experience with large-scale transportation projects";
        riskLevel = "HIGH";
        riskReasons = ["Scale and logistics"];
        summary = "Expansion of public transportation network";
        relevanceTags = ["Public Transport", "Urban Development", "Infrastructure"];
        createdAt = Time.now();
      },
    ];

    for (tender in sampleTenders.values()) {
      tenderStore.add(tender.id, tender);
    };
  };

  // Initialize sample tenders on actor creation
  initializeSampleTenders();

  // Public read functions - no authorization needed (accessible to all including guests)
  public query func getTenders() : async [Tender] {
    tenderStore.values().toArray().sort();
  };

  public query func getTenderById(id : Nat) : async ?Tender {
    tenderStore.get(id);
  };

  public query func getAnalytics() : async {
    departmentCounts : [(Text, Nat)];
    categoryCounts : [(Text, Nat)];
    totalTenders : Nat;
    highRiskCount : Nat;
    mediumRiskCount : Nat;
    lowRiskCount : Nat;
  } {
    var highRisk = 0;
    var mediumRisk = 0;
    var lowRisk = 0;
    let departmentCountMap = Map.empty<Text, Nat>();
    let categoryCountMap = Map.empty<Text, Nat>();

    for (tender in tenderStore.values()) {
      if (tender.riskLevel == "HIGH") {
        highRisk += 1;
      } else if (tender.riskLevel == "MEDIUM") {
        mediumRisk += 1;
      } else if (tender.riskLevel == "LOW") {
        lowRisk += 1;
      };

      let currentDepartmentCount = switch (departmentCountMap.get(tender.department)) {
        case (?count) { count + 1 };
        case (null) { 1 };
      };
      departmentCountMap.add(tender.department, currentDepartmentCount);

      let currentCategoryCount = switch (categoryCountMap.get(tender.category)) {
        case (?count) { count + 1 };
        case (null) { 1 };
      };
      categoryCountMap.add(tender.category, currentCategoryCount);
    };

    {
      departmentCounts = departmentCountMap.entries().toArray();
      categoryCounts = categoryCountMap.entries().toArray();
      totalTenders = tenderStore.size();
      highRiskCount = highRisk;
      mediumRiskCount = mediumRisk;
      lowRiskCount = lowRisk;
    };
  };

  // User profile management - requires user authentication
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  public shared ({ caller }) func updateUserProfile(name : Text, company : Text, industry : Text, turnover : Text, experience : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let existingSavedTenders = switch (userProfiles.get(caller)) {
      case (?profile) { profile.savedTenders };
      case (null) { [] };
    };

    let newProfile : UserProfile = {
      name;
      company;
      industry;
      turnover;
      experience;
      savedTenders = existingSavedTenders;
    };
    userProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func saveTender(tenderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save tenders");
    };

    if (not tenderStore.containsKey(tenderId)) {
      Runtime.trap("Tender does not exist");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) {
        // Check if tender is already saved
        let alreadySaved = profile.savedTenders.find(func(id) { id == tenderId });
        if (alreadySaved == null) {
          let updatedSavedTenders = profile.savedTenders.concat([tenderId]);
          let updatedProfile : UserProfile = {
            name = profile.name;
            company = profile.company;
            industry = profile.industry;
            turnover = profile.turnover;
            experience = profile.experience;
            savedTenders = updatedSavedTenders;
          };
          userProfiles.add(caller, updatedProfile);
        };
      };
      case (null) { Runtime.trap("Profile does not exist. Please create a profile first.") };
    };
  };

  public shared ({ caller }) func unsaveTender(tenderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unsave tenders");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) {
        let updatedSavedTenders = profile.savedTenders.filter(func(id) { id != tenderId });
        let updatedProfile : UserProfile = {
          name = profile.name;
          company = profile.company;
          industry = profile.industry;
          turnover = profile.turnover;
          experience = profile.experience;
          savedTenders = updatedSavedTenders;
        };
        userProfiles.add(caller, updatedProfile);
      };
      case (null) { Runtime.trap("Profile does not exist") };
    };
  };

  public query ({ caller }) func getSavedTenders() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view saved tenders");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) { profile.savedTenders };
      case (null) { [] };
    };
  };
};
