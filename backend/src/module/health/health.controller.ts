import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => new SimpleHealthIndicator().check('application'),
    ]);
  }
}

class SimpleHealthIndicator extends HealthIndicator {
  public check(key: string): HealthIndicatorResult {
    return super.getStatus(key, true, { message: 'Up and running' });
  }
}
