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


## Author

Ziaul Haque Rafi
A00096932
MEng Electronic and Computer Engineering  
Dublin City University