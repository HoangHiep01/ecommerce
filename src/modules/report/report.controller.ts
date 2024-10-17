import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { ApiDocument } from '../../decorators/document.decorator';
import { Role } from '../../decorators/role.decorator';
import { UserRole } from '../../constants/user-role-type';

@ApiTags('Report')
@Role(UserRole.OWNER)
@ApiBearerAuth('JWT-auth')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiDocument('Get top 10 best seller', 'List 10 best-selling products')
  @Get('top')
  topTen() {
    return this.reportService.getTopTen();
  }

  @ApiDocument('Get sales revenue by day', 'Total income of the day')
  @Get('revenue/day')
  dayRevenue() {}

  @ApiDocument('Get sales revenue by week', 'Total income of the week')
  @Get('revenue/week')
  weekRevenue() {}

  @ApiDocument('Get sales revenue by month', 'Total income of the month')
  @Get('revenue/month')
  monthRevenue() {}

  @ApiDocument('Get sales revenue by year', 'Total income of the year')
  @Get('revenue/year')
  yearRevenue() {}
}
