import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Preloader from './components/Preloader';

// Import Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Service from './pages/Service';
import Membership from './pages/Membership';
import MembershipPlans from './pages/MembershipPlans';
import MembershipBenefits from './pages/MembershipBenefits';
import MemberDirectory from './pages/MemberDirectory';
import MembershipApply from './pages/MembershipApply';
import MembershipOnboarding from './pages/MembershipOnboarding';
import BusinessMembershipOnboarding from './pages/BusinessMembershipOnboarding';
import LeadershipPositionOnboarding from './pages/LeadershipPositionOnboarding';
import MembershipFAQs from './pages/MembershipFAQs';
import MembershipTerms from './pages/MembershipTerms';
import Sectors from './pages/Sectors';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Register from './pages/Register';
import TradeInvestment from './pages/TradeInvestment';
import Delegations from './pages/Delegations';
import DelegationsEvents from './pages/DelegationsEvents';
import StrategicPartnerships from './pages/StrategicPartnerships';
import GlobalPositioning from './pages/GlobalPositioning';
import ProjectsExecution from './pages/ProjectsExecution';
import ContentManagement from './pages/ContentManagement';
import DataSynchronization from './pages/DataSynchronization';
import EventProcessing from './pages/EventProcessing';
import MissionVision from './pages/MissionVision';
import Team from './pages/Team';
import FAQ from './pages/FAQ';
import Error404 from './pages/Error404';
import Leadership from './pages/Leadership';
import AdvisoryCouncil from './pages/AdvisoryCouncil';

export default function App() {
  return (
    <>
      <Preloader />
      <Routes>
        {/* Global layout with common Header, Footer, and Cursors */}
        <Route path="/" element={<Layout />}>
          {/* Page Routes */}
          <Route index element={<Home />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="about-us/leadership" element={<Leadership />} />
          <Route path="about-us/advisory-council" element={<AdvisoryCouncil />} />
          <Route path="contact-us" element={<ContactUs />} />
          
          {/* Membership Nested Routes */}
          <Route path="membership">
            <Route index element={<Membership />} />
            <Route path="plans" element={<MembershipPlans />} />
            <Route path="benefits" element={<MembershipBenefits />} />
            <Route path="member-directory" element={<MemberDirectory />} />
            <Route path="apply" element={<MembershipApply />} />
            <Route path="onboarding" element={<MembershipOnboarding />} />
            <Route path="business-onboarding" element={<BusinessMembershipOnboarding />} />
            <Route path="leadership-onboarding" element={<LeadershipPositionOnboarding />} />
            <Route path="faqs" element={<MembershipFAQs />} />
            <Route path="membership-terms" element={<MembershipTerms />} />
          </Route>

          {/* Dedicated Onboarding Top-Level Routes & Aliases */}
          <Route path="onboarding">
            <Route index element={<MembershipOnboarding />} />
            <Route path="business" element={<BusinessMembershipOnboarding />} />
            <Route path="leadership" element={<LeadershipPositionOnboarding />} />
            <Route path="business-membership" element={<BusinessMembershipOnboarding />} />
            <Route path="business-onboarding" element={<BusinessMembershipOnboarding />} />
            <Route path="leadership-position" element={<LeadershipPositionOnboarding />} />
            <Route path="leadership-onboarding" element={<LeadershipPositionOnboarding />} />
          </Route>
          <Route path="business-onboarding" element={<BusinessMembershipOnboarding />} />
          <Route path="leadership-onboarding" element={<LeadershipPositionOnboarding />} />
          <Route path="business-membership-onboarding" element={<BusinessMembershipOnboarding />} />
          <Route path="leadership-position-onboarding" element={<LeadershipPositionOnboarding />} />

          {/* Redirects for legacy routes to prevent broken bookmarks */}
          <Route path="members" element={<Navigate to="/membership/member-directory" replace />} />
          <Route path="membership-terms" element={<Navigate to="/membership/membership-terms" replace />} />
          <Route path="membership-benefits" element={<Navigate to="/membership/benefits" replace />} />
          <Route path="membership-tiers" element={<Navigate to="/membership/plans" replace />} />
          <Route path="membership-resources" element={<Navigate to="/membership" replace />} />
          <Route path="membership-inquiry" element={<Navigate to="/membership/apply" replace />} />
          <Route path="delegations-events" element={<DelegationsEvents />} />
          <Route path="sectors" element={<Sectors />} />
          <Route path="insights" element={<Insights />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="mission-vision-and-values" element={<MissionVision />} />
          <Route path="team" element={<Team />} />
          <Route path="faq" element={<FAQ />} />
          
          {/* Services Sub-Routes */}
          <Route path="services">
            <Route index element={<Service />} />
            <Route path="trade-investment-bridging" element={<TradeInvestment />} />
            <Route path="delegations" element={<Delegations />} />
            <Route path="strategic-partnerships" element={<StrategicPartnerships />} />
            <Route path="global-positioning" element={<GlobalPositioning />} />
            <Route path="projects-execution" element={<ProjectsExecution />} />
            <Route path="projects-initiatives" element={<ProjectsExecution />} />
            <Route path="content-management" element={<ContentManagement />} />
            <Route path="data-synchronization" element={<DataSynchronization />} />
            <Route path="event-processing" element={<EventProcessing />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </>
  );
}
