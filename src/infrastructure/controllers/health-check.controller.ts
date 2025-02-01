import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthCheckController {
  @Get()
  @ApiOperation({
    summary: 'Health Check Endpoint',
    description: 'Checks if the application is running and healthy.',
  })
  @ApiResponse({
    status: 200,
    description: 'The application is up and running.',
    schema: {
      example: { status: 'ok' },
    },
  })
  getHealth(): any {
    return { status: 'ok' };
  }
}
