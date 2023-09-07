// backend/app.ts
import express, { Request, Response } from 'express';
import Web3 from 'web3';
import EscrowContract from './contracts/Escrow.json';

const app = express();
const port = 3000;

const web3 = new Web3('http://localhost:8545'); // Replace with your Ethereum node URL
const escrowContract = new web3.eth.Contract(
  EscrowContract.abi as any,
  'YOUR_CONTRACT_ADDRESS' // Replace with your contract address
);

app.use(express.json());

app.post('/create-escrow', async (req: Request, res: Response) => {
  const { seller, arbiter } = req.body;

  const accounts = await web3.eth.getAccounts();

  const escrow = await escrowContract
    .deploy({
      data: EscrowContract.bytecode,
      arguments: [seller, arbiter],
    })
    .send({
      from: accounts[0],
      gas: 4712388, // Set an appropriate gas limit
    });

  res.json({ escrowAddress: escrow.options.address });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
