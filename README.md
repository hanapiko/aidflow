# AidFlow

AidFlow is a web application built with SvelteKit that enables anonymous donations to social projects through M-Pesa integration. The platform provides an intuitive interface for donors and an administrative dashboard for tracking donations.

## Features

- **Anonymous Donations**: Users can donate to projects without signing up
- **M-Pesa Integration**: Seamless payment processing through M-Pesa STK Push
- **Project Listings**: Browse and view detailed information about various social projects
- **Real-time Progress Tracking**: Visual representation of project funding progress
- **Admin Dashboard**: Track and manage donations across all projects
- **Responsive Design**: Works smoothly on both desktop and mobile devices

## Tech Stack

- **Frontend**: SvelteKit
- **Backend**: Node.js with SvelteKit endpoints
- **Database**: MySQL
- **Payment**: M-Pesa API integration
- **Styling**: Custom CSS with responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hanapiko/aidflow.git
cd aidflow
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=aidflow_user
DB_PASSWORD=your_database_password
DB_NAME=aidflow_db

# Mpesa API Configuration
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=your_shortcode
MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback

# Node Environment
NODE_ENV=development
```

4. Set up the database:
```bash
mysql -u root -p < schema.sql
```

## Development

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
aidflow/
├── src/
│   ├── lib/
│   │   ├── components/    # Reusable components
│   │   ├── database/      # Database configuration
│   │   └── mpesa.js      # M-Pesa integration
│   ├── routes/
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API endpoints
│   │   └── projects/     # Project pages
│   └── styles/           # Global styles
├── static/               # Static assets
└── schema.sql           # Database schema
```

## API Endpoints

- `POST /api/donations`: Create a new donation record
- `POST /api/mpesa/stk`: Initiate M-Pesa STK Push
- `POST /api/mpesa/callback`: Handle M-Pesa payment callbacks
- `GET /api/projects`: List all projects
- `GET /api/projects/:id`: Get project details

## Database Schema

The application uses two main tables:
- `projects`: Stores project information and funding progress
- `donations`: Records all donation transactions and their status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- SvelteKit team for the amazing framework
- Safaricom for the M-Pesa API
- All contributors who help improve this project
