import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Application, ApplicationsData } from '@/lib/types/application';

// Helper function to get current month in YYYY-MM format
function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// Helper function to filter applications by month
function filterByMonth(applications: Application[], month: string): Application[] {
  return applications.filter(app => {
    const appMonth = app.dateReceived.substring(0, 7); // Extract YYYY-MM
    return appMonth === month;
  });
}

export async function GET(request: NextRequest) {
  try {
    // Read the applications.json file
    const filePath = path.join(process.cwd(), 'data', 'applications.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data: ApplicationsData = JSON.parse(fileContents);

    // Get month from query parameters, default to current month
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get('month');
    const month = monthParam || getCurrentMonth();

    // Filter applications by month
    const filteredApplications = filterByMonth(data.applications, month);

    return NextResponse.json({
      success: true,
      month: month,
      count: filteredApplications.length,
      applications: filteredApplications
    });
  } catch (error) {
    console.error('Error reading applications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read applications',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
