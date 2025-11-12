import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Application, ApplicationsData } from '@/lib/types/application';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Read the applications.json file
    const filePath = path.join(process.cwd(), 'data', 'applications.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data: ApplicationsData = JSON.parse(fileContents);

    // Find the application by ID
    const application = data.applications.find(app => app.id === params.id);

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          error: 'Application not found',
          message: `No application found with ID: ${params.id}`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application: application
    });
  } catch (error) {
    console.error('Error reading application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read application',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
