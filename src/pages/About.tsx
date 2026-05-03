import React from "react";
import LegalPage from "./LegalPage";

export default function AboutPage() {
  return (
    <LegalPage 
      title="Our History"
      content={
        <>
          <h2>The Trazot Mission</h2>
          <p>
            Established in 2025, Trazot was designed with a single, uncompromising goal: to create the most secure and 
            technologically advanced marketplace in the region. We believe that buying and selling shouldn't just be 
            convenient—it should be bulletproof.
          </p>

          <h2>Elite Verification</h2>
          <p>
            Every merchant on our platform goes through a rigorous vetting process. From biometric data verification 
            to historical trade analysis, we ensure that you are only interacting with the most trusted individuals in 
            the marketplace.
          </p>

          <h2>Technological Edge</h2>
          <p>
            By leveraging high-speed indexing, advanced geographic telemetry, and distributed ledger security, we provide 
            a platform that scales with the speed of modern commerce.
          </p>

          <h2>Global Standards, Local Expertise</h2>
          <p>
            While we target global high-end standards, we remain deeply rooted in understanding the unique nuances of 
            the local market. Trazot is not just a marketplace; it's a movement towards more transparent, 
            data-driven trade.
          </p>
        </>
      }
    />
  );
}
