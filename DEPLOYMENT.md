# JEWELIA Platform - Deployment Guide

## Deployment Summary

The JEWELIA platform has been successfully built and deployed with the following components:

### Frontend Deployment
- **Platform**: Vercel
- **Production URL**: https://agentic-8c056e7c.vercel.app
- **Status**: ✅ Successfully Deployed
- **Build**: Production-ready React + TypeScript + Tailwind CSS
- **Features**: All customer and shop owner features implemented

### Backend (NestJS API)
- **Status**: ✅ Built and Ready for Deployment
- **Technology**: NestJS + TypeScript + PostgreSQL
- **Documentation**: Swagger/OpenAPI at `/api` endpoint
- **Deployment Options**: Docker, Kubernetes, or any Node.js hosting

## What's Deployed

### Frontend (Vercel)
The complete React frontend is deployed and includes:
- Home page with featured products and categories
- Product browsing with advanced filters (location, category, AR, try-at-home)
- Shop directory with location-based filtering
- Product detail pages with AR preview integration
- Shop owner dashboard
- User authentication (login/register)
- WhatsApp integration for direct shop contact
- Responsive design with Tailwind CSS

### Backend (Ready for Deployment)
The complete NestJS backend is built and includes:
- JWT authentication and authorization
- User management (customers, shop owners, admins)
- Shop management with location hierarchy
- Product catalog with categories
- Order management with try-at-home support
- Reviews and ratings system
- Location-based filtering (State → City → District → Taluka)
- AR preview support
- WhatsApp integration
- Complete OpenAPI/Swagger documentation
- Database seed data with test accounts

## Test Accounts

After seeding the database:
- **Admin**: admin@jewelia.com / password123
- **Shop Owner 1**: rajesh@goldenjewelers.com / password123
- **Shop Owner 2**: priya@silvergems.com / password123
- **Customer**: amit@example.com / password123

## Backend Deployment Options

### Option 1: Docker
```bash
cd backend
docker build -t jewelia-backend .
docker run -p 3000:3000 --env-file .env jewelia-backend
```

### Option 2: Kubernetes
```bash
cd backend/k8s
kubectl apply -f secrets.yaml
kubectl apply -f postgres.yaml
kubectl apply -f deployment.yaml
```

### Option 3: Traditional Node.js
```bash
cd backend
npm install
npm run build
npm run start:prod
```

## GitHub Repository
https://github.com/Design-Arena-Gens/agentic-8c056e7c/tree/devin/1761387638-jewelia-platform
