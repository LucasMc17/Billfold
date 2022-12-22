import React from 'react';

export default function LinkBankAccounts() {
  return (
    <>
      <div>
        <h1>Link a Bank Account to Billfold</h1>
        <h2>
          From here you can link a bank account to your Billfold account. After
          linking accounts, any purchases made with your bank account will
          automatically be logged into this Billfold account. You'll still need
          to categorize those purchases, but it takes a lot of the work out of
          keeping your Billfold account up to date! Billfold will not receive
          your bank account credentials or account balance.
        </h2>
        <h2>Select a Bank:</h2>
        <div id="oauth-list">
          <div className="bank">
            <h1>Chase</h1>
          </div>
        </div>
      </div>
    </>
  );
}
