# KYC Agentic Workflow

An AI-powered multi-agent system for Know Your Customer (KYC) processes using Google's Agent Development Kit (ADK), Vertex AI Gemini models, Search Grounding, and BigQuery.

## Architecture

This solution implements a multi-agent architecture with:

- **Root KYC Agent**: Orchestrates the overall workflow
- **Document Checker**: Analyzes uploaded documents for consistency and validity
- **Resume Crosschecker**: Verifies resume information against public sources
- **External Search**: Conducts due diligence searches for adverse media and sanctions
- **Wealth Calculator**: Assesses client's financial position

## Features

- Automated document analysis and verification
- External web searches with grounding for accuracy
- Internal database integration with BigQuery
- Comprehensive KYC report generation
- Multi-modal document processing
- Source attribution and auditability

## Tech Stack

- Google Agent Development Kit (ADK)
- Vertex AI Gemini Models
- Search Grounding
- BigQuery
- FastAPI (Backend)
- React + TypeScript (Frontend)
- Tailwind CSS

## Setup

1. Install dependencies
2. Configure Google Cloud credentials
3. Set up BigQuery database
4. Run the application

## Usage

Upload customer documents and information to initiate the KYC process. The system will automatically:

1. Check internal databases for existing records
2. Analyze documents for discrepancies
3. Verify resume information
4. Conduct external due diligence
5. Calculate wealth assessment
6. Generate comprehensive KYC report


npm run dev