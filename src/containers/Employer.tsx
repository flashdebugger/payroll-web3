import React, { Component } from 'react';
//Web3 import
import { web3 } from "../services"
//Material-UI imports
import { Box, Button, Chip, CardContent, Typography } from '@material-ui/core';
import { StyledCard, StyledAlert, StyledCircular } from '../styles/Styles'

//Interfaces init
interface Invoice {
  id: number,
  address: string,
  date: string,
  amount: string,
  reason: string,
  paid: boolean,
}

interface Props {
}

interface State {
  message: string,
  paying: boolean,
  errorMessage: string,
  invoices: Invoice[],
  lastPayment: any,
}

//global var declaration
declare let window: any;
let timeoutID: any;
let timeoutID2: any;

class Employer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      message: '',
      paying: false,
      errorMessage: '',
      invoices: JSON.parse(window.localStorage.getItem('invoices')),
      lastPayment: JSON.parse(window.localStorage.getItem('lastPayment')),
    };
  }

  componentWillMount() {
     if(this.state.lastPayment !== null) {
       this.setState({ paying: true })
       const checkReceipt = (): void => {
         timeoutID2 = setTimeout(() => {
           this.checkReceipt();
         }, 30000);
       }
       checkReceipt();
     }
  }

  //This function checks if there were any pending transactions and user interrupted app.
  checkReceipt = async () => {
    const invoiceToPay: Invoice = this.state.invoices[this.state.lastPayment.invoiceId];
    let receipt: any;
    await web3.eth.getTransactionReceipt(this.state.lastPayment.hash.toString(),
      function(error, payment) {
        if(payment !== null) {
          receipt = payment.status;
        }
      });
    if(receipt === true) {
        invoiceToPay.paid = true;
        window.localStorage.setItem('invoices', JSON.stringify(this.state.invoices));
        this.setState({ paying: false,
                        message: 'Your pending transaction has been submitted!',
                        invoices: JSON.parse(window.localStorage.getItem('invoices')),
                        lastPayment: JSON.parse(window.localStorage.getItem('lastPayment')) });
        window.localStorage.removeItem('lastPayment');
        const updateMessage = (): void => {
          timeoutID = setTimeout(() => {
            this.setState({ message: '' });
          }, 5000);
        }
        updateMessage();
      } else {
        this.setState({ paying: false,
                        errorMessage: `Your pending transaction couldn't be processed`, });
        window.localStorage.removeItem('lastPayment');
        const updateMessage = (): void => {
          timeoutID = setTimeout(() => {
            this.setState({ errorMessage: '' });
          }, 5000);
        }
        updateMessage();
      }
  }

  //Pay an invoice using Metamask and then setting invoice as PAID
  handlePay = async (id: number) => {
    //instantiate the invoice object
    const invoiceToPay: Invoice = this.state.invoices[id];
    this.setState({ paying: true, errorMessage: '', });
    //send metamask transaction
    try {
      await web3.eth.sendTransaction({
          to: invoiceToPay.address,
          from: web3.givenProvider.selectedAddress,
          value: web3.utils.toWei(invoiceToPay.amount, 'ether'),
      }, function(error, hash){
        //callback function to get the Metamask transaction hash (in case user interrupts app).
        let pendingTransaction: any = { hash: hash, invoiceId: id }
        window.localStorage.setItem('lastPayment', JSON.stringify(pendingTransaction));
      })
      //set invoice paid flag to true
      invoiceToPay.paid = true;
      //update the localStorage array
      window.localStorage.setItem('invoices', JSON.stringify(this.state.invoices));
      window.localStorage.removeItem('lastPayment');
      //set success message
      this.setState({ message: 'Invoice paid succesfully!', paying: false });
      //delay for success message to update
      const updateMessage = (): void => {
        timeoutID = setTimeout(() => {
          this.setState({ message: '' });
        }, 5000);
      }
      updateMessage();

    } catch (err) {
      this.setState({ errorMessage: err.message, paying: false });
    }

  };

  //Render cards with invoices information method
  renderInvoices() {
    return (
      <div>
        {this.state.invoices.map(invoice => (
          <StyledCard key={invoice.id}>
            <CardContent>
              <Typography color="textPrimary">
                Invoice#{invoice.id}
              </Typography>
              <Typography color="textSecondary">
                date: {invoice.date}
              </Typography>
              <Typography color="textSecondary">
                address: {invoice.address}
              </Typography>
              <Typography color="textSecondary">
                amount owed: {invoice.amount} ether.
              </Typography>
              <Typography color="textSecondary">
                reason: {invoice.reason}
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center">
                {invoice.paid === false ?
                <Button variant="contained" color="secondary" onClick={() => this.handlePay(invoice.id)}>pay invoice</Button> :
                <Button variant="contained" disabled>paid</Button> }
              </Box>
            </CardContent>
          </StyledCard>
        ))}
      </div>
    );
  }

  componentWillUnmount() {
    clearTimeout(timeoutID);
    clearTimeout(timeoutID2);
  }

  render() {
    return (
      <div>
        <Chip label="Employer Portal" color="secondary" />
        <hr />
        {this.state.invoices !== null ? this.renderInvoices() : <Box display="flex" alignItems="center" justifyContent="center">
        <StyledAlert severity="warning">There are no invoices to review!</StyledAlert> </Box>}
        <br></br>
        <Box display="flex"
             alignItems="center"
             justifyContent="center">
          {this.state.paying === false ?
            null :
            <div>
              <StyledCircular color="secondary" />
              <Typography>Processing payment...</Typography>
              <div>
                <Typography variant="caption" color="textSecondary">(Please do not refresh or close your browser window.)</Typography>
              </div>
            </div> }
          {this.state.errorMessage !== '' ? <StyledAlert severity="error">{this.state.errorMessage}</StyledAlert> : null}
          {this.state.message !== '' ? <StyledAlert severity="success">{this.state.message}</StyledAlert> : null}
        </Box>
      </div>
    );
  }
}

export default Employer;
