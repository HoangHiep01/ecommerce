import { Controller, Get, Param } from '@nestjs/common';
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
  @Get('revenue/day/:day/:month/:year')
  dayRevenue(
    @Param('day') day: string,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.reportService.getDayRevenue(day, month, year);
  }

  // @ApiDocument('Get sales revenue by week', 'Total income of the week')
  // @Get('revenue/week/:day/:month/:year')
  // weekRevenue(@Param('day') day: string, @Param('month') month: string, @Param('year') year: string) {}

  @ApiDocument('Get sales revenue by month', 'Total income of the month')
  @Get('revenue/:month/:year')
  monthRevenue(@Param('month') month: string, @Param('year') year: string) {
    return this.reportService.getMonthRevenue(month, year);
  }

  @ApiDocument('Get sales revenue by year', 'Total income of the year')
  @Get('revenue/:year')
  yearRevenue(@Param('year') year: string) {
    return this.reportService.getYearRevenue(year);
  }
}
