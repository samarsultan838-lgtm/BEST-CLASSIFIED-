import React from "react";
import LegalPage from "./LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage 
      title="Privacy Protocol"
      content={
        <>
          <h2>1. Data Collection Invariants</h2>
          <p>
            Trazot Elite Marketplace ("Trazot") operates on a zero-vulnerability data principle. We collect only the essential 
            merchant intelligence required to facilitate secure transactions: identification, location telemetry for items, 
            and verified communication channels.
          </p>

          <h2>2. Third-Party Integration</h2>
          <p>
            When you authenticate via Google or Github, we receive high-security auth tokens. We never store raw passwords 
            on our primary servers. Your financial information is handled exclusively by encrypted payment processors.
          </p>

          <h2>3. Cookies & Tracking</h2>
          <p>
            We deploy session trackers to maintain your authenticated state across the command center. No shadow tracking 
            is permitted within the Trazot ecosystem.
          </p>

          <h2>4. Right to Termination</h2>
          <p>
            You maintain the absolute right to purge your metadata from our system. Upon termination request, all merchant 
            records are wiped from our active databases within 72 hours.
          </p>
        </>
      }
    />
  );
}
