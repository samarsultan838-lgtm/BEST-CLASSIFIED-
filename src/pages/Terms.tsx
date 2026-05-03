import React from "react";
import LegalPage from "./LegalPage";

export default function TermsPage() {
  return (
    <LegalPage 
      title="Terms of Engagement"
      content={
        <>
          <h2>1. Merchant Responsibilities</h2>
          <p>
            By accessing the Trazot marketplace, you agree to provide authentic inventory data. Ghost listings or 
            counterfeit intelligence will result in immediate permanent suspension of your merchant ID.
          </p>

          <h2>2. Transactional Protocols</h2>
          <p>
            Trazot provides the platform for intelligence exchange. Final physical verification of items and 
            monetary exchange is the sole responsibility of the engaging parties.
          </p>

          <h2>3. Content Rights</h2>
          <p>
            You grant Trazot a non-exclusive license to display your inventory images for the purpose of 
            facilitating sales. We do not claim ownership of your intellectual property.
          </p>

          <h2>4. Global Restrictions</h2>
          <p>
            Users must be of legal age (18+) to conduct trades within the network. Any activity violating local 
            jurisdictional laws will be reported to the respective authorities.
          </p>
        </>
      }
    />
  );
}
