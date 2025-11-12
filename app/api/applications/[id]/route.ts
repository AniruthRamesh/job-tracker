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

    // Find the application by ID (convert string param to number)
    const applicationId = parseInt(params.id, 10);
    const application = data.applications.find(app => app.id === applicationId);

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Parse the request body
    const updates: Partial<Application> = await request.json();

    // Read the applications.json file
    const filePath = path.join(process.cwd(), 'data', 'applications.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data: ApplicationsData = JSON.parse(fileContents);

    // Find the application index (convert string param to number)
    const applicationId = parseInt(params.id, 10);
    const applicationIndex = data.applications.findIndex(app => app.id === applicationId);

    if (applicationIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Application not found',
          message: `No application found with ID: ${params.id}`
        },
        { status: 404 }
      );
    }

    // Update the application (merge with existing data)
    data.applications[applicationIndex] = {
      ...data.applications[applicationIndex],
      ...updates,
      id: applicationId // Ensure ID cannot be changed
    };

    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      application: data.applications[applicationIndex]
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update application',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
