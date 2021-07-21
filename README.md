# Payroll - Metamask App

You can use the current code version here: [Payroll-Metamask](https://payroll-metamask.herokuapp.com/).

## Description

This app let's you add invoices (as a Contractor) to your browser's LocalStorage (used LocalStorage for simplicity purposes), and then use the Employer's Portal to pay the different invoices that were submitted, by using your metamask accounts.

### Running
1. 
```
git clone https://github.com/nestorbe/payrollTS.git
```
2. 
```
yarn
```
3. 
```
yarn start
```

### Components
[Contractors](/src/containers/Contractors.tsx) - Simple component that handles every invoice that is going to be submitted to the app.  
[Employer](/src/containers/Employer.tsx) - Component that handles the payment of each invoice submitted by a contractor.
 

### Notes
This project is still in development, here are some things I would like to add in the future:

- User registration.
- Better design for the homepage with graphics and explanation of the app.
- Add a 'history' for paid invoices.
- Use another option different than localStorage to store the data.
