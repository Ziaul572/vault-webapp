# VAULT – Online Banking Web Application

VAULT is a web-based banking system developed using Django.  
The application allows users to manage bank accounts, perform transactions, apply for loans, and monitor their financial activity through a dashboard.

This project was developed as part of a Web Application Development assignment.

---

## Features

### User Authentication
- User registration and login
- Session-based authentication
- Secure logout

### Account Management
- Create multiple bank accounts
- View account balances
- Account overview dashboard

### Transactions
- Transfer money between accounts
- Deposit funds
- Withdraw funds
- Transaction history tracking

### Loan System
- Apply for different loan types
- View loan applications
- Loan status tracking (Pending)

### User Profile
- Edit personal information
- Upload profile picture
- View account details

### Dashboard
- Overview of accounts
- Recent transactions
- Pending loan applications

---

## Technologies Used

- Python
- Django
- HTML
- CSS
- Bootstrap
- PostgreSQL
- Docker

## Database Models

### UserProfile
Stores additional user information such as phone, address, and profile picture.

### BankAccount
Represents user bank accounts with account number, type, and balance.

### Transaction
Records financial transactions including transfers, deposits, and withdrawals.

### Loan
Stores loan applications including amount, type, duration, and status.

---

## Security Features

The system includes several security measures:

- Django authentication system
- CSRF protection
- Session management
- Atomic database transactions
- User account ownership verification

---

## How to Run the Project

### Using Docker

1. Download and extract the zip file

2. To start the containers, open cmd and in in project directory run the given command,

docker compose up --build

3. To run migrations for the databases run this command below,

docker compose exec main python manage.py migrate

4. Finally Access the application with any browser with the localhost link

http://localhost:8000

5. Create User Accounts

Register a new user account from the registration page

(Optional) Create a second user account to test transfers between users

6. Login

Login using the credentials created during registration

You will be redirected to the dashboard

7. Create Bank Account

Navigate to the Accounts page

Create a new account (e.g., Savings or Standard)

The account will appear in both:

Accounts page

Dashboard

8. Deposit Funds

Go to the Deposit page

Select an account and add funds

Confirm the balance updates correctly

9. Transfer Funds (Same User)

Transfer money between your own accounts

(e.g., Standard → Savings)

Check:

Sender balance decreases

Receiver balance increases

10. Transfer Funds (Between Users)

Login as User A

Send money to User B using their account number

Logout and login as User B

Verify the received funds

11. Withdraw Funds

Go to the Withdraw page

Withdraw money from an account

Ensure balance updates correctly

12. Transaction Logs

View transaction history on:

Dashboard

Transactions page

Confirm all actions (deposit, transfer, withdraw) are recorded

13. Loan Feature

Apply for a loan via the Loans page

Check loan status (e.g., Pending)

Verify it appears on the dashboard

14. Profile Management

Navigate to Profile

Add/edit:

Phone number

Address

Profile picture

Confirm updates are saved

## Author

Ziaul Haque Rafi
A00096932
MEng Electronic and Computer Engineering  
Dublin City University